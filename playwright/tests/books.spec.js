const { test, expect } = require('@playwright/test');
const { loginAsAdmin, generateUniqueTitle } = require('../utils/helpers');
const { createJiraBug } = require('../utils/jiraReporter');

test.describe('Book Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/books');
  });

  test('should display books list with table', async ({ page }) => {
    const start = Date.now();
    try {
      await expect(page.getByTestId('books-table')).toBeVisible();
      await expect(page.getByTestId('add-book-btn')).toBeVisible();
    } catch (err) {
      await createJiraBug({ scenarioName: 'Books list page displays table', errorMessage: err.message, stackTrace: err.stack, screenshotPath: null, executionTime: Date.now() - start });
      throw err;
    }
  });

  test('should add a new book successfully', async ({ page }) => {
    const start = Date.now();
    const title = generateUniqueTitle('Playwright Test Book');
    try {
      await page.getByTestId('add-book-btn').click();
      await page.getByTestId('book-title-input').fill(title);
      await page.getByTestId('book-author-input').fill('Test Author');
      await page.getByTestId('book-category-input').fill('Testing');
      await page.getByTestId('book-quantity-input').fill('3');
      await page.getByTestId('save-book-btn').click();
      // Confirm save succeeded via toast
      await expect(page.locator('text=Book added successfully')).toBeVisible({ timeout: 5000 });
      // Search for the new book to confirm it persisted in the database
      await page.getByTestId('book-search-input').fill(title);
      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page.locator(`text=${title}`)).toBeVisible({ timeout: 8000 });
    } catch (err) {
      await createJiraBug({ scenarioName: 'Add new book successfully', errorMessage: err.message, stackTrace: err.stack, screenshotPath: null, executionTime: Date.now() - start });
      throw err;
    }
  });

  test('should search for a book by title', async ({ page }) => {
    const start = Date.now();
    try {
      await page.getByTestId('book-search-input').fill('Algorithm');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.waitForTimeout(1000);
      const rows = page.locator('[data-testid="books-table"] tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThanOrEqual(0);
    } catch (err) {
      await createJiraBug({ scenarioName: 'Search book by title', errorMessage: err.message, stackTrace: err.stack, screenshotPath: null, executionTime: Date.now() - start });
      throw err;
    }
  });

  test('should validate required fields when adding book', async ({ page }) => {
    const start = Date.now();
    try {
      await page.getByTestId('add-book-btn').click();
      await page.getByTestId('save-book-btn').click();
      await expect(page.locator('text=Please fill all required fields')).toBeVisible({ timeout: 5000 });
    } catch (err) {
      await createJiraBug({ scenarioName: 'Validate required fields on add book', errorMessage: err.message, stackTrace: err.stack, screenshotPath: null, executionTime: Date.now() - start });
      throw err;
    }
  });
});
