#!/usr/bin/env node
/**
 * MCP CLI — Command Line Interface for the LMS MCP Server
 *
 * Usage:
 *   node mcp/index.js setup                                  # Create all Jira Epics + Tasks
 *   node mcp/index.js sync                                   # Show project status
 *   node mcp/index.js create <type> "<summary>" [epicKey]   # Create issue
 *   node mcp/index.js update <key> [--status <s>] [--comment <c>] [--priority <p>]
 *   node mcp/index.js log <event> <module> [details]        # Log event
 *   node mcp/index.js list                                   # List all open tickets
 */

const mcp = require('./mcpServer');

const [,, command, ...args] = process.argv;

async function main() {
  switch (command) {

    // ─── SETUP: Create all Epics + Tasks ─────────────
    case 'setup':
      require('./setupJira');
      break;

    // ─── SYNC: Show project status ────────────────────
    case 'sync': {
      const status = await mcp.sync_status();
      if (!status) { console.error('Sync failed.'); break; }
      console.log('\n╔══════════════════════════════════════╗');
      console.log(`║  Project: ${status.projectKey.padEnd(27)}║`);
      console.log('╠══════════════════════════════════════╣');
      console.log(`║  Epics      : ${String(status.totalEpics).padEnd(23)}║`);
      console.log(`║  Tasks      : ${String(status.totalTasks).padEnd(23)}║`);
      console.log(`║  Done       : ${String(status.done).padEnd(23)}║`);
      console.log(`║  In Progress: ${String(status.inProgress).padEnd(23)}║`);
      console.log(`║  To Do      : ${String(status.todo).padEnd(23)}║`);
      console.log(`║  Completion : ${String(status.completionPercent + '%').padEnd(23)}║`);
      console.log('╚══════════════════════════════════════╝\n');
      if (status.bugs?.length) {
        console.log(`  Open Bug Tasks (${status.bugs.length}):`);
        status.bugs.forEach(b => console.log(`    ${b.key} [${b.status}] ${b.summary.slice(0, 60)}`));
        console.log('');
      }
      break;
    }

    // ─── CREATE: Create an issue ──────────────────────
    case 'create': {
      const [type, summary, epicKey] = args;
      if (!type || !summary) {
        console.error('Usage: node mcp/index.js create <Epic|Task|Bug> "<summary>" [epicKey]');
        break;
      }
      const key = await mcp.create_issue({ type, summary, epicKey: epicKey || null });
      if (key) console.log(`\n  Created: ${key}`);
      break;
    }

    // ─── UPDATE: Update an issue ──────────────────────
    case 'update': {
      const [issueKey] = args;
      if (!issueKey) { console.error('Usage: node mcp/index.js update <KAN-1> [--status <s>] [--comment <c>]'); break; }
      const flags = parseFlags(args.slice(1));
      const result = await mcp.update_issue({
        key     : issueKey,
        status  : flags.status,
        comment : flags.comment,
        priority: flags.priority
      });
      console.log(`\n  Updated ${result.key}: ${result.results.join(', ')}`);
      break;
    }

    // ─── LOG: Log an event ────────────────────────────
    case 'log': {
      const [event, module, details] = args;
      if (!event) { console.error('Usage: node mcp/index.js log "<event>" <module> [details]'); break; }
      const entry = await mcp.log_event({ event, module: module || 'system', details: details || '' });
      console.log(`\n  Event logged: ${JSON.stringify(entry, null, 2)}`);
      break;
    }

    // ─── LIST: List open tickets ──────────────────────
    case 'list': {
      const axios = require('axios');
      require('dotenv').config({ path: require('path').join(__dirname, '../backend/.env') });
      const client = axios.create({
        baseURL: `${process.env.JIRA_BASE_URL}/rest/api/3`,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        auth: { username: process.env.JIRA_EMAIL, password: process.env.JIRA_API_TOKEN }
      });
      const pk = process.env.JIRA_PROJECT_KEY || 'KAN';
      const { data } = await client.post('/search/jql', {
        jql: `project = ${pk} AND status in ("To Do","In Progress") ORDER BY issuetype ASC, created ASC`,
        maxResults: 100,
        fields: ['summary', 'status', 'issuetype', 'priority']
      });
      console.log(`\nOpen Tickets in ${pk} (${data.issues?.length || 0}):\n`);
      data.issues?.forEach(i => {
        const prio = i.fields.priority?.name || '?';
        const type = i.fields.issuetype.name.padEnd(5);
        const stat = i.fields.status.name.padEnd(11);
        console.log(`  ${i.key.padEnd(8)} [${type}] [${stat}] [${prio.padEnd(7)}] ${i.fields.summary.slice(0, 60)}`);
      });
      console.log('');
      break;
    }

    default:
      console.log(`
MCP Server CLI — LMS Jira Orchestration

Commands:
  node mcp/index.js setup                               Create all Epics + Tasks
  node mcp/index.js sync                                Project status report
  node mcp/index.js list                                List open tickets
  node mcp/index.js create <Epic|Task|Bug> "<summary>" [epicKey]
  node mcp/index.js update <KAN-1> --status "In Progress" --comment "..." --priority High
  node mcp/index.js log "<event>" <module> [details]
      `);
  }
}

function parseFlags(args) {
  const result = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--') && args[i + 1]) {
      result[args[i].slice(2)] = args[i + 1];
      i++;
    }
  }
  return result;
}

main().catch(err => {
  console.error('\nError:', err.response?.data || err.message);
  process.exit(1);
});
