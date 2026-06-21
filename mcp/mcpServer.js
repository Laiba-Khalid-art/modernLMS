/**
 * MCP Server — Jira Orchestration Layer
 * Bridges the LMS backend with Jira.
 *
 * Supports:
 *   create_issue(params)   — Create Epic / Task / Bug
 *   update_issue(params)   — Update status, add comment, change priority
 *   log_event(params)      — Record a system event (logs locally + Jira comment)
 *   sync_status(params)    — Pull live project status from Jira
 */

require('dotenv').config({ path: require('path').join(__dirname, '../backend/.env') });
const axios = require('axios');
const fs    = require('fs');
const path  = require('path');

const PROJECT_KEY = process.env.JIRA_PROJECT_KEY || 'KAN';
const EVENTS_LOG  = path.join(__dirname, '../reports/mcp-events.json');

const client = axios.create({
  baseURL: `${process.env.JIRA_BASE_URL}/rest/api/3`,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  auth: { username: process.env.JIRA_EMAIL, password: process.env.JIRA_API_TOKEN }
});

class MCPServer {

  // ─────────────────────────────────────────────────────────────
  // create_issue
  //   type     : 'Epic' | 'Task' | 'Bug'   (Bug → Task + label)
  //   summary  : string
  //   description : string
  //   labels   : string[]
  //   epicKey  : string | null   (parent Epic key)
  //   priority : 'Highest'|'High'|'Medium'|'Low'|'Lowest'
  // ─────────────────────────────────────────────────────────────
  async create_issue({ type = 'Task', summary, description = '', labels = [], epicKey = null, priority = 'Medium' }) {
    // KAN project has no "Bug" issue type — use Task + "bug" label
    const issueType = type === 'Bug' ? 'Task' : type;
    const allLabels = [...labels, ...(type === 'Bug' ? ['bug'] : [])].filter(Boolean);

    const fields = {
      project     : { key: PROJECT_KEY },
      summary,
      issuetype   : { name: issueType },
      priority    : { name: priority },
      labels      : allLabels,
      description : this._doc(description)
    };

    if (epicKey && issueType !== 'Epic') {
      fields.parent = { key: epicKey };
    }

    try {
      const { data } = await client.post('/issue', { fields });
      this._persist('create_issue', { key: data.key, type, summary });
      return data.key;
    } catch (err) {
      // Retry without parent if linking fails
      if (epicKey) {
        delete fields.parent;
        try {
          const { data } = await client.post('/issue', { fields });
          this._persist('create_issue', { key: data.key, type, summary, note: 'parent skipped' });
          return data.key;
        } catch {}
      }
      const errMsg = JSON.stringify(err.response?.data?.errors || err.message);
      this._persist('create_issue_failed', { summary, error: errMsg });
      return null;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // update_issue
  //   key      : 'KAN-1'
  //   status   : 'In Progress' | 'Done' | 'To Do'
  //   comment  : string
  //   priority : string
  // ─────────────────────────────────────────────────────────────
  async update_issue({ key, status, comment, priority }) {
    const results = [];

    if (comment) {
      try {
        await client.post(`/issue/${key}/comment`, { body: this._doc(comment) });
        results.push('comment added');
      } catch (e) { results.push(`comment failed: ${e.message}`); }
    }

    if (status) {
      try {
        const { data: td } = await client.get(`/issue/${key}/transitions`);
        const t = td.transitions.find(t => t.name.toLowerCase().includes(status.toLowerCase()));
        if (t) {
          await client.post(`/issue/${key}/transitions`, { transition: { id: t.id } });
          results.push(`status → ${status}`);
        } else {
          results.push(`transition "${status}" not found. Available: ${td.transitions.map(t => t.name).join(', ')}`);
        }
      } catch (e) { results.push(`transition failed: ${e.message}`); }
    }

    if (priority) {
      try {
        await client.put(`/issue/${key}`, { fields: { priority: { name: priority } } });
        results.push(`priority → ${priority}`);
      } catch { results.push('priority update failed'); }
    }

    this._persist('update_issue', { key, results });
    return { key, results };
  }

  // ─────────────────────────────────────────────────────────────
  // log_event
  //   event    : string   e.g. 'Migration completed'
  //   module   : string   e.g. 'CSV Migration'
  //   details  : string
  //   issueKey : string | null   — if given, adds Jira comment
  //   severity : 'info' | 'warn' | 'error'
  // ─────────────────────────────────────────────────────────────
  async log_event({ event, module = 'system', details = '', issueKey = null, severity = 'info' }) {
    const entry = {
      timestamp: new Date().toISOString(),
      severity,
      event,
      module,
      details,
      issueKey
    };

    if (issueKey) {
      try {
        const text = `[${severity.toUpperCase()}] ${event}\n\nModule: ${module}\n${details ? `\nDetails:\n${details}` : ''}\n\nTimestamp: ${entry.timestamp}`;
        await client.post(`/issue/${issueKey}/comment`, { body: this._doc(text) });
        entry.commented = true;
      } catch { entry.commented = false; }
    }

    this._persist('log_event', entry);
    return entry;
  }

  // ─────────────────────────────────────────────────────────────
  // sync_status
  //   Returns a full project status summary from Jira
  // ─────────────────────────────────────────────────────────────
  async sync_status() {
    try {
      const { data } = await client.post('/search/jql', {
        jql       : `project = ${PROJECT_KEY} ORDER BY issuetype ASC, created ASC`,
        maxResults: 200,
        fields    : ['summary', 'status', 'issuetype', 'labels', 'priority', 'parent']
      });

      const all    = data.issues;
      const epics  = all.filter(i => i.fields.issuetype.name === 'Epic');
      const tasks  = all.filter(i => i.fields.issuetype.name !== 'Epic');

      const byStatus = (s) => tasks.filter(i => i.fields.status.name === s).length;
      const done     = byStatus('Done');
      const inProg   = byStatus('In Progress');
      const todo     = byStatus('To Do');
      const total    = tasks.length;
      const pct      = total > 0 ? Math.round((done / total) * 100) : 0;

      const report = {
        timestamp        : new Date().toISOString(),
        projectKey       : PROJECT_KEY,
        totalEpics       : epics.length,
        totalTasks       : total,
        done, inProgress : inProg, todo,
        completionPercent: pct,
        epics: epics.map(e => ({
          key   : e.key,
          name  : e.fields.summary,
          status: e.fields.status.name
        })),
        bugs: tasks.filter(i => i.fields.labels?.includes('bug')).map(i => ({
          key    : i.key,
          summary: i.fields.summary,
          status : i.fields.status.name
        }))
      };

      this._persist('sync_status', report);
      return report;
    } catch (err) {
      const msg = err.response?.data || err.message;
      this._persist('sync_status_failed', { error: JSON.stringify(msg) });
      throw new Error(JSON.stringify(msg));
    }
  }

  // ─────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────
  _doc(text) {
    if (!text) return undefined;
    return {
      version: 1, type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: String(text) }] }]
    };
  }

  _persist(action, data) {
    try {
      const dir = path.dirname(EVENTS_LOG);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      let log = [];
      if (fs.existsSync(EVENTS_LOG)) {
        try { log = JSON.parse(fs.readFileSync(EVENTS_LOG, 'utf-8')); } catch {}
      }
      log.push({ action, data, timestamp: new Date().toISOString() });
      // Keep last 500 events
      if (log.length > 500) log = log.slice(-500);
      fs.writeFileSync(EVENTS_LOG, JSON.stringify(log, null, 2));
    } catch {}
  }
}

module.exports = new MCPServer();
