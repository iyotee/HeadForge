import { test, expect } from '@playwright/test';

test.describe('HeadForge User Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Load the extension
    await page.goto('chrome-extension://[extension-id]/popup/popup.html');
  });

  test('complete user journey - JavaScript header generation', async ({ page }) => {
    // Step 1: User opens extension
    await expect(page.locator('.popup-container')).toBeVisible();
    await expect(page.locator('.title')).toContainText('HeadForge');
    
    // Step 2: User fills in basic information
    await page.fill('#fileName', 'user-service.js');
    await page.fill('#project', 'E-commerce Platform');
    await page.fill('#author', 'John Doe');
    await page.fill('#version', '2.1.0');
    await page.fill('#description', 'User management service for e-commerce platform');
    
    // Step 3: User selects programming language
    await page.selectOption('#language', 'javascript');
    
    // Step 4: User configures additional settings
    await page.selectOption('#license', 'MIT');
    await page.selectOption('#status', 'Stable');
    
    // Step 5: User adds dependencies
    await page.fill('#dependencies', 'express, mongoose, bcrypt');
    
    // Step 6: User adds usage instructions
    await page.fill('#usage', 'Import and use the UserService class to manage user operations');
    
    // Step 7: User adds notes
    await page.fill('#notes', 'This service handles user authentication and profile management');
    
    // Step 8: User adds TODO items
    await page.fill('#todo', 'Add password reset functionality, Implement user roles');
    
    // Step 9: User sees live preview
    const preview = await page.textContent('#preview-code');
    expect(preview).toContain('user-service.js');
    expect(preview).toContain('E-commerce Platform');
    expect(preview).toContain('John Doe');
    expect(preview).toContain('2.1.0');
    expect(preview).toContain('express, mongoose, bcrypt');
    
    // Step 10: User generates header
    await page.click('#generate-header');
    
    // Step 11: User copies to clipboard
    await page.click('#copy-clipboard');
    await expect(page.locator('.toast.success')).toBeVisible();
    
    // Step 12: User downloads file
    const downloadPromise = page.waitForEvent('download');
    await page.click('#download-file');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('user-service.js');
  });

  test('complete user journey - Python header generation', async ({ page }) => {
    // Step 1: User opens extension
    await expect(page.locator('.popup-container')).toBeVisible();
    
    // Step 2: User fills in Python-specific information
    await page.fill('#fileName', 'data_processor.py');
    await page.fill('#project', 'Data Analytics Pipeline');
    await page.fill('#author', 'Jane Smith');
    await page.fill('#version', '1.5.2');
    await page.fill('#description', 'Data processing module for analytics pipeline');
    
    // Step 3: User selects Python
    await page.selectOption('#language', 'python');
    
    // Step 4: User configures settings
    await page.selectOption('#license', 'Apache-2.0');
    await page.selectOption('#status', 'Development');
    
    // Step 5: User adds Python dependencies
    await page.fill('#dependencies', 'pandas, numpy, scikit-learn, matplotlib');
    
    // Step 6: User adds usage instructions
    await page.fill('#usage', 'Import DataProcessor class and call process_data() method');
    
    // Step 7: User sees Python-style preview
    const preview = await page.textContent('#preview-code');
    expect(preview).toContain('data_processor.py');
    expect(preview).toContain('Data Analytics Pipeline');
    expect(preview).toContain('Jane Smith');
    expect(preview).toContain('pandas, numpy, scikit-learn, matplotlib');
    
    // Step 8: User generates and copies
    await page.click('#generate-header');
    await page.click('#copy-clipboard');
    await expect(page.locator('.toast.success')).toBeVisible();
  });

  test('user journey with theme switching', async ({ page }) => {
    // Step 1: User opens extension in light mode
    await expect(page.locator('.popup-container')).toBeVisible();
    
    // Step 2: User fills in form
    await page.fill('#fileName', 'theme-test.js');
    await page.fill('#project', 'Theme Test Project');
    await page.fill('#author', 'Theme User');
    await page.fill('#version', '1.0.0');
    await page.selectOption('#language', 'javascript');
    await page.selectOption('#license', 'MIT');
    await page.selectOption('#status', 'Development');
    
    // Step 3: User switches to dark mode
    await page.click('#theme-toggle');
    await expect(page.locator('body')).toHaveClass(/dark-mode/);
    
    // Step 4: User generates header in dark mode
    await page.click('#generate-header');
    await expect(page.locator('.toast.success')).toBeVisible();
    
    // Step 5: User switches back to light mode
    await page.click('#theme-toggle');
    await expect(page.locator('body')).not.toHaveClass(/dark-mode/);
  });

  test('user journey with preferences', async ({ page, context }) => {
    // Step 1: User opens extension
    await expect(page.locator('.popup-container')).toBeVisible();
    
    // Step 2: User opens settings
    const [optionsPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click('#settings-btn')
    ]);
    
    // Step 3: User configures preferences
    await optionsPage.selectOption('#defaultLanguage', 'python');
    await optionsPage.selectOption('#defaultLicense', 'MIT');
    await optionsPage.selectOption('#defaultStatus', 'Development');
    await optionsPage.check('#rememberLastValues');
    await optionsPage.check('#autoFillDates');
    
    // Step 4: User saves settings
    await optionsPage.click('#save-settings');
    await expect(optionsPage.locator('.toast.success')).toBeVisible();
    
    // Step 5: User returns to popup
    await page.bringToFront();
    
    // Step 6: User sees preferences applied
    const languageValue = await page.inputValue('#language');
    expect(languageValue).toBe('python');
    
    const licenseValue = await page.inputValue('#license');
    expect(licenseValue).toBe('MIT');
    
    const statusValue = await page.inputValue('#status');
    expect(statusValue).toBe('Development');
  });

  test('user journey with keyboard shortcuts', async ({ page }) => {
    // Step 1: User opens extension
    await expect(page.locator('.popup-container')).toBeVisible();
    
    // Step 2: User fills form using keyboard navigation
    await page.keyboard.press('Tab'); // Focus fileName
    await page.keyboard.type('keyboard-test.js');
    
    await page.keyboard.press('Tab'); // Focus project
    await page.keyboard.type('Keyboard Test Project');
    
    await page.keyboard.press('Tab'); // Focus author
    await page.keyboard.type('Keyboard User');
    
    await page.keyboard.press('Tab'); // Focus version
    await page.keyboard.type('1.0.0');
    
    // Step 3: User uses keyboard shortcut to generate
    await page.keyboard.press('Control+Enter');
    await expect(page.locator('.toast.success')).toBeVisible();
    
    // Step 4: User uses keyboard shortcut to copy
    await page.keyboard.press('Control+c');
    await expect(page.locator('.toast.success')).toBeVisible();
  });

  test('user journey with validation errors', async ({ page }) => {
    // Step 1: User opens extension
    await expect(page.locator('.popup-container')).toBeVisible();
    
    // Step 2: User tries to generate without filling required fields
    await page.click('#generate-header');
    
    // Step 3: User sees validation errors
    await expect(page.locator('.form-error.show')).toBeVisible();
    
    // Step 4: User fills in invalid version
    await page.fill('#fileName', 'test.js');
    await page.fill('#project', 'Test Project');
    await page.fill('#author', 'Test Author');
    await page.fill('#version', 'invalid-version');
    await page.selectOption('#language', 'javascript');
    await page.selectOption('#license', 'MIT');
    await page.selectOption('#status', 'Development');
    
    // Step 5: User tries to generate with invalid version
    await page.click('#generate-header');
    
    // Step 6: User sees version validation error
    await expect(page.locator('.form-error.show')).toBeVisible();
    
    // Step 7: User fixes version
    await page.fill('#version', '1.0.0');
    
    // Step 8: User successfully generates
    await page.click('#generate-header');
    await expect(page.locator('.toast.success')).toBeVisible();
  });

  test('user journey with multiple languages', async ({ page }) => {
    const languages = [
      { name: 'javascript', file: 'script.js' },
      { name: 'python', file: 'script.py' },
      { name: 'java', file: 'Script.java' },
      { name: 'html', file: 'page.html' },
      { name: 'css', file: 'styles.css' }
    ];
    
    for (const lang of languages) {
      // Step 1: User selects language
      await page.selectOption('#language', lang.name);
      
      // Step 2: User fills in form
      await page.fill('#fileName', lang.file);
      await page.fill('#project', 'Multi-language Test');
      await page.fill('#author', 'Multi User');
      await page.fill('#version', '1.0.0');
      await page.selectOption('#license', 'MIT');
      await page.selectOption('#status', 'Development');
      
      // Step 3: User sees language-specific preview
      const preview = await page.textContent('#preview-code');
      expect(preview).toContain(lang.file);
      
      // Step 4: User generates header
      await page.click('#generate-header');
      await expect(page.locator('.toast.success')).toBeVisible();
    }
  });

  test('user journey with export options', async ({ page }) => {
    // Step 1: User opens extension
    await expect(page.locator('.popup-container')).toBeVisible();
    
    // Step 2: User fills in form
    await page.fill('#fileName', 'export-test.js');
    await page.fill('#project', 'Export Test Project');
    await page.fill('#author', 'Export User');
    await page.fill('#version', '1.0.0');
    await page.selectOption('#language', 'javascript');
    await page.selectOption('#license', 'MIT');
    await page.selectOption('#status', 'Development');
    
    // Step 3: User generates header
    await page.click('#generate-header');
    
    // Step 4: User copies to clipboard
    await page.click('#copy-clipboard');
    await expect(page.locator('.toast.success')).toBeVisible();
    
    // Step 5: User downloads file
    const downloadPromise = page.waitForEvent('download');
    await page.click('#download-file');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('export-test.js');
    
    // Step 6: User tries to insert into editor (if available)
    await page.click('#insert-editor');
    // This would depend on the content script implementation
  });

  test('user journey with responsive design', async ({ page }) => {
    // Step 1: User opens extension on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.popup-container')).toBeVisible();
    
    // Step 2: User fills in form on mobile
    await page.fill('#fileName', 'mobile-test.js');
    await page.fill('#project', 'Mobile Test Project');
    await page.fill('#author', 'Mobile User');
    await page.fill('#version', '1.0.0');
    await page.selectOption('#language', 'javascript');
    await page.selectOption('#license', 'MIT');
    await page.selectOption('#status', 'Development');
    
    // Step 3: User generates on mobile
    await page.click('#generate-header');
    await expect(page.locator('.toast.success')).toBeVisible();
    
    // Step 4: User switches to tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.popup-container')).toBeVisible();
    
    // Step 5: User continues on tablet
    await page.click('#copy-clipboard');
    await expect(page.locator('.toast.success')).toBeVisible();
  });
});
