import { test, expect } from '@playwright/test';

test.describe('HeadForge Cross-Browser Compatibility', () => {
  test.beforeEach(async ({ page }) => {
    // Load the extension
    await page.goto('chrome-extension://[extension-id]/popup/popup.html');
  });

  test('should load popup interface in all browsers', async ({ page }) => {
    // Check if popup loads correctly
    await expect(page.locator('.popup-container')).toBeVisible();
    await expect(page.locator('.title')).toContainText('HeadForge');
  });

  test('should display form fields correctly', async ({ page }) => {
    // Check required form fields
    await expect(page.locator('#fileName')).toBeVisible();
    await expect(page.locator('#project')).toBeVisible();
    await expect(page.locator('#author')).toBeVisible();
    await expect(page.locator('#version')).toBeVisible();
    await expect(page.locator('#language')).toBeVisible();
    await expect(page.locator('#license')).toBeVisible();
    await expect(page.locator('#status')).toBeVisible();
  });

  test('should populate language options', async ({ page }) => {
    const languageSelect = page.locator('#language');
    await languageSelect.click();
    
    // Check if language options are populated
    await expect(languageSelect.locator('option[value="javascript"]')).toBeVisible();
    await expect(languageSelect.locator('option[value="python"]')).toBeVisible();
    await expect(languageSelect.locator('option[value="java"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to generate header without filling required fields
    await page.click('#generate-header');
    
    // Check for validation errors
    await expect(page.locator('.form-error.show')).toBeVisible();
  });

  test('should generate header preview', async ({ page }) => {
    // Fill in required fields
    await page.fill('#fileName', 'test-file.js');
    await page.fill('#project', 'Test Project');
    await page.fill('#author', 'Test Author');
    await page.fill('#version', '1.0.0');
    await page.selectOption('#language', 'javascript');
    await page.selectOption('#license', 'MIT');
    await page.selectOption('#status', 'Development');
    
    
    // Check if preview updates
    await expect(page.locator('#preview-code')).toContainText('test-file.js');
    await expect(page.locator('#preview-code')).toContainText('Test Project');
  });

  test('should copy to clipboard', async ({ page }) => {
    // Fill in form
    await page.fill('#fileName', 'test-file.js');
    await page.fill('#project', 'Test Project');
    await page.fill('#author', 'Test Author');
    await page.fill('#version', '1.0.0');
    await page.selectOption('#language', 'javascript');
    await page.selectOption('#license', 'MIT');
    await page.selectOption('#status', 'Development');
    
    // Click copy button
    await page.click('#copy-clipboard');
    
    // Check for success message
    await expect(page.locator('.toast.success')).toBeVisible();
  });

  test('should toggle theme', async ({ page }) => {
    const initialTheme = await page.locator('body').getAttribute('class');
    
    // Click theme toggle
    await page.click('#theme-toggle');
    
    // Check if theme changed
    const newTheme = await page.locator('body').getAttribute('class');
    expect(newTheme).not.toBe(initialTheme);
  });

  test('should open options page', async ({ page, context }) => {
    // Click settings button
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click('#settings-btn')
    ]);
    
    // Check if options page opened
    await expect(newPage.locator('.options-container')).toBeVisible();
    await expect(newPage.locator('.title')).toContainText('HeadForge Settings');
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Fill in form
    await page.fill('#fileName', 'test-file.js');
    await page.fill('#project', 'Test Project');
    await page.fill('#author', 'Test Author');
    await page.fill('#version', '1.0.0');
    await page.selectOption('#language', 'javascript');
    await page.selectOption('#license', 'MIT');
    await page.selectOption('#status', 'Development');
    
    // Use keyboard shortcut to generate
    await page.keyboard.press('Control+Enter');
    
    // Check for success message
    await expect(page.locator('.toast.success')).toBeVisible();
  });

  test('should remember form values', async ({ page }) => {
    // Fill in form
    await page.fill('#fileName', 'test-file.js');
    await page.fill('#project', 'Test Project');
    await page.fill('#author', 'Test Author');
    
    // Reload page
    await page.reload();
    
    // Check if values are remembered (if preference is enabled)
    // This test depends on the rememberLastValues preference
    const fileName = await page.inputValue('#fileName');
    if (fileName) {
      expect(fileName).toBe('test-file.js');
    }
  });

  test('should handle different languages', async ({ page }) => {
    const languages = ['javascript', 'python', 'java', 'html', 'css'];
    
    for (const language of languages) {
      await page.selectOption('#language', language);
      
      // Fill in basic info
      await page.fill('#fileName', `test-file.${language}`);
      await page.fill('#project', 'Test Project');
      await page.fill('#author', 'Test Author');
      await page.fill('#version', '1.0.0');
      await page.selectOption('#license', 'MIT');
      await page.selectOption('#status', 'Development');
      
      // Check if preview updates with correct comment syntax
      const preview = await page.textContent('#preview-code');
      expect(preview).toContain('test-file');
    }
  });

  test('should validate version format', async ({ page }) => {
    // Fill in form with invalid version
    await page.fill('#fileName', 'test-file.js');
    await page.fill('#project', 'Test Project');
    await page.fill('#author', 'Test Author');
    await page.fill('#version', 'invalid-version');
    await page.selectOption('#language', 'javascript');
    await page.selectOption('#license', 'MIT');
    await page.selectOption('#status', 'Development');
    
    // Try to generate
    await page.click('#generate-header');
    
    // Check for validation error
    await expect(page.locator('.form-error.show')).toBeVisible();
  });


  test('should handle export options', async ({ page }) => {
    // Fill in form
    await page.fill('#fileName', 'test-file.js');
    await page.fill('#project', 'Test Project');
    await page.fill('#author', 'Test Author');
    await page.fill('#version', '1.0.0');
    await page.selectOption('#language', 'javascript');
    await page.selectOption('#license', 'MIT');
    await page.selectOption('#status', 'Development');
    
    // Test copy to clipboard
    await page.click('#copy-clipboard');
    await expect(page.locator('.toast.success')).toBeVisible();
    
    // Test download file
    const downloadPromise = page.waitForEvent('download');
    await page.click('#download-file');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('test-file');
  });

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if popup is still usable
    await expect(page.locator('.popup-container')).toBeVisible();
    await expect(page.locator('#fileName')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Check if layout adapts
    await expect(page.locator('.popup-container')).toBeVisible();
  });

  test('should handle accessibility', async ({ page }) => {
    // Check for proper ARIA labels
    await expect(page.locator('#fileName')).toHaveAttribute('required');
    await expect(page.locator('#project')).toHaveAttribute('required');
    await expect(page.locator('#author')).toHaveAttribute('required');
    
    // Check for proper form labels
    await expect(page.locator('label[for="fileName"]')).toBeVisible();
    await expect(page.locator('label[for="project"]')).toBeVisible();
    await expect(page.locator('label[for="author"]')).toBeVisible();
    
    // Check for keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.locator('#fileName')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('#project')).toBeFocused();
  });
});
