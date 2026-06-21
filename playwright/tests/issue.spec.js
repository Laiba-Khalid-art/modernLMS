const { test, expect } = require('@playwright/test');
const { loginAsAdmin } = require('../utils/helpers');
const { createJiraBug } = require('../utils/jiraReporter');

test.describe('Book Issue & Return', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should display issue book page with lookup forms', async ({ page }) => {
    const start = Date.now();
    try {
      await page.goto('/admin/issue');
      await expect(page.getByTestId('issue-student-id')).toBeVisible();
      await expect(page.getByTestId('issue-book-id')).toBeVisible();
    } catch (err) {
      await createJiraBug({ scenarioName: 'Issue book page displays lookup forms', errorMessage: err.message, stackTrace: err.stack, screenshotPath: null, executionTime: Date.now() - start });
      throw err;
    }
  });

  test('should show error for invalid student ID on issue page', async ({ page }) => {
    const start = Date.now();
    try {
      await page.goto('/admin/issue');
      await page.getByTestId('issue-student-id').fill('9999999');
      await page.getByRole('button', { name: /find/i }).first().click();
      await expect(page.locator('text=Student not found')).toBeVisible({ timeout: 5000 });
    } catch (err) {
      await createJiraBug({ scenarioName: 'Issue book shows error for invalid student', errorMessage: err.message, stackTrace: err.stack, screenshotPath: null, executionTime: Date.now() - start });
      throw err;
    }
  });

  test('should display return book page with student ID search', async ({ page }) => {
    const start = Date.now();
    try {
      await page.goto('/admin/return');
      await expect(page.getByTestId('return-student-id')).toBeVisible();
    } catch (err) {
      await createJiraBug({ scenarioName: 'Return book page displays correctly', errorMessage: err.message, stackTrace: err.stack, screenshotPath: null, executionTime: Date.now() - start });
      throw err;
    }
  });

  test('should show no books message for unknown student ID on return page', async ({ page }) => {
    const start = Date.now();
    try {
      await page.goto('/admin/return');
      await page.getByTestId('return-student-id').fill('9999999');
      await page.getByRole('button', { name: /search/i }).click();
      await expect(page.locator('text=No active borrowed books')).toBeVisible({ timeout: 5000 });
    } catch (err) {
      await createJiraBug({ scenarioName: 'Return book shows no books for unknown student', errorMessage: err.message, stackTrace: err.stack, screenshotPath: null, executionTime: Date.now() - start });
      throw err;
    }
  });

  test('should display fine report page', async ({ page }) => {
    const start = Date.now();
    try {
      await page.goto('/admin/reports');
      await expect(page.getByTestId('fine-report-table')).toBeVisible({ timeout: 5000 });
    } catch (err) {
      await createJiraBug({ scenarioName: 'Fine report page displays correctly', errorMessage: err.message, stackTrace: err.stack, screenshotPath: null, executionTime: Date.now() - start });
      throw err;
    }
  });
});
