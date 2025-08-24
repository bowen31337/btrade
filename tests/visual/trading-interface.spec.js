import { test, expect } from '@playwright/test';

test.describe('Trading Interface Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the trading application
    await page.goto('/');
    // Wait for the application to load
    await page.waitForLoadState('networkidle');
    // Wait for charts to render
    await page.waitForTimeout(2000);
  });

  test('Main trading interface layout', async ({ page }) => {
    // Take a full page screenshot
    await expect(page).toHaveScreenshot('main-trading-interface.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('Header and navigation', async ({ page }) => {
    // Screenshot of the header area
    const header = page.locator('header, .header, [data-testid="header"]').first();
    if (await header.count() > 0) {
      await expect(header).toHaveScreenshot('header-navigation.png');
    } else {
      // Fallback: screenshot top portion of page
      await expect(page).toHaveScreenshot('top-navigation.png', {
        clip: { x: 0, y: 0, width: 1280, height: 100 }
      });
    }
  });

  test('Trading pair selector', async ({ page }) => {
    // Look for trading pair selector component
    const pairSelector = page.locator('[data-testid="trading-pair-selector"], .trading-pair-selector, .pair-selector').first();
    if (await pairSelector.count() > 0) {
      await expect(pairSelector).toHaveScreenshot('trading-pair-selector.png');
    }
  });

  test('Price chart component', async ({ page }) => {
    // Wait for chart to load and take screenshot
    const chartContainer = page.locator('[data-testid="price-chart"], .chart-container, #tradingview_chart, .tv-chart').first();
    if (await chartContainer.count() > 0) {
      await expect(chartContainer).toHaveScreenshot('price-chart.png');
    }
  });

  test('Order form - Buy side', async ({ page }) => {
    // Look for order form
    const orderForm = page.locator('[data-testid="order-form"], .order-form').first();
    if (await orderForm.count() > 0) {
      // Click on Buy tab if it exists
      const buyTab = page.locator('button:has-text("Buy"), [data-testid="buy-tab"]').first();
      if (await buyTab.count() > 0) {
        await buyTab.click();
        await page.waitForTimeout(500);
      }
      await expect(orderForm).toHaveScreenshot('order-form-buy.png');
    }
  });

  test('Order form - Sell side', async ({ page }) => {
    // Look for order form
    const orderForm = page.locator('[data-testid="order-form"], .order-form').first();
    if (await orderForm.count() > 0) {
      // Click on Sell tab if it exists
      const sellTab = page.locator('button:has-text("Sell"), [data-testid="sell-tab"]').first();
      if (await sellTab.count() > 0) {
        await sellTab.click();
        await page.waitForTimeout(500);
      }
      await expect(orderForm).toHaveScreenshot('order-form-sell.png');
    }
  });

  test('Order book component', async ({ page }) => {
    // Look for order book
    const orderBook = page.locator('[data-testid="order-book"], .order-book, .orderbook').first();
    if (await orderBook.count() > 0) {
      await expect(orderBook).toHaveScreenshot('order-book.png');
    }
  });

  test('Market data and ticker', async ({ page }) => {
    // Look for market data/ticker components
    const ticker = page.locator('[data-testid="ticker"], .ticker, .market-data, .price-ticker').first();
    if (await ticker.count() > 0) {
      await expect(ticker).toHaveScreenshot('market-ticker.png');
    }
  });

  test('Responsive design - Mobile view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('mobile-trading-interface.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('Responsive design - Tablet view', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('tablet-trading-interface.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('Dark/Light theme consistency', async ({ page }) => {
    // Look for theme toggle
    const themeToggle = page.locator('[data-testid="theme-toggle"], .theme-toggle, button:has-text("Dark"), button:has-text("Light")').first();
    
    // Take screenshot of current theme
    await expect(page).toHaveScreenshot('current-theme.png', {
      fullPage: true,
      animations: 'disabled'
    });
    
    // If theme toggle exists, test the other theme
    if (await themeToggle.count() > 0) {
      await themeToggle.click();
      await page.waitForTimeout(1000);
      await expect(page).toHaveScreenshot('toggled-theme.png', {
        fullPage: true,
        animations: 'disabled'
      });
    }
  });

  test('Interactive elements hover states', async ({ page }) => {
    // Test hover states on buttons
    const buttons = page.locator('button').first();
    if (await buttons.count() > 0) {
      await buttons.hover();
      await page.waitForTimeout(300);
      await expect(buttons).toHaveScreenshot('button-hover-state.png');
    }
  });

  test('Form validation visual feedback', async ({ page }) => {
    // Look for order form inputs
    const priceInput = page.locator('input[placeholder*="price"], input[name*="price"], [data-testid="price-input"]').first();
    const quantityInput = page.locator('input[placeholder*="quantity"], input[name*="quantity"], [data-testid="quantity-input"]').first();
    
    if (await priceInput.count() > 0) {
      // Enter invalid data to trigger validation
      await priceInput.fill('-1');
      await priceInput.blur();
      await page.waitForTimeout(500);
      
      const orderForm = page.locator('[data-testid="order-form"], .order-form').first();
      if (await orderForm.count() > 0) {
        await expect(orderForm).toHaveScreenshot('form-validation-error.png');
      }
    }
  });
});