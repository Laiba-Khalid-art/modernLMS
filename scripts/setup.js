/**
 * One-time setup script
 * Run: node scripts/setup.js
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n=== Modern Library Management System — Setup ===\n');

const checks = [
  { label: 'backend/package.json', path: 'backend/package.json' },
  { label: 'frontend/package.json', path: 'frontend/package.json' },
  { label: 'playwright/package.json', path: 'playwright/package.json' },
  { label: 'backend/.env', path: 'backend/.env' }
];

checks.forEach(c => {
  const exists = fs.existsSync(path.join(__dirname, '..', c.path));
  console.log(`  ${exists ? '✓' : '✗'} ${c.label}`);
});

console.log('\nInstalling dependencies...\n');

const steps = [
  { label: 'Root dependencies', cmd: 'npm install', cwd: path.join(__dirname, '..') },
  { label: 'Backend dependencies', cmd: 'npm install', cwd: path.join(__dirname, '../backend') },
  { label: 'Frontend dependencies', cmd: 'npm install', cwd: path.join(__dirname, '../frontend') },
  { label: 'Playwright dependencies', cmd: 'npm install', cwd: path.join(__dirname, '../playwright') }
];

for (const step of steps) {
  try {
    console.log(`Installing: ${step.label}...`);
    execSync(step.cmd, { cwd: step.cwd, stdio: 'inherit' });
    console.log(`✓ ${step.label} done.\n`);
  } catch (err) {
    console.error(`✗ Failed: ${step.label}\n${err.message}`);
  }
}

console.log('\nInstalling Playwright browsers...');
try {
  execSync('npx playwright install chromium', { cwd: path.join(__dirname, '../playwright'), stdio: 'inherit' });
  console.log('✓ Playwright chromium installed.\n');
} catch (err) {
  console.error('✗ Failed to install Playwright browsers:', err.message);
}

console.log('=== Setup complete! ===\n');
console.log('Next steps:');
console.log('  1. Make sure MongoDB is running');
console.log('  2. Run: node migration/migrate.js');
console.log('  3. Run: npm run dev');
console.log('  4. Open: http://localhost:5173\n');
