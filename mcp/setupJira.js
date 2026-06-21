/**
 * One-time Jira setup script — creates all Epics and Tasks for the LMS project.
 * Run with: node mcp/setupJira.js
 *
 * Safe to re-run — duplicate detection skips existing issues.
 */

const mcp = require('./mcpServer');

// ──────────────────────────────────────────────
// STRUCTURE: Each module becomes a Jira Epic.
//            Each work item becomes a Task.
// ──────────────────────────────────────────────

const MODULES = [
  {
    epic: 'Legacy System Analysis',
    description: 'Review and document the existing C++ + CSV library management system before migration.',
    labels: ['legacy', 'analysis'],
    tasks: [
      { summary: 'Analyze C++ source code structure (main.cpp)',              priority: 'High',   labels: ['analysis'] },
      { summary: 'Document CSV file formats: books, students, issued',        priority: 'High',   labels: ['analysis'] },
      { summary: 'Identify existing business rules from legacy system',       priority: 'Medium', labels: ['analysis'] },
      { summary: 'Map C++ data structures to MongoDB schema design',          priority: 'High',   labels: ['analysis', 'design'] },
      { summary: 'Produce gap analysis report between legacy and new system', priority: 'Medium', labels: ['analysis', 'docs'] },
    ]
  },
  {
    epic: 'CSV to MongoDB Migration',
    description: 'Migrate all legacy CSV data into MongoDB collections. Run: node migration/migrate.js',
    labels: ['migration', 'mongodb'],
    tasks: [
      { summary: 'Implement CSV parser for books.csv',                                   priority: 'High',    labels: ['migration'] },
      { summary: 'Implement CSV parser for students.csv',                                priority: 'High',    labels: ['migration'] },
      { summary: 'Implement CSV parser for issued_books.csv',                            priority: 'High',    labels: ['migration'] },
      { summary: 'Migrate books collection (bookId auto-increment from 1)',              priority: 'High',    labels: ['migration', 'backend'] },
      { summary: 'Migrate students collection (studentId starting at 1001)',             priority: 'High',    labels: ['migration', 'backend'] },
      { summary: 'Migrate issued books collection (issueId auto-increment from 1)',      priority: 'High',    labels: ['migration', 'backend'] },
      { summary: 'Create default admin user (admin@library.com / Admin@1234)',           priority: 'High',    labels: ['migration', 'auth'] },
      { summary: 'Data validation and integrity checks post-migration',                  priority: 'Medium',  labels: ['migration', 'testing'] },
      { summary: 'Rollback strategy for failed migrations',                              priority: 'Low',     labels: ['migration', 'ops'] },
    ]
  },
  {
    epic: 'Authentication Module',
    description: 'JWT-based auth with role-based access control (admin / student).',
    labels: ['auth', 'security'],
    tasks: [
      { summary: 'Backend: POST /api/auth/login — JWT token issuance',                  priority: 'Highest', labels: ['backend', 'auth'] },
      { summary: 'Backend: POST /api/auth/register — admin-only user creation',         priority: 'Highest', labels: ['backend', 'auth'] },
      { summary: 'Backend: GET /api/auth/profile — validate token & return user',       priority: 'High',    labels: ['backend', 'auth'] },
      { summary: 'Backend: PUT /api/auth/change-password — secure password update',     priority: 'Medium',  labels: ['backend', 'auth'] },
      { summary: 'Backend: GET /api/auth/users — list all user accounts',               priority: 'Medium',  labels: ['backend', 'auth'] },
      { summary: 'Backend: PUT /api/auth/users/:id — toggle isActive (deactivate)',     priority: 'High',    labels: ['backend', 'auth', 'security'] },
      { summary: 'Backend: JWT protect middleware (verifyToken)',                        priority: 'Highest', labels: ['backend', 'auth', 'middleware'] },
      { summary: 'Backend: adminOnly middleware — restrict sensitive routes',            priority: 'High',    labels: ['backend', 'auth', 'middleware'] },
      { summary: 'Frontend: Landing Page — library intro with login CTA',               priority: 'Medium',  labels: ['frontend'] },
      { summary: 'Frontend: Login Page — JWT auth with role-based redirect',            priority: 'Highest', labels: ['frontend', 'auth'] },
      { summary: 'Frontend: AuthContext — server-side session validation on app load',  priority: 'High',    labels: ['frontend', 'auth', 'security'] },
      { summary: 'Security fix: deactivated users blocked at API and frontend levels',  priority: 'High',    labels: ['security', 'bug'] },
    ]
  },
  {
    epic: 'Book Management Module',
    description: 'CRUD operations for library book catalog with availability tracking.',
    labels: ['books', 'catalog'],
    tasks: [
      { summary: 'Backend: GET /api/books — list with search/filter/pagination',        priority: 'High',    labels: ['backend', 'books'] },
      { summary: 'Backend: POST /api/books — add book with auto-increment bookId',      priority: 'High',    labels: ['backend', 'books'] },
      { summary: 'Backend: PUT /api/books/:id — update book (quantity validation)',     priority: 'High',    labels: ['backend', 'books'] },
      { summary: 'Backend: DELETE /api/books/:id — prevent delete if copies issued',   priority: 'High',    labels: ['backend', 'books', 'validation'] },
      { summary: 'Backend: GET /api/books/categories — distinct category list',         priority: 'Medium',  labels: ['backend', 'books'] },
      { summary: 'Backend: availableCopies auto-sync on issue/return',                  priority: 'High',    labels: ['backend', 'books'] },
      { summary: 'Frontend: Books Management Page — table, add/edit/delete modals',     priority: 'High',    labels: ['frontend', 'books'] },
      { summary: 'Validation: cannot reduce book quantity below issued copies count',   priority: 'Medium',  labels: ['validation', 'books'] },
    ]
  },
  {
    epic: 'Student Management Module',
    description: 'CRUD for student records with borrow history and status management.',
    labels: ['students'],
    tasks: [
      { summary: 'Backend: GET /api/students — list all students',                      priority: 'High',    labels: ['backend', 'students'] },
      { summary: 'Backend: POST /api/students — add student (studentId from 1001)',     priority: 'High',    labels: ['backend', 'students'] },
      { summary: 'Backend: PUT /api/students/:id — update student details',             priority: 'Medium',  labels: ['backend', 'students'] },
      { summary: 'Backend: DELETE /api/students/:id — check active issues first',      priority: 'High',    labels: ['backend', 'students', 'validation'] },
      { summary: 'Backend: GET /api/students/:id/history — full borrow history',        priority: 'Medium',  labels: ['backend', 'students'] },
      { summary: 'Frontend: Students Management Page — CRUD table with search',         priority: 'High',    labels: ['frontend', 'students'] },
      { summary: 'Validation: cannot delete student with active borrowed books',        priority: 'High',    labels: ['validation', 'students'] },
    ]
  },
  {
    epic: 'Issue Book Module',
    description: 'Issue books to students with availability check and borrowing limit enforcement.',
    labels: ['issue', 'circulation'],
    tasks: [
      { summary: 'Backend: POST /api/issues — issue book (checks availability)',        priority: 'Highest', labels: ['backend', 'issue'] },
      { summary: 'Backend: GET /api/issues — list all issue records with filters',     priority: 'High',    labels: ['backend', 'issue'] },
      { summary: 'Backend: Enforce max 3 books per student borrowing limit',            priority: 'High',    labels: ['backend', 'issue', 'validation'] },
      { summary: 'Backend: Decrement book.availableCopies on issue',                   priority: 'High',    labels: ['backend', 'issue'] },
      { summary: 'Frontend: Issue Book Page — student lookup + book lookup',            priority: 'High',    labels: ['frontend', 'issue'] },
      { summary: 'Frontend: Issue success receipt with issue summary details',          priority: 'Medium',  labels: ['frontend', 'issue'] },
      { summary: 'Fix: Mongoose 9 async hook — removed next() call (was TypeError)',   priority: 'Highest', labels: ['bug', 'backend', 'mongoose'] },
    ]
  },
  {
    epic: 'Return Book Module',
    description: 'Book return processing including fine collection workflow.',
    labels: ['return', 'circulation'],
    tasks: [
      { summary: 'Backend: PATCH /api/issues/:id/return — process return + fine',      priority: 'Highest', labels: ['backend', 'return'] },
      { summary: 'Backend: Increment book.availableCopies on return',                  priority: 'High',    labels: ['backend', 'return'] },
      { summary: 'Frontend: Return Book Page — search by Student ID',                  priority: 'High',    labels: ['frontend', 'return'] },
      { summary: 'Frontend: Show all active borrowed books for selected student',      priority: 'High',    labels: ['frontend', 'return'] },
      { summary: 'Frontend: Fine payment confirmation step before confirming return',  priority: 'High',    labels: ['frontend', 'return', 'fine'] },
      { summary: 'UX: Search by Student ID instead of Issue ID (more practical)',      priority: 'Medium',  labels: ['frontend', 'ux', 'return'] },
    ]
  },
  {
    epic: 'Fine Calculation Module',
    description: 'Automatic overdue fine calculation at Rs. 5/day after 14-day due period.',
    labels: ['fine', 'overdue'],
    tasks: [
      { summary: 'Backend: Fine calculator utility — Rs. 5/day after 14 days',         priority: 'High',    labels: ['backend', 'fine'] },
      { summary: 'Backend: Normalize dates to midnight (setHours 0,0,0,0) for accuracy', priority: 'High', labels: ['backend', 'fine'] },
      { summary: 'Backend: GET /api/issues/fines — fine summary and collection report', priority: 'Medium', labels: ['backend', 'fine'] },
      { summary: 'Backend: Track fine amount and collected status on return',           priority: 'High',    labels: ['backend', 'fine'] },
      { summary: 'Frontend: Fine amount displayed prominently in return workflow',      priority: 'Medium',  labels: ['frontend', 'fine'] },
      { summary: 'Frontend: Overdue books highlighted red in All Issues table',         priority: 'Medium',  labels: ['frontend', 'fine', 'ux'] },
    ]
  },
  {
    epic: 'Dashboard Module',
    description: 'Real-time dashboards for admin and student with live stats and overdue alerts.',
    labels: ['dashboard', 'ui'],
    tasks: [
      { summary: 'Backend: GET /api/issues/dashboard — aggregated library stats',      priority: 'High',    labels: ['backend', 'dashboard'] },
      { summary: 'Backend: Stats: totalBooks, availableBooks, issued, overdue, fines', priority: 'High',    labels: ['backend', 'dashboard'] },
      { summary: 'Frontend: Admin Dashboard — stat cards, bar chart, pie chart',       priority: 'High',    labels: ['frontend', 'dashboard'] },
      { summary: 'Frontend: Student Dashboard — borrowed books, overdue warnings',     priority: 'High',    labels: ['frontend', 'dashboard'] },
      { summary: 'Frontend: Real-time polling every 30s (setInterval + useRef cleanup)', priority: 'Medium', labels: ['frontend', 'dashboard'] },
      { summary: 'Frontend: LiveBadge component — pulsing dot + elapsed time counter', priority: 'Low',     labels: ['frontend', 'dashboard', 'ui'] },
      { summary: 'Frontend: Overdue alert banner with link to All Issues page',        priority: 'Medium',  labels: ['frontend', 'dashboard', 'ui'] },
      { summary: 'Frontend: Bell icon with live overdue count badge in sidebar',       priority: 'Medium',  labels: ['frontend', 'dashboard', 'ui'] },
    ]
  },
  {
    epic: 'Reports Module',
    description: 'Issue history, fine reports, and All Issues management view.',
    labels: ['reports', 'admin'],
    tasks: [
      { summary: 'Frontend: Reports Page — fine reports with summary cards',            priority: 'Medium',  labels: ['frontend', 'reports'] },
      { summary: 'Frontend: All Issues Page — paginated list (15/page)',                priority: 'High',    labels: ['frontend', 'reports'] },
      { summary: 'Frontend: Status filter tabs — All / Active / Returned',             priority: 'Medium',  labels: ['frontend', 'reports'] },
      { summary: 'Frontend: Search issues by Student ID',                              priority: 'Medium',  labels: ['frontend', 'reports'] },
      { summary: 'Frontend: Overdue rows highlighted red with pending fine column',    priority: 'Medium',  labels: ['frontend', 'reports', 'fine'] },
      { summary: 'Backend: Filter issues by status (Issued/Returned) via query param', priority: 'Medium',  labels: ['backend', 'reports'] },
    ]
  }
];

// ──────────────────────────────────────────────
// RUNNER
// ──────────────────────────────────────────────

function alreadyExists(summary) {
  return existingSummaries.has(summary.toLowerCase());
}

let existingSummaries = new Set();

async function loadExisting() {
  try {
    const axios = require('axios');
    require('dotenv').config({ path: require('path').join(__dirname, '../backend/.env') });
    const client = axios.create({
      baseURL: `${process.env.JIRA_BASE_URL}/rest/api/3`,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      auth: { username: process.env.JIRA_EMAIL, password: process.env.JIRA_API_TOKEN }
    });
    const PROJECT_KEY = process.env.JIRA_PROJECT_KEY || 'KAN';
    const { data } = await client.post('/search/jql', {
      jql: `project = ${PROJECT_KEY}`,
      maxResults: 500,
      fields: ['summary']
    });
    data.issues.forEach(i => existingSummaries.add(i.fields.summary.toLowerCase()));
    console.log(`  [pre-check] Found ${data.issues.length} existing issues — will skip duplicates.\n`);
  } catch (e) {
    console.warn('  [pre-check] Could not fetch existing issues:', e.message);
  }
}

async function run() {
  console.log('\n══════════════════════════════════════════════');
  console.log('  LMS Jira Setup — MCP Orchestration Layer');
  console.log('══════════════════════════════════════════════\n');

  await loadExisting();

  let totalEpics   = 0;
  let totalTasks   = 0;
  let skipped      = 0;
  const epicKeys   = {};

  for (const module of MODULES) {
    console.log(`\n▸ Epic: ${module.epic}`);

    // Create Epic
    let epicKey = null;
    if (alreadyExists(module.epic)) {
      console.log(`  ↷ Epic already exists — skipping`);
      skipped++;
    } else {
      epicKey = await mcp.create_issue({
        type       : 'Epic',
        summary    : module.epic,
        description: module.description,
        labels     : module.labels,
        priority   : 'High'
      });
      if (epicKey) {
        totalEpics++;
        epicKeys[module.epic] = epicKey;
        existingSummaries.add(module.epic.toLowerCase());
        console.log(`  ✓ Epic created: ${epicKey}`);
      }
    }

    // Small delay to avoid Jira rate limiting
    await delay(400);

    // Create Tasks
    for (const task of module.tasks) {
      if (alreadyExists(task.summary)) {
        console.log(`  ↷ Task already exists — ${task.summary.slice(0, 60)}...`);
        skipped++;
        continue;
      }

      const key = await mcp.create_issue({
        type       : 'Task',
        summary    : task.summary,
        description: `Part of Epic: ${module.epic}\n\nModule: ${module.epic}\nPriority: ${task.priority || 'Medium'}`,
        labels     : [...(task.labels || []), 'lms'],
        epicKey    : epicKey,
        priority   : task.priority || 'Medium'
      });

      if (key) {
        totalTasks++;
        existingSummaries.add(task.summary.toLowerCase());
        console.log(`  ✓ Task ${key}: ${task.summary.slice(0, 65)}`);
      }

      await delay(300);
    }
  }

  console.log('\n══════════════════════════════════════════════');
  console.log(`  Setup complete!`);
  console.log(`  Epics created : ${totalEpics}`);
  console.log(`  Tasks created : ${totalTasks}`);
  console.log(`  Skipped       : ${skipped} (already existed)`);
  console.log('══════════════════════════════════════════════\n');

  // Log the event
  await mcp.log_event({
    event   : 'Jira project setup completed',
    module  : 'MCP Setup',
    details : `Created ${totalEpics} epics and ${totalTasks} tasks. Skipped ${skipped} duplicates.`,
    severity: 'info'
  });

  // Show sync
  const status = await mcp.sync_status();
  if (status) {
    console.log(`\n  Project completion: ${status.completionPercent}%`);
    console.log(`  Total tickets    : ${status.totalEpics + status.totalTasks}`);
  }
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

run().catch(err => {
  console.error('\nSetup failed:', err.response?.data || err.message);
  process.exit(1);
});
