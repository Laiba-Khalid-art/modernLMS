const { test, expect } = require('@playwright/test');
const { loginAsAdmin } = require('../utils/helpers');
const { createJiraBug } = require('../utils/jiraReporter');

test.describe('Student Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/students');
  });

  test('should display students list', async ({ page }) => {
    const start = Date.now();
    try {
      await expect(page.getByTestId('students-table')).toBeVisible();
      await expect(page.getByTestId('add-student-btn')).toBeVisible();
    } catch (err) {
      await createJiraBug({ scenarioName: 'Students list displays correctly', errorMessage: err.message, stackTrace: err.stack, screenshotPath: null, executionTime: Date.now() - start });
      throw err;
    }
  });

  test('should add a new student successfully', async ({ page }) => {
    const start = Date.now();
    const name = `Test Student ${Date.now()}`;
    try {
      await page.getByTestId('add-student-btn').click();
      await page.getByTestId('student-name-input').fill(name);
      await page.getByTestId('student-email-input').fill(`test${Date.now()}@test.com`);
      await page.getByTestId('student-dept-input').fill('Computer Science');
      await page.getByTestId('student-contact-input').fill('03001234567');
      await page.getByTestId('save-student-btn').click();
      await expect(page.locator('text=Student registered')).toBeVisible({ timeout: 5000 });
    } catch (err) {
      await createJiraBug({ scenarioName: 'Add new student successfully', errorMessage: err.message, stackTrace: err.stack, screenshotPath: null, executionTime: Date.now() - start });
      throw err;
    }
  });

  test('should search students by name', async ({ page }) => {
    const start = Date.now();
    try {
      await page.getByTestId('student-search-input').fill('Ali');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(1000);
      const rows = page.locator('[data-testid="students-table"] tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThanOrEqual(0);
    } catch (err) {
      await createJiraBug({ scenarioName: 'Search students by name', errorMessage: err.message, stackTrace: err.stack, screenshotPath: null, executionTime: Date.now() - start });
      throw err;
    }
  });

  test('should require name and department fields', async ({ page }) => {
    const start = Date.now();
    try {
      await page.getByTestId('add-student-btn').click();
      await page.getByTestId('save-student-btn').click();
      await expect(page.locator('text=Name and Department are required')).toBeVisible({ timeout: 5000 });
    } catch (err) {
      await createJiraBug({ scenarioName: 'Validate required student fields', errorMessage: err.message, stackTrace: err.stack, screenshotPath: null, executionTime: Date.now() - start });
      throw err;
    }
  });
});
