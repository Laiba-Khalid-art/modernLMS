/**
 * Bulk status update — reflects actual project completion state.
 *
 * Done        : All implemented features (82 tickets)
 * In Progress : KAN-8 (CSV Migration epic — rollback task still pending)
 * To Do       : KAN-1 (playwright bug), KAN-17 (rollback strategy)
 *
 * Run: node mcp/updateStatuses.js
 */

const mcp = require('./mcpServer');

// ─── CLASSIFICATION ───────────────────────────────────────────────────────────

const DONE = [
  // Epic: Legacy System Analysis (all 5 tasks done + epic itself)
  'KAN-2', 'KAN-3', 'KAN-4', 'KAN-5', 'KAN-6', 'KAN-7',

  // Epic: CSV Migration (8 of 9 tasks done; KAN-17 rollback not implemented)
  // Epic KAN-8 → In Progress (see below)
  'KAN-9', 'KAN-10', 'KAN-11', 'KAN-12', 'KAN-13', 'KAN-14', 'KAN-15', 'KAN-16',

  // Epic: Authentication Module (all 12 tasks done + epic)
  'KAN-18', 'KAN-19', 'KAN-20', 'KAN-21', 'KAN-22', 'KAN-23',
  'KAN-24', 'KAN-25', 'KAN-26', 'KAN-27', 'KAN-28', 'KAN-29', 'KAN-30',

  // Epic: Book Management Module (all 8 tasks done + epic)
  'KAN-31', 'KAN-32', 'KAN-33', 'KAN-34', 'KAN-35', 'KAN-36', 'KAN-37', 'KAN-38', 'KAN-39',

  // Epic: Student Management Module (all 7 tasks done + epic)
  'KAN-40', 'KAN-41', 'KAN-42', 'KAN-43', 'KAN-44', 'KAN-45', 'KAN-46', 'KAN-47',

  // Epic: Issue Book Module (all 7 tasks done + epic)
  'KAN-48', 'KAN-49', 'KAN-50', 'KAN-51', 'KAN-52', 'KAN-53', 'KAN-54', 'KAN-55',

  // Epic: Return Book Module (all 6 tasks done + epic)
  'KAN-56', 'KAN-57', 'KAN-58', 'KAN-59', 'KAN-60', 'KAN-61', 'KAN-62',

  // Epic: Fine Calculation Module (all 6 tasks done + epic)
  'KAN-63', 'KAN-64', 'KAN-65', 'KAN-66', 'KAN-67', 'KAN-68', 'KAN-69',

  // Epic: Dashboard Module (all 8 tasks done + epic)
  'KAN-70', 'KAN-71', 'KAN-72', 'KAN-73', 'KAN-74', 'KAN-75', 'KAN-76', 'KAN-77', 'KAN-78',

  // Epic: Reports Module (all 6 tasks done + epic)
  'KAN-79', 'KAN-80', 'KAN-81', 'KAN-82', 'KAN-83', 'KAN-84', 'KAN-85',
];

const IN_PROGRESS = [
  'KAN-8',  // CSV Migration epic — KAN-17 rollback not yet implemented
];

// KAN-1 (playwright bug) and KAN-17 (rollback) stay in "To Do"

// ─── RUNNER ───────────────────────────────────────────────────────────────────

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function transition(key, status, label) {
  const result = await mcp.update_issue({ key, status });
  const ok = result.results.some(r => r.includes('→') || r.includes('status'));
  const icon = ok ? '✓' : '↷';
  console.log(`  ${icon} ${key.padEnd(8)} → ${label.padEnd(12)} ${ok ? '' : `(${result.results[0]})`}`);
  await delay(250);
}

async function run() {
  console.log('\n══════════════════════════════════════════════');
  console.log('  Bulk Status Update — LMS Project');
  console.log('══════════════════════════════════════════════\n');

  console.log(`Marking ${DONE.length} tickets as Done...\n`);
  for (const key of DONE) {
    await transition(key, 'Done', 'Done');
  }

  console.log(`\nMarking ${IN_PROGRESS.length} ticket(s) as In Progress...\n`);
  for (const key of IN_PROGRESS) {
    await transition(key, 'In Progress', 'In Progress');
  }

  console.log('\n══════════════════════════════════════════════');
  console.log(`  Done        : ${DONE.length} tickets`);
  console.log(`  In Progress : ${IN_PROGRESS.length} ticket(s)  (KAN-8)`);
  console.log(`  To Do       : 2 tickets  (KAN-1, KAN-17)`);
  console.log('══════════════════════════════════════════════\n');

  // Final sync report
  console.log('Fetching final project status...\n');
  const status = await mcp.sync_status();
  if (status) {
    console.log(`  Project    : ${status.projectKey}`);
    console.log(`  Epics      : ${status.totalEpics}`);
    console.log(`  Total tasks: ${status.totalTasks}`);
    console.log(`  Done       : ${status.done}`);
    console.log(`  In Progress: ${status.inProgress}`);
    console.log(`  To Do      : ${status.todo}`);
    console.log(`  Completion : ${status.completionPercent}%`);
  }
}

run().catch(err => {
  console.error('\nError:', err.response?.data || err.message);
  process.exit(1);
});
