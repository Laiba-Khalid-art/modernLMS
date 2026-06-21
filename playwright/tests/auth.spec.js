const { test, expect } = require('@playwright/test');
const { loginAsAdmin, ADMIN_EMAIL, ADMIN_PASSWORD } = require('../utils/helpers');
const { createJiraBug } = require('../utils/jiraReporter');

test.describe('Authentication', () => {
  test('should display login page with required elements', async ({ page }) => {
    const start = Date.now();
    try {
      await page.goto('/login');
      await expect(page.getByTestId('email-input')).toBeVisible();
      await expect(page.getByTestId('password-input')).toBeVisible();
      await expect(page.getByTestId('login-btn')).toBeVisible();
    } catch (err) {
      await createJiraBug({ scenarioName: 'Login page displays required elements', errorMessage: err.message, stackTrace: err.stack, screenshotPath: null, executionTime: Date.now() - start });
      throw err;
    }
  });

  test('should reject invalid credentials', async ({ page }) => {
    const start = Date.now();
    try {
      await page.goto('/login');
      await page.getByTestId('email-input').fill('wrong@test.com');
      await page.getByTestId('password-input').fill('wrongpass');
      await page.getByTestId('login-btn').click();
      await expect(page.locator('text=Invalid email or password')).toBeVisible({ timeout: 5000 });
    } catch (err) {
      await createJiraBug({ scenarioName: 'Login rejects invalid credentials', errorMessage: err.message, stackTrace: err.stack, screenshotPath: null, executionTime: Date.now() - start });
      throw err;
    }
  });

  test('should login successfully as admin and redirect to dashboard', async ({ page }) => {
    const start = Date.now();
    try {
      await loginAsAdmin(page);
      await expect(page).toHaveURL(/.*\/admin/);
      await expect(page.locator('text=Dashboard')).toBeVisible();
    } catch (err) {
      await createJiraBug({ scenarioName: 'Admin login and redirect to dashboard', errorMessage: err.message, stackTrace: err.stack, screenshotPath: null, executionTime: Date.now() - start });
      throw err;
    }
  });

  test('should logout successfully', async ({ page }) => {
    const start = Date.now();
    try {
      await loginAsAdmin(page);
      await page.getByRole('button', { name: /logout/i }).click();
      await expect(page).toHaveURL(/.*\/login/);
    } catch (err) {
      await createJiraBug({ scenarioName: 'Admin logout successfully', errorMessage: err.message, stackTrace: err.stack, screenshotPath: null, executionTime: Date.now() - start });
      throw err;
    }
  });

  test('should redirect unauthenticated user to login', async ({ page }) => {
    const start = Date.now();
    try {
      await page.goto('/admin');
      await expect(page).toHaveURL(/.*\/login/);
    } catch (err) {
      await createJiraBug({ scenarioName: 'Unauthenticated redirect to login', errorMessage: err.message, stackTrace: err.stack, screenshotPath: null, executionTime: Date.now() - start });
      throw err;
    }
  });
});
