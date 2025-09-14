import { test, expect } from '@playwright/test';

test.describe('HeadForge Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Load the extension
    await page.goto('chrome-extension://[extension-id]/popup/popup.html');
  });

  test('should have proper ARIA labels', async ({ page }) => {
    // Check for proper ARIA labels on form elements
    await expect(page.locator('#fileName')).toHaveAttribute('aria-label');
    await expect(page.locator('#project')).toHaveAttribute('aria-label');
    await expect(page.locator('#author')).toHaveAttribute('aria-label');
    await expect(page.locator('#version')).toHaveAttribute('aria-label');
    await expect(page.locator('#description')).toHaveAttribute('aria-label');
    await expect(page.locator('#dependencies')).toHaveAttribute('aria-label');
    await expect(page.locator('#usage')).toHaveAttribute('aria-label');
    await expect(page.locator('#notes')).toHaveAttribute('aria-label');
    await expect(page.locator('#todo')).toHaveAttribute('aria-label');
    
    // Check for proper ARIA labels on buttons
    await expect(page.locator('#generate-header')).toHaveAttribute('aria-label');
    await expect(page.locator('#copy-clipboard')).toHaveAttribute('aria-label');
    await expect(page.locator('#download-file')).toHaveAttribute('aria-label');
    await expect(page.locator('#theme-toggle')).toHaveAttribute('aria-label');
  });

  test('should have proper form labels', async ({ page }) => {
    // Check for proper form labels
    await expect(page.locator('label[for="fileName"]')).toBeVisible();
    await expect(page.locator('label[for="project"]')).toBeVisible();
    await expect(page.locator('label[for="author"]')).toBeVisible();
    await expect(page.locator('label[for="version"]')).toBeVisible();
    await expect(page.locator('label[for="description"]')).toBeVisible();
    await expect(page.locator('label[for="dependencies"]')).toBeVisible();
    await expect(page.locator('label[for="usage"]')).toBeVisible();
    await expect(page.locator('label[for="notes"]')).toBeVisible();
    await expect(page.locator('label[for="todo"]')).toBeVisible();
    await expect(page.locator('label[for="language"]')).toBeVisible();
    await expect(page.locator('label[for="license"]')).toBeVisible();
    await expect(page.locator('label[for="status"]')).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator('#fileName')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('#project')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('#author')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('#version')).toBeFocused();
    
    // Test shift+tab for reverse navigation
    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('#author')).toBeFocused();
  });

  test('should support keyboard shortcuts', async ({ page }) => {
    // Fill in form
    await page.fill('#fileName', 'accessibility-test.js');
    await page.fill('#project', 'Accessibility Test Project');
    await page.fill('#author', 'Accessibility User');
    await page.fill('#version', '1.0.0');
    await page.selectOption('#language', 'javascript');
    await page.selectOption('#license', 'MIT');
    await page.selectOption('#status', 'Development');
    
    // Test Ctrl+Enter to generate
    await page.keyboard.press('Control+Enter');
    await expect(page.locator('.toast.success')).toBeVisible();
    
    // Test Ctrl+C to copy
    await page.keyboard.press('Control+c');
    await expect(page.locator('.toast.success')).toBeVisible();
  });

  test('should have proper focus management', async ({ page }) => {
    // Check if focus is properly managed
    await page.click('#generate-header');
    
    // After generating, focus should be on the generate button
    await expect(page.locator('#generate-header')).toBeFocused();
    
    // After copying, focus should be on the copy button
    await page.click('#copy-clipboard');
    await expect(page.locator('#copy-clipboard')).toBeFocused();
  });

  test('should have proper color contrast', async ({ page }) => {
    // Check color contrast for text elements
    const textElements = [
      '.title',
      'label',
      '.form-label',
      '.preview-label'
    ];
    
    for (const selector of textElements) {
      const element = page.locator(selector).first();
      if (await element.isVisible()) {
        const color = await element.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return styles.color;
        });
        
        const backgroundColor = await element.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return styles.backgroundColor;
        });
        
        // Basic color contrast check (simplified)
        expect(color).not.toBe('transparent');
        expect(backgroundColor).not.toBe('transparent');
      }
    }
  });

  test('should have proper heading structure', async ({ page }) => {
    // Check for proper heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    
    if (headings.length > 0) {
      // First heading should be h1
      const firstHeading = await headings[0].evaluate((el) => el.tagName);
      expect(firstHeading).toBe('H1');
    }
  });

  test('should have proper button roles', async ({ page }) => {
    // Check for proper button roles
    await expect(page.locator('#generate-header')).toHaveAttribute('role', 'button');
    await expect(page.locator('#copy-clipboard')).toHaveAttribute('role', 'button');
    await expect(page.locator('#download-file')).toHaveAttribute('role', 'button');
    await expect(page.locator('#theme-toggle')).toHaveAttribute('role', 'button');
  });

  test('should have proper form validation messages', async ({ page }) => {
    // Try to generate without filling required fields
    await page.click('#generate-header');
    
    // Check for proper error messages
    const errorMessage = page.locator('.form-error.show');
    await expect(errorMessage).toBeVisible();
    
    // Check if error message has proper ARIA attributes
    await expect(errorMessage).toHaveAttribute('role', 'alert');
    await expect(errorMessage).toHaveAttribute('aria-live', 'polite');
  });

  test('should support screen readers', async ({ page }) => {
    // Check for proper ARIA live regions
    const liveRegions = page.locator('[aria-live]');
    const count = await liveRegions.count();
    expect(count).toBeGreaterThan(0);
    
    // Check for proper ARIA descriptions
    const describedByElements = page.locator('[aria-describedby]');
    const describedByCount = await describedByElements.count();
    expect(describedByCount).toBeGreaterThan(0);
  });

  test('should have proper alt text for images', async ({ page }) => {
    // Check for proper alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('should have proper table structure', async ({ page }) => {
    // Check for proper table structure if tables exist
    const tables = page.locator('table');
    const tableCount = await tables.count();
    
    for (let i = 0; i < tableCount; i++) {
      const table = tables.nth(i);
      
      // Check for proper table headers
      const headers = table.locator('th');
      const headerCount = await headers.count();
      expect(headerCount).toBeGreaterThan(0);
      
      // Check for proper table caption or summary
      const caption = table.locator('caption');
      const summary = table.getAttribute('summary');
      const ariaLabel = table.getAttribute('aria-label');
      
      const hasCaption = await caption.count() > 0;
      const hasSummary = await summary !== null;
      const hasAriaLabel = await ariaLabel !== null;
      
      expect(hasCaption || hasSummary || hasAriaLabel).toBeTruthy();
    }
  });

  test('should have proper list structure', async ({ page }) => {
    // Check for proper list structure
    const lists = page.locator('ul, ol');
    const listCount = await lists.count();
    
    for (let i = 0; i < listCount; i++) {
      const list = lists.nth(i);
      
      // Check for proper list items
      const items = list.locator('li');
      const itemCount = await items.count();
      expect(itemCount).toBeGreaterThan(0);
    }
  });

  test('should have proper form field requirements', async ({ page }) => {
    // Check for proper required attributes
    await expect(page.locator('#fileName')).toHaveAttribute('required');
    await expect(page.locator('#project')).toHaveAttribute('required');
    await expect(page.locator('#author')).toHaveAttribute('required');
    await expect(page.locator('#version')).toHaveAttribute('required');
    
    // Check for proper input types
    await expect(page.locator('#fileName')).toHaveAttribute('type', 'text');
    await expect(page.locator('#version')).toHaveAttribute('type', 'text');
    
    // Check for proper textarea elements
    await expect(page.locator('#description')).toHaveAttribute('tagName', 'TEXTAREA');
    await expect(page.locator('#dependencies')).toHaveAttribute('tagName', 'TEXTAREA');
    await expect(page.locator('#usage')).toHaveAttribute('tagName', 'TEXTAREA');
    await expect(page.locator('#notes')).toHaveAttribute('tagName', 'TEXTAREA');
    await expect(page.locator('#todo')).toHaveAttribute('tagName', 'TEXTAREA');
  });

  test('should have proper error handling', async ({ page }) => {
    // Test error handling with invalid input
    await page.fill('#version', 'invalid-version');
    await page.click('#generate-header');
    
    // Check for proper error message
    const errorMessage = page.locator('.form-error.show');
    await expect(errorMessage).toBeVisible();
    
    // Check if error message is properly associated with the field
    const versionField = page.locator('#version');
    const ariaDescribedBy = await versionField.getAttribute('aria-describedby');
    expect(ariaDescribedBy).toBeTruthy();
  });

  test('should have proper success messages', async ({ page }) => {
    // Fill in form
    await page.fill('#fileName', 'success-test.js');
    await page.fill('#project', 'Success Test Project');
    await page.fill('#author', 'Success User');
    await page.fill('#version', '1.0.0');
    await page.selectOption('#language', 'javascript');
    await page.selectOption('#license', 'MIT');
    await page.selectOption('#status', 'Development');
    
    // Generate header
    await page.click('#generate-header');
    
    // Check for proper success message
    const successMessage = page.locator('.toast.success');
    await expect(successMessage).toBeVisible();
    
    // Check if success message has proper ARIA attributes
    await expect(successMessage).toHaveAttribute('role', 'status');
    await expect(successMessage).toHaveAttribute('aria-live', 'polite');
  });

  test('should have proper loading states', async ({ page }) => {
    // Check for proper loading states
    const generateButton = page.locator('#generate-header');
    
    // Check if button has proper loading state
    await generateButton.click();
    
    // Check for loading indicator
    const loadingIndicator = page.locator('.loading, [aria-busy="true"]');
    if (await loadingIndicator.count() > 0) {
      await expect(loadingIndicator).toBeVisible();
    }
  });

  test('should have proper theme accessibility', async ({ page }) => {
    // Test theme toggle accessibility
    const themeToggle = page.locator('#theme-toggle');
    
    // Check for proper ARIA attributes
    await expect(themeToggle).toHaveAttribute('aria-label');
    await expect(themeToggle).toHaveAttribute('role', 'button');
    
    // Check for proper state indication
    const isPressed = await themeToggle.getAttribute('aria-pressed');
    expect(isPressed).toBeTruthy();
  });
});
