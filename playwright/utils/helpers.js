const ADMIN_EMAIL = 'admin@library.com';
const ADMIN_PASSWORD = 'Admin@1234';

async function loginAsAdmin(page) {
  await page.goto('/login');
  await page.getByTestId('email-input').fill(ADMIN_EMAIL);
  await page.getByTestId('password-input').fill(ADMIN_PASSWORD);
  await page.getByTestId('login-btn').click();
  await page.waitForURL('**/admin');
}

async function logout(page) {
  await page.getByRole('button', { name: /logout/i }).click();
  await page.waitForURL('**/login');
}

function generateUniqueTitle(prefix = 'Test Book') {
  return `${prefix} ${Date.now()}`;
}

async function waitForToast(page, messagePattern) {
  await page.waitForSelector(`text=${messagePattern}`, { timeout: 5000 }).catch(() => {});
}

module.exports = { loginAsAdmin, logout, generateUniqueTitle, waitForToast, ADMIN_EMAIL, ADMIN_PASSWORD };
