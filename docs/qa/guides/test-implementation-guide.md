# Test Implementation Guide - BTrade Application

Date: 2024-12-19
Author: Quinn (Test Architect)

## Overview

This guide provides practical implementation details for the test scenarios defined in the BTrade test design. It includes code examples, setup instructions, and best practices specific to the BTrade trading application.

## Test Framework Setup

### Recommended Stack

```json
{
  "unit-testing": "Vitest (fast, Vite-compatible)",
  "integration-testing": "Vitest + Testing Library",
  "e2e-testing": "Playwright (cross-browser support)",
  "mocking": "Vitest mocks + MSW for API mocking",
  "assertions": "Vitest built-in + Testing Library queries"
}
```

### Installation

```bash
npm install -D vitest @testing-library/dom @testing-library/jest-dom
npm install -D playwright @playwright/test
npm install -D msw
```

### Configuration Files

#### vitest.config.js
```javascript
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.config.js'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
```

#### playwright.config.js
```javascript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src/test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Unit Test Implementation Examples

### Real-Time Data Flow Tests (RTDF-UNIT-001, RTDF-UNIT-002)

```javascript
// src/test/unit/services/mockDataService.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mockDataService } from '@/services/mockDataService.js'

describe('MockDataService - Price Updates', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    mockDataService.clearAllSubscriptions()
  })

  // RTDF-UNIT-001: Price update validation logic
  it('should validate price format and range', () => {
    const validPrices = [
      { symbol: 'BTCUSDT', price: 45000.50 },
      { symbol: 'ETHUSDT', price: 2500.25 },
      { symbol: 'BNBUSDT', price: 300.00 }
    ]

    const invalidPrices = [
      { symbol: 'BTCUSDT', price: -100 }, // Negative price
      { symbol: 'ETHUSDT', price: 'invalid' }, // Non-numeric
      { symbol: 'BNBUSDT', price: null }, // Null value
      { symbol: '', price: 100 }, // Empty symbol
    ]

    validPrices.forEach(priceData => {
      expect(mockDataService.validatePriceData(priceData)).toBe(true)
    })

    invalidPrices.forEach(priceData => {
      expect(mockDataService.validatePriceData(priceData)).toBe(false)
    })
  })

  // RTDF-UNIT-002: State synchronization algorithms
  it('should synchronize price updates across subscribers', () => {
    const subscriber1 = vi.fn()
    const subscriber2 = vi.fn()
    
    mockDataService.subscribeToPriceUpdates('BTCUSDT', subscriber1)
    mockDataService.subscribeToPriceUpdates('BTCUSDT', subscriber2)

    const newPrice = { symbol: 'BTCUSDT', price: 46000.00, timestamp: Date.now() }
    mockDataService.updatePrice(newPrice)

    expect(subscriber1).toHaveBeenCalledWith(newPrice)
    expect(subscriber2).toHaveBeenCalledWith(newPrice)
    expect(subscriber1).toHaveBeenCalledTimes(1)
    expect(subscriber2).toHaveBeenCalledTimes(1)
  })

  // RTDF-UNIT-003: Error handling for invalid price data
  it('should handle invalid price data gracefully', () => {
    const subscriber = vi.fn()
    const errorHandler = vi.fn()
    
    mockDataService.subscribeToPriceUpdates('BTCUSDT', subscriber)
    mockDataService.onError(errorHandler)

    const invalidPrice = { symbol: 'BTCUSDT', price: -1000 }
    mockDataService.updatePrice(invalidPrice)

    expect(subscriber).not.toHaveBeenCalled()
    expect(errorHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'INVALID_PRICE_DATA',
        data: invalidPrice
      })
    )
  })
})
```

### Order Management Tests (OMS-UNIT-001, OMS-UNIT-002)

```javascript
// src/test/unit/components/OrderForm.test.js
import { describe, it, expect, vi } from 'vitest'
import { OrderForm } from '@/components/OrderForm.js'

describe('OrderForm - Order Validation', () => {
  let orderForm

  beforeEach(() => {
    document.body.innerHTML = '<div id="order-form-container"></div>'
    orderForm = new OrderForm('#order-form-container')
  })

  // OMS-UNIT-001: Order validation logic
  it('should validate order parameters correctly', () => {
    const validOrders = [
      { type: 'market', side: 'buy', quantity: 0.1, symbol: 'BTCUSDT' },
      { type: 'limit', side: 'sell', quantity: 1.0, price: 45000, symbol: 'ETHUSDT' },
      { type: 'stop-loss', side: 'sell', quantity: 0.5, stopPrice: 44000, symbol: 'BTCUSDT' }
    ]

    const invalidOrders = [
      { type: 'market', side: 'buy', quantity: 0, symbol: 'BTCUSDT' }, // Zero quantity
      { type: 'limit', side: 'sell', quantity: 1.0, symbol: 'ETHUSDT' }, // Missing price
      { type: 'invalid', side: 'buy', quantity: 0.1, symbol: 'BTCUSDT' }, // Invalid type
      { type: 'market', side: 'invalid', quantity: 0.1, symbol: 'BTCUSDT' }, // Invalid side
    ]

    validOrders.forEach(order => {
      expect(orderForm.validateOrder(order)).toEqual({ valid: true, errors: [] })
    })

    invalidOrders.forEach(order => {
      const result = orderForm.validateOrder(order)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  // OMS-UNIT-002: Order calculation accuracy
  it('should calculate order totals accurately', () => {
    const testCases = [
      {
        order: { type: 'limit', side: 'buy', quantity: 1.0, price: 45000 },
        expected: { total: 45000, fee: 45, netTotal: 45045 }
      },
      {
        order: { type: 'limit', side: 'sell', quantity: 0.5, price: 50000 },
        expected: { total: 25000, fee: 25, netTotal: 24975 }
      },
      {
        order: { type: 'market', side: 'buy', quantity: 0.1, marketPrice: 46000 },
        expected: { total: 4600, fee: 4.6, netTotal: 4604.6 }
      }
    ]

    testCases.forEach(({ order, expected }) => {
      const calculation = orderForm.calculateOrderTotal(order)
      expect(calculation.total).toBeCloseTo(expected.total, 2)
      expect(calculation.fee).toBeCloseTo(expected.fee, 2)
      expect(calculation.netTotal).toBeCloseTo(expected.netTotal, 2)
    })
  })
})
```

### Price Calculation Tests (PCD-UNIT-001, PCD-UNIT-002)

```javascript
// src/test/unit/utils/priceCalculations.test.js
import { describe, it, expect } from 'vitest'
import { formatPrice, calculatePercentageChange } from '@/utils/priceCalculations.js'

describe('Price Calculations', () => {
  // PCD-UNIT-001: Price formatting algorithms
  it('should format prices correctly for different ranges', () => {
    const testCases = [
      { price: 45123.456789, expected: '45,123.46' }, // High value BTC
      { price: 2567.123456, expected: '2,567.12' }, // Mid value ETH
      { price: 0.000123456, expected: '0.000123' }, // Low value altcoin
      { price: 1.0, expected: '1.00' }, // Stable coin
      { price: 0, expected: '0.00' }, // Zero value
    ]

    testCases.forEach(({ price, expected }) => {
      expect(formatPrice(price)).toBe(expected)
    })
  })

  // PCD-UNIT-002: Percentage change calculations
  it('should calculate percentage changes accurately', () => {
    const testCases = [
      { current: 45000, previous: 40000, expected: 12.5 }, // 12.5% increase
      { current: 40000, previous: 45000, expected: -11.11 }, // 11.11% decrease
      { current: 45000, previous: 45000, expected: 0 }, // No change
      { current: 50000, previous: 0, expected: null }, // Division by zero
    ]

    testCases.forEach(({ current, previous, expected }) => {
      const result = calculatePercentageChange(current, previous)
      if (expected === null) {
        expect(result).toBeNull()
      } else {
        expect(result).toBeCloseTo(expected, 2)
      }
    })
  })
})
```

## Integration Test Implementation Examples

### Real-Time Data Integration (RTDF-INT-001)

```javascript
// src/test/integration/priceSubscription.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mockDataService } from '@/services/mockDataService.js'
import { PriceChart } from '@/components/PriceChart.js'
import { TradingPairSelector } from '@/components/TradingPairSelector.js'

describe('Price Subscription Integration', () => {
  let container, priceChart, tradingPairSelector

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test-container">
        <div id="price-chart"></div>
        <div id="trading-pair-selector"></div>
      </div>
    `
    container = document.getElementById('test-container')
    priceChart = new PriceChart('#price-chart')
    tradingPairSelector = new TradingPairSelector('#trading-pair-selector')
  })

  afterEach(() => {
    mockDataService.clearAllSubscriptions()
    document.body.innerHTML = ''
  })

  // RTDF-INT-001: Price subscription service flow
  it('should update chart when trading pair selection changes', async () => {
    // Setup initial state
    await priceChart.initialize()
    await tradingPairSelector.initialize()

    // Simulate trading pair selection
    const newPair = 'ETHUSDT'
    tradingPairSelector.selectPair(newPair)

    // Wait for subscription to be established
    await new Promise(resolve => setTimeout(resolve, 100))

    // Simulate price update
    const priceUpdate = {
      symbol: newPair,
      price: 2500.50,
      timestamp: Date.now()
    }
    mockDataService.updatePrice(priceUpdate)

    // Wait for UI update
    await new Promise(resolve => setTimeout(resolve, 50))

    // Verify chart was updated
    const chartData = priceChart.getCurrentData()
    expect(chartData.symbol).toBe(newPair)
    expect(chartData.currentPrice).toBe(2500.50)
  })
})
```

### Order Management Integration (OMS-INT-001)

```javascript
// src/test/integration/orderWorkflow.test.js
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { OrderForm } from '@/components/OrderForm.js'
import { UserOrders } from '@/components/UserOrders.js'
import { mockDataService } from '@/services/mockDataService.js'

describe('Order Workflow Integration', () => {
  let orderForm, userOrders

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="order-form"></div>
      <div id="user-orders"></div>
    `
    orderForm = new OrderForm('#order-form')
    userOrders = new UserOrders('#user-orders')
  })

  afterEach(() => {
    mockDataService.clearAllOrders()
    document.body.innerHTML = ''
  })

  // OMS-INT-001: Order submission workflow
  it('should complete order submission workflow', async () => {
    await orderForm.initialize()
    await userOrders.initialize()

    // Fill order form
    const orderData = {
      type: 'limit',
      side: 'buy',
      quantity: 0.1,
      price: 45000,
      symbol: 'BTCUSDT'
    }

    orderForm.fillForm(orderData)
    
    // Submit order
    const submitResult = await orderForm.submitOrder()
    expect(submitResult.success).toBe(true)
    expect(submitResult.orderId).toBeDefined()

    // Wait for order to appear in user orders
    await new Promise(resolve => setTimeout(resolve, 100))

    // Verify order appears in user orders list
    const orders = userOrders.getDisplayedOrders()
    expect(orders).toHaveLength(1)
    expect(orders[0]).toMatchObject({
      id: submitResult.orderId,
      type: 'limit',
      side: 'buy',
      quantity: 0.1,
      price: 45000,
      symbol: 'BTCUSDT',
      status: 'pending'
    })
  })
})
```

## E2E Test Implementation Examples

### Real-Time Updates E2E (RTDF-E2E-001)

```javascript
// src/test/e2e/realTimeUpdates.spec.js
import { test, expect } from '@playwright/test'

test.describe('Real-Time Price Updates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  // RTDF-E2E-001: Real-time price updates across UI
  test('should update prices across all components simultaneously', async ({ page }) => {
    // Wait for initial load
    await expect(page.locator('[data-testid="price-chart"]')).toBeVisible()
    await expect(page.locator('[data-testid="order-book"]')).toBeVisible()
    await expect(page.locator('[data-testid="market-trades"]')).toBeVisible()

    // Get initial price from chart
    const initialPrice = await page.locator('[data-testid="current-price"]').textContent()
    
    // Wait for price update (mock service updates every 1 second)
    await page.waitForTimeout(1500)
    
    // Get updated price
    const updatedPrice = await page.locator('[data-testid="current-price"]').textContent()
    
    // Verify price changed
    expect(updatedPrice).not.toBe(initialPrice)
    
    // Verify price is consistent across components
    const chartPrice = await page.locator('[data-testid="chart-current-price"]').textContent()
    const orderBookPrice = await page.locator('[data-testid="orderbook-current-price"]').textContent()
    
    expect(chartPrice).toBe(updatedPrice)
    expect(orderBookPrice).toBe(updatedPrice)
  })

  test('should handle trading pair switching with price updates', async ({ page }) => {
    // Select different trading pair
    await page.click('[data-testid="trading-pair-selector"]')
    await page.click('[data-testid="pair-ETHUSDT"]')
    
    // Wait for new data to load
    await page.waitForTimeout(500)
    
    // Verify pair changed in all components
    await expect(page.locator('[data-testid="selected-pair"]')).toHaveText('ETH/USDT')
    
    // Verify price updates continue for new pair
    const initialEthPrice = await page.locator('[data-testid="current-price"]').textContent()
    await page.waitForTimeout(1500)
    const updatedEthPrice = await page.locator('[data-testid="current-price"]').textContent()
    
    expect(updatedEthPrice).not.toBe(initialEthPrice)
  })
})
```

### Order Lifecycle E2E (OMS-E2E-001)

```javascript
// src/test/e2e/orderLifecycle.spec.js
import { test, expect } from '@playwright/test'

test.describe('Order Lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  // OMS-E2E-001: Complete order lifecycle
  test('should complete full order lifecycle from creation to execution', async ({ page }) => {
    // Navigate to order form
    await expect(page.locator('[data-testid="order-form"]')).toBeVisible()
    
    // Fill order form
    await page.selectOption('[data-testid="order-type"]', 'limit')
    await page.selectOption('[data-testid="order-side"]', 'buy')
    await page.fill('[data-testid="quantity-input"]', '0.1')
    await page.fill('[data-testid="price-input"]', '45000')
    
    // Verify order total calculation
    await expect(page.locator('[data-testid="order-total"]')).toHaveText('4,500.00 USDT')
    await expect(page.locator('[data-testid="order-fee"]')).toHaveText('4.50 USDT')
    
    // Submit order
    await page.click('[data-testid="submit-order"]')
    
    // Verify success message
    await expect(page.locator('[data-testid="order-success"]')).toBeVisible()
    
    // Check order appears in user orders
    await expect(page.locator('[data-testid="user-orders"] tbody tr')).toHaveCount(1)
    
    // Verify order details in table
    const orderRow = page.locator('[data-testid="user-orders"] tbody tr').first()
    await expect(orderRow.locator('[data-testid="order-type"]')).toHaveText('Limit')
    await expect(orderRow.locator('[data-testid="order-side"]')).toHaveText('Buy')
    await expect(orderRow.locator('[data-testid="order-quantity"]')).toHaveText('0.1')
    await expect(orderRow.locator('[data-testid="order-price"]')).toHaveText('45,000.00')
    await expect(orderRow.locator('[data-testid="order-status"]')).toHaveText('Pending')
    
    // Wait for order execution (mock service executes after 2 seconds)
    await page.waitForTimeout(2500)
    
    // Verify order status changed to executed
    await expect(orderRow.locator('[data-testid="order-status"]')).toHaveText('Executed')
    
    // Verify order appears in trade history
    await page.click('[data-testid="trade-history-tab"]')
    await expect(page.locator('[data-testid="trade-history"] tbody tr')).toHaveCount(1)
  })

  test('should handle order validation errors', async ({ page }) => {
    // Try to submit empty form
    await page.click('[data-testid="submit-order"]')
    
    // Verify validation errors
    await expect(page.locator('[data-testid="quantity-error"]')).toHaveText('Quantity is required')
    await expect(page.locator('[data-testid="price-error"]')).toHaveText('Price is required')
    
    // Fill invalid values
    await page.fill('[data-testid="quantity-input"]', '0')
    await page.fill('[data-testid="price-input"]', '-100')
    
    await page.click('[data-testid="submit-order"]')
    
    // Verify specific validation errors
    await expect(page.locator('[data-testid="quantity-error"]')).toHaveText('Quantity must be greater than 0')
    await expect(page.locator('[data-testid="price-error"]')).toHaveText('Price must be positive')
  })
})
```

## Test Data Management

### Mock Data Setup

```javascript
// src/test/fixtures/mockData.js
export const mockTradingPairs = [
  { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', price: 45000 },
  { symbol: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT', price: 2500 },
  { symbol: 'BNBUSDT', baseAsset: 'BNB', quoteAsset: 'USDT', price: 300 }
]

export const mockOrderBook = {
  bids: [
    { price: 44999.50, quantity: 0.5 },
    { price: 44999.00, quantity: 1.2 },
    { price: 44998.50, quantity: 0.8 }
  ],
  asks: [
    { price: 45000.50, quantity: 0.3 },
    { price: 45001.00, quantity: 0.9 },
    { price: 45001.50, quantity: 1.1 }
  ]
}

export const mockCandlestickData = [
  { time: '2024-12-19T10:00:00Z', open: 44800, high: 45200, low: 44700, close: 45000, volume: 150.5 },
  { time: '2024-12-19T11:00:00Z', open: 45000, high: 45300, low: 44900, close: 45100, volume: 200.3 },
  { time: '2024-12-19T12:00:00Z', open: 45100, high: 45400, low: 45000, close: 45200, volume: 180.7 }
]

export const mockUserOrders = [
  {
    id: 'order-001',
    symbol: 'BTCUSDT',
    type: 'limit',
    side: 'buy',
    quantity: 0.1,
    price: 44500,
    status: 'pending',
    timestamp: '2024-12-19T10:30:00Z'
  }
]
```

### Test Utilities

```javascript
// src/test/utils/testHelpers.js
import { vi } from 'vitest'

export const createMockWebSocket = () => {
  const mockWs = {
    send: vi.fn(),
    close: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    readyState: WebSocket.OPEN
  }
  
  return mockWs
}

export const waitForElement = async (selector, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    
    const checkElement = () => {
      const element = document.querySelector(selector)
      if (element) {
        resolve(element)
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Element ${selector} not found within ${timeout}ms`))
      } else {
        setTimeout(checkElement, 100)
      }
    }
    
    checkElement()
  })
}

export const simulatePriceUpdate = (symbol, price) => {
  const event = new CustomEvent('priceUpdate', {
    detail: { symbol, price, timestamp: Date.now() }
  })
  window.dispatchEvent(event)
}

export const createTestContainer = (html = '') => {
  const container = document.createElement('div')
  container.innerHTML = html
  document.body.appendChild(container)
  return container
}

export const cleanupTestContainer = (container) => {
  if (container && container.parentNode) {
    container.parentNode.removeChild(container)
  }
}
```

## CI/CD Integration

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run src/test/unit",
    "test:integration": "vitest run src/test/integration",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest watch",
    "test:ci": "npm run test:unit && npm run test:integration && npm run test:e2e"
  }
}
```

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Install Playwright
      run: npx playwright install
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Generate coverage report
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
```

## Best Practices Summary

### Test Organization
- **Unit tests**: Focus on pure functions and isolated logic
- **Integration tests**: Test component interactions and data flow
- **E2E tests**: Validate critical user journeys

### Performance Considerations
- Keep unit tests under 100ms execution time
- Use fake timers for time-dependent tests
- Mock external dependencies appropriately
- Parallelize test execution where possible

### Maintenance Guidelines
- Use descriptive test names that explain the scenario
- Keep tests independent and atomic
- Regularly review and update test data
- Monitor test flakiness and fix unstable tests

### Quality Gates
- **Pre-commit**: All P0 unit tests must pass
- **CI Pipeline**: All P0 and P1 tests must pass
- **Pre-deployment**: Full test suite including E2E
- **Post-deployment**: Smoke tests and monitoring

---

**Next Steps:**
1. Set up test framework using provided configurations
2. Implement P0 unit tests first (critical path)
3. Add integration tests for component interactions
4. Create E2E tests for user journeys
5. Integrate with CI/CD pipeline
6. Set up test reporting and monitoring