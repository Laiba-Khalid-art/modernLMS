/**
 * Playwright → Jira Reporter
 * Auto-creates a Jira Task (with "bug" label) for every failed test scenario.
 * Routes through the MCP server for consistent logging.
 */

const mcp = require('../../mcp/mcpServer');
const axios = require('axios');
const path  = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../backend/.env') });

const JIRA_BASE_URL   = process.env.JIRA_BASE_URL;
const JIRA_API_TOKEN  = process.env.JIRA_API_TOKEN;
const PROJECT_KEY     = process.env.JIRA_PROJECT_KEY || 'KAN';

const client = JIRA_BASE_URL && JIRA_API_TOKEN ? axios.create({
  baseURL: `${JIRA_BASE_URL}/rest/api/3`,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  auth: { username: process.env.JIRA_EMAIL, password: JIRA_API_TOKEN }
}) : null;

async function findExistingBug(scenarioName) {
  if (!client) return null;
  try {
    const { data } = await client.post('/search/jql', {
      jql: `project = ${PROJECT_KEY} AND summary ~ "${scenarioName.replace(/"/g, '\\"')}" AND status != Done`,
      maxResults: 1,
      fields: ['summary']
    });
    return data.issues?.[0] || null;
  } catch { return null; }
}

async function createJiraBug({ scenarioName, errorMessage, stackTrace, screenshotPath, executionTime, environment = 'local' }) {
  if (!JIRA_BASE_URL || !JIRA_API_TOKEN || JIRA_API_TOKEN === 'your_jira_api_token') {
    console.log('[JiraReporter] Jira credentials not configured — skipping bug creation.');
    return null;
  }

  const title = `[AUTO][PLAYWRIGHT] Failed Scenario - ${scenarioName}`;

  const existing = await findExistingBug(scenarioName);
  if (existing) {
    console.log(`[JiraReporter] Duplicate found: ${existing.key} — updating with latest failure.`);
    // Add a comment to the existing ticket with this run's details
    await mcp.update_issue({
      key    : existing.key,
      comment: `Re-occurred in ${environment} at ${new Date().toISOString()}.\n\nError: ${errorMessage || 'No message'}\nExecution time: ${executionTime}ms`
    });
    await mcp.log_event({
      event   : `Test failure (re-occurred): ${scenarioName}`,
      module  : 'Playwright',
      details : `Environment: ${environment} | Error: ${errorMessage}`,
      issueKey: existing.key,
      severity: 'error'
    });
    return existing.key;
  }

  // Create new bug task via MCP
  const description = [
    `Automated Bug Report — Playwright`,
    ``,
    `Scenario: ${scenarioName}`,
    `Environment: ${environment}`,
    `Execution Time: ${executionTime}ms`,
    `Timestamp: ${new Date().toISOString()}`,
    ``,
    `Error:`,
    `${errorMessage || 'No error message.'}`,
    ``,
    stackTrace ? `Stack Trace:\n${stackTrace}` : '',
    screenshotPath ? `Screenshot: ${screenshotPath}` : 'No screenshot captured.'
  ].filter(l => l !== undefined).join('\n');

  const key = await mcp.create_issue({
    type       : 'Bug',
    summary    : title,
    description,
    labels     : ['automation', 'playwright', 'lms'],
    priority   : 'High'
  });

  if (key) {
    await mcp.log_event({
      event   : `New Playwright failure: ${scenarioName}`,
      module  : 'Playwright',
      details : `Environment: ${environment} | Error: ${errorMessage}`,
      issueKey: key,
      severity: 'error'
    });
    console.log(`[JiraReporter] Bug created: ${key}`);
  }

  return key;
}

module.exports = { createJiraBug };
