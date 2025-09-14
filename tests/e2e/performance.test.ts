import { test, expect } from '@playwright/test';

test.describe('HeadForge Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Load the extension
    await page.goto('chrome-extension://[extension-id]/popup/popup.html');
  });

  test('popup load time should be under 100ms', async ({ page }) => {
    const startTime = Date.now();
    
    // Wait for popup to be fully loaded
    await expect(page.locator('.popup-container')).toBeVisible();
    await expect(page.locator('#fileName')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(100);
    
    console.log(`Popup load time: ${loadTime}ms`);
  });

  test('header generation should be under 50ms', async ({ page }) => {
    // Fill in form
    await page.fill('#fileName', 'performance-test.js');
    await page.fill('#project', 'Performance Test Project');
    await page.fill('#author', 'Performance User');
    await page.fill('#version', '1.0.0');
    await page.selectOption('#language', 'javascript');
    await page.selectOption('#license', 'MIT');
    await page.selectOption('#status', 'Development');
    
    const startTime = Date.now();
    
    // Generate header
    await page.click('#generate-header');
    await expect(page.locator('.toast.success')).toBeVisible();
    
    const generationTime = Date.now() - startTime;
    expect(generationTime).toBeLessThan(50);
    
    console.log(`Header generation time: ${generationTime}ms`);
  });

  test('language switching should be under 30ms', async ({ page }) => {
    const languages = ['javascript', 'python', 'java', 'html', 'css'];
    
    for (const language of languages) {
      const startTime = Date.now();
      
      await page.selectOption('#language', language);
      
      // Wait for preview to update
      await expect(page.locator('#preview-code')).toContainText('test-file');
      
      const switchTime = Date.now() - startTime;
      expect(switchTime).toBeLessThan(30);
      
      console.log(`Language switch to ${language}: ${switchTime}ms`);
    }
  });

  test('theme switching should be under 20ms', async ({ page }) => {
    const startTime = Date.now();
    
    await page.click('#theme-toggle');
    await expect(page.locator('body')).toHaveClass(/dark-mode/);
    
    const switchTime = Date.now() - startTime;
    expect(switchTime).toBeLessThan(20);
    
    console.log(`Theme switch time: ${switchTime}ms`);
  });

  test('form validation should be under 10ms', async ({ page }) => {
    const startTime = Date.now();
    
    // Try to generate without filling required fields
    await page.click('#generate-header');
    await expect(page.locator('.form-error.show')).toBeVisible();
    
    const validationTime = Date.now() - startTime;
    expect(validationTime).toBeLessThan(10);
    
    console.log(`Form validation time: ${validationTime}ms`);
  });

  test('clipboard copy should be under 100ms', async ({ page }) => {
    // Fill in form
    await page.fill('#fileName', 'clipboard-test.js');
    await page.fill('#project', 'Clipboard Test Project');
    await page.fill('#author', 'Clipboard User');
    await page.fill('#version', '1.0.0');
    await page.selectOption('#language', 'javascript');
    await page.selectOption('#license', 'MIT');
    await page.selectOption('#status', 'Development');
    
    // Generate header first
    await page.click('#generate-header');
    
    const startTime = Date.now();
    
    // Copy to clipboard
    await page.click('#copy-clipboard');
    await expect(page.locator('.toast.success')).toBeVisible();
    
    const copyTime = Date.now() - startTime;
    expect(copyTime).toBeLessThan(100);
    
    console.log(`Clipboard copy time: ${copyTime}ms`);
  });

  test('file download should be under 200ms', async ({ page }) => {
    // Fill in form
    await page.fill('#fileName', 'download-test.js');
    await page.fill('#project', 'Download Test Project');
    await page.fill('#author', 'Download User');
    await page.fill('#version', '1.0.0');
    await page.selectOption('#language', 'javascript');
    await page.selectOption('#license', 'MIT');
    await page.selectOption('#status', 'Development');
    
    // Generate header first
    await page.click('#generate-header');
    
    const startTime = Date.now();
    
    // Download file
    const downloadPromise = page.waitForEvent('download');
    await page.click('#download-file');
    const download = await downloadPromise;
    
    const downloadTime = Date.now() - startTime;
    expect(downloadTime).toBeLessThan(200);
    
    console.log(`File download time: ${downloadTime}ms`);
  });

  test('memory usage should be under 10MB', async ({ page }) => {
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    });
    
    // Fill in form multiple times to test memory usage
    for (let i = 0; i < 10; i++) {
      await page.fill('#fileName', `memory-test-${i}.js`);
      await page.fill('#project', 'Memory Test Project');
      await page.fill('#author', 'Memory User');
      await page.fill('#version', '1.0.0');
      await page.selectOption('#language', 'javascript');
      await page.selectOption('#license', 'MIT');
      await page.selectOption('#status', 'Development');
      
      await page.click('#generate-header');
      await page.click('#copy-clipboard');
    }
    
    // Get final memory usage
    const finalMemory = await page.evaluate(() => {
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    });
    
    const memoryIncrease = finalMemory - initialMemory;
    const memoryIncreaseMB = memoryIncrease / (1024 * 1024);
    
    expect(memoryIncreaseMB).toBeLessThan(10);
    
    console.log(`Memory increase: ${memoryIncreaseMB.toFixed(2)}MB`);
  });

  test('should handle large form data efficiently', async ({ page }) => {
    const largeText = 'A'.repeat(10000); // 10KB text
    
    const startTime = Date.now();
    
    // Fill in form with large data
    await page.fill('#fileName', 'large-data-test.js');
    await page.fill('#project', 'Large Data Test Project');
    await page.fill('#author', 'Large Data User');
    await page.fill('#version', '1.0.0');
    await page.fill('#description', largeText);
    await page.fill('#dependencies', largeText);
    await page.fill('#usage', largeText);
    await page.fill('#notes', largeText);
    await page.fill('#todo', largeText);
    await page.selectOption('#language', 'javascript');
    await page.selectOption('#license', 'MIT');
    await page.selectOption('#status', 'Development');
    
    // Generate header
    await page.click('#generate-header');
    await expect(page.locator('.toast.success')).toBeVisible();
    
    const processingTime = Date.now() - startTime;
    expect(processingTime).toBeLessThan(500);
    
    console.log(`Large data processing time: ${processingTime}ms`);
  });

  test('should handle rapid user interactions', async ({ page }) => {
    const startTime = Date.now();
    
    // Rapidly fill in form
    await page.fill('#fileName', 'rapid-test.js');
    await page.fill('#project', 'Rapid Test Project');
    await page.fill('#author', 'Rapid User');
    await page.fill('#version', '1.0.0');
    await page.selectOption('#language', 'javascript');
    await page.selectOption('#license', 'MIT');
    await page.selectOption('#status', 'Development');
    
    // Rapidly switch languages
    const languages = ['javascript', 'python', 'java', 'html', 'css'];
    for (const language of languages) {
      await page.selectOption('#language', language);
    }
    
    // Rapidly switch themes
    for (let i = 0; i < 5; i++) {
      await page.click('#theme-toggle');
    }
    
    // Generate header
    await page.click('#generate-header');
    await expect(page.locator('.toast.success')).toBeVisible();
    
    const totalTime = Date.now() - startTime;
    expect(totalTime).toBeLessThan(1000);
    
    console.log(`Rapid interactions time: ${totalTime}ms`);
  });

  test('should maintain performance with multiple tabs', async ({ page, context }) => {
    // Open multiple tabs
    const tabs = [];
    for (let i = 0; i < 5; i++) {
      const newPage = await context.newPage();
      await newPage.goto('chrome-extension://[extension-id]/popup/popup.html');
      tabs.push(newPage);
    }
    
    const startTime = Date.now();
    
    // Test performance on each tab
    for (const tab of tabs) {
      await tab.fill('#fileName', 'multi-tab-test.js');
      await tab.fill('#project', 'Multi Tab Test Project');
      await tab.fill('#author', 'Multi Tab User');
      await tab.fill('#version', '1.0.0');
      await tab.selectOption('#language', 'javascript');
      await tab.selectOption('#license', 'MIT');
      await tab.selectOption('#status', 'Development');
      await tab.check('input[name="platform"][value="Chrome"]');
      
      await tab.click('#generate-header');
      await expect(tab.locator('.toast.success')).toBeVisible();
    }
    
    const totalTime = Date.now() - startTime;
    expect(totalTime).toBeLessThan(2000);
    
    console.log(`Multi-tab performance time: ${totalTime}ms`);
    
    // Close tabs
    for (const tab of tabs) {
      await tab.close();
    }
  });

  test('should handle concurrent operations', async ({ page }) => {
    const startTime = Date.now();
    
    // Fill in form
    await page.fill('#fileName', 'concurrent-test.js');
    await page.fill('#project', 'Concurrent Test Project');
    await page.fill('#author', 'Concurrent User');
    await page.fill('#version', '1.0.0');
    await page.selectOption('#language', 'javascript');
    await page.selectOption('#license', 'MIT');
    await page.selectOption('#status', 'Development');
    
    // Perform concurrent operations
    const operations = [
      page.click('#generate-header'),
      page.click('#copy-clipboard'),
      page.click('#download-file'),
      page.click('#theme-toggle')
    ];
    
    await Promise.all(operations);
    
    const totalTime = Date.now() - startTime;
    expect(totalTime).toBeLessThan(300);
    
    console.log(`Concurrent operations time: ${totalTime}ms`);
  });
});
