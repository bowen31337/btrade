const { test, expect } = require('@playwright/test');

// Cross-browser tests for the trading application
test.describe('Cross-Browser Compatibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(3000); // Allow components to load
  });

  test.describe('Core Functionality Tests', () => {
    test('should load main layout components across browsers', async ({ page, browserName }) => {
      console.log(`Testing on ${browserName}`);
      
      // Verify main components are visible
      await expect(page.locator('#main-content-grid')).toBeVisible();
      await expect(page.locator('#price-chart-container')).toBeVisible();
      await expect(page.locator('#order-form-container')).toBeVisible();
      await expect(page.locator('#order-book-container')).toBeVisible();
      await expect(page.locator('#trading-pair-selector-container')).toBeVisible();
    });

    test('should handle form interactions consistently', async ({ page, browserName }) => {
      console.log(`Testing form interactions on ${browserName}`);
      
      // Test buy tab functionality
      await page.click('#buy-tab');
      await expect(page.locator('#buy-tab')).toHaveClass(/active/);
      
      // Test input fields
      await page.fill('#price-input', '45000');
      await page.fill('#amount-input', '0.1');
      
      await expect(page.locator('#price-input')).toHaveValue('45000');
      await expect(page.locator('#amount-input')).toHaveValue('0.1');
      
      // Test sell tab functionality
      await page.click('#sell-tab');
      await expect(page.locator('#sell-tab')).toHaveClass(/active/);
    });

    test('should display trading pair selector correctly', async ({ page, browserName }) => {
      console.log(`Testing trading pair selector on ${browserName}`);
      
      await expect(page.locator('#trading-pair-selector-container')).toBeVisible();
      
      // Check if current pair is displayed
      const currentPair = page.locator('#current-pair-symbol');
      if (await currentPair.isVisible()) {
        await expect(currentPair).toContainText(/BTC|ETH|USD/);
      }
    });
  });

  test.describe('Chart and Data Display Tests', () => {
    test('should render price chart across browsers', async ({ page, browserName }) => {
      console.log(`Testing price chart rendering on ${browserName}`);
      
      await expect(page.locator('#price-chart-container')).toBeVisible();
      
      // Check if chart canvas or SVG is present
      const chartElement = page.locator('#price-chart-container canvas, #price-chart-container svg');
      if (await chartElement.count() > 0) {
        await expect(chartElement.first()).toBeVisible();
      }
    });

    test('should display current price information', async ({ page, browserName }) => {
      console.log(`Testing price display on ${browserName}`);
      
      const currentPrice = page.locator('#current-price');
      if (await currentPrice.isVisible()) {
        const priceText = await currentPrice.textContent();
        expect(priceText).toMatch(/\d+/);
      }
    });

    test('should show order book data', async ({ page, browserName }) => {
      console.log(`Testing order book on ${browserName}`);
      
      await expect(page.locator('#order-book-container')).toBeVisible();
      
      // Check for order book structure
      const orderBookContent = page.locator('#order-book-container');
      await expect(orderBookContent).toBeVisible();
    });
  });

  test.describe('User Interface Consistency Tests', () => {
    test('should maintain consistent styling across browsers', async ({ page, browserName }) => {
      console.log(`Testing UI consistency on ${browserName}`);
      
      // Check main grid layout
      const mainGrid = page.locator('#main-content-grid');
      await expect(mainGrid).toBeVisible();
      
      // Verify form container styling
      const orderForm = page.locator('#order-form-container');
      await expect(orderForm).toBeVisible();
      
      // Check button styling
      const buyTab = page.locator('#buy-tab');
      const sellTab = page.locator('#sell-tab');
      
      await expect(buyTab).toBeVisible();
      await expect(sellTab).toBeVisible();
    });

    test('should handle hover states consistently', async ({ page, browserName }) => {
      console.log(`Testing hover states on ${browserName}`);
      
      // Test button hover (if not on mobile)
      if (browserName !== 'Mobile Safari') {
        await page.hover('#buy-tab');
        await page.waitForTimeout(500);
        
        await page.hover('#sell-tab');
        await page.waitForTimeout(500);
      }
      
      // Verify elements remain functional after hover
      await page.click('#buy-tab');
      await expect(page.locator('#buy-tab')).toHaveClass(/active/);
    });

    test('should handle focus states properly', async ({ page, browserName }) => {
      console.log(`Testing focus states on ${browserName}`);
      
      // Test input field focus
      await page.focus('#price-input');
      await expect(page.locator('#price-input')).toBeFocused();
      
      await page.focus('#amount-input');
      await expect(page.locator('#amount-input')).toBeFocused();
      
      // Test tab navigation
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
    });
  });

  test.describe('JavaScript Functionality Tests', () => {
    test('should execute JavaScript correctly across browsers', async ({ page, browserName }) => {
      console.log(`Testing JavaScript execution on ${browserName}`);
      
      // Test form validation logic
      await page.click('#buy-tab');
      await page.fill('#price-input', 'invalid');
      await page.fill('#amount-input', 'invalid');
      
      // Try to submit and check for validation
      const submitBtn = page.locator('#submit-order-btn');
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await page.waitForTimeout(1000);
      }
      
      // Clear and enter valid data
      await page.fill('#price-input', '45000');
      await page.fill('#amount-input', '0.1');
      
      await expect(page.locator('#price-input')).toHaveValue('45000');
      await expect(page.locator('#amount-input')).toHaveValue('0.1');
    });

    test('should handle tab switching logic', async ({ page, browserName }) => {
      console.log(`Testing tab switching on ${browserName}`);
      
      // Test buy tab
      await page.click('#buy-tab');
      await page.waitForTimeout(500);
      await expect(page.locator('#buy-tab')).toHaveClass(/active/);
      
      // Test sell tab
      await page.click('#sell-tab');
      await page.waitForTimeout(500);
      await expect(page.locator('#sell-tab')).toHaveClass(/active/);
      
      // Switch back to buy
      await page.click('#buy-tab');
      await page.waitForTimeout(500);
      await expect(page.locator('#buy-tab')).toHaveClass(/active/);
    });

    test('should handle rapid interactions', async ({ page, browserName }) => {
      console.log(`Testing rapid interactions on ${browserName}`);
      
      // Rapid tab switching
      for (let i = 0; i < 5; i++) {
        await page.click('#buy-tab');
        await page.waitForTimeout(100);
        await page.click('#sell-tab');
        await page.waitForTimeout(100);
      }
      
      // Verify final state
      await expect(page.locator('#sell-tab')).toHaveClass(/active/);
      
      // Rapid input changes
      await page.click('#buy-tab');
      for (let i = 0; i < 3; i++) {
        await page.fill('#price-input', `${40000 + i * 1000}`);
        await page.fill('#amount-input', `0.${i + 1}`);
        await page.waitForTimeout(200);
      }
      
      await expect(page.locator('#price-input')).toHaveValue('42000');
      await expect(page.locator('#amount-input')).toHaveValue('0.3');
    });
  });

  test.describe('Performance and Loading Tests', () => {
    test('should load components within reasonable time', async ({ page, browserName }) => {
      console.log(`Testing loading performance on ${browserName}`);
      
      const startTime = Date.now();
      
      // Reload page and measure load time
      await page.reload();
      await page.waitForSelector('#main-content-grid', { timeout: 10000 });
      
      const loadTime = Date.now() - startTime;
      console.log(`Load time on ${browserName}: ${loadTime}ms`);
      
      // Should load within 10 seconds
      expect(loadTime).toBeLessThan(10000);
      
      // Verify all main components loaded
      await expect(page.locator('#main-content-grid')).toBeVisible();
      await expect(page.locator('#order-form-container')).toBeVisible();
    });

    test('should handle multiple simultaneous operations', async ({ page, browserName }) => {
      console.log(`Testing simultaneous operations on ${browserName}`);
      
      // Perform multiple operations simultaneously
      await Promise.all([
        page.click('#buy-tab'),
        page.fill('#price-input', '45000'),
        page.fill('#amount-input', '0.1')
      ]);
      
      await page.waitForTimeout(1000);
      
      // Verify final state
      await expect(page.locator('#buy-tab')).toHaveClass(/active/);
      await expect(page.locator('#price-input')).toHaveValue('45000');
      await expect(page.locator('#amount-input')).toHaveValue('0.1');
    });
  });

  test.describe('Error Handling Tests', () => {
    test('should handle JavaScript errors gracefully', async ({ page, browserName }) => {
      console.log(`Testing error handling on ${browserName}`);
      
      // Monitor console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      // Perform various operations
      await page.click('#buy-tab');
      await page.fill('#price-input', '45000');
      await page.fill('#amount-input', '0.1');
      await page.click('#sell-tab');
      
      await page.waitForTimeout(2000);
      
      // Check that no critical errors occurred
      const criticalErrors = consoleErrors.filter(error => 
        error.includes('TypeError') || 
        error.includes('ReferenceError') ||
        error.includes('SyntaxError')
      );
      
      expect(criticalErrors.length).toBe(0);
    });

    test('should maintain functionality after network interruption simulation', async ({ page, browserName }) => {
      console.log(`Testing network resilience on ${browserName}`);
      
      // Test basic functionality first
      await page.click('#buy-tab');
      await page.fill('#price-input', '45000');
      await expect(page.locator('#price-input')).toHaveValue('45000');
      
      // Simulate network issues by going offline briefly
      await page.context().setOffline(true);
      await page.waitForTimeout(1000);
      await page.context().setOffline(false);
      
      // Wait for potential reconnection
      await page.waitForTimeout(2000);
      
      // Verify functionality still works
      await page.fill('#amount-input', '0.1');
      await expect(page.locator('#amount-input')).toHaveValue('0.1');
      
      await page.click('#sell-tab');
      await expect(page.locator('#sell-tab')).toHaveClass(/active/);
    });
  });

  test.describe('Browser-Specific Feature Tests', () => {
    test('should handle browser-specific CSS features', async ({ page, browserName }) => {
      console.log(`Testing CSS features on ${browserName}`);
      
      // Check if CSS Grid is working
      const mainGrid = page.locator('#main-content-grid');
      const computedStyle = await mainGrid.evaluate(el => {
        return window.getComputedStyle(el).display;
      });
      
      expect(computedStyle).toBe('grid');
      
      // Check if flexbox is working in form container
      const orderForm = page.locator('#order-form-container');
      await expect(orderForm).toBeVisible();
    });

    test('should handle browser-specific JavaScript APIs', async ({ page, browserName }) => {
      console.log(`Testing JavaScript APIs on ${browserName}`);
      
      // Test localStorage availability
      const hasLocalStorage = await page.evaluate(() => {
        try {
          localStorage.setItem('test', 'value');
          localStorage.removeItem('test');
          return true;
        } catch (e) {
          return false;
        }
      });
      
      expect(hasLocalStorage).toBe(true);
      
      // Test basic DOM manipulation
      await page.click('#buy-tab');
      const isActive = await page.locator('#buy-tab').evaluate(el => {
        return el.classList.contains('active') || el.getAttribute('aria-selected') === 'true';
      });
      
      expect(isActive).toBe(true);
    });
  });
});