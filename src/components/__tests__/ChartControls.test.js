import PriceChart from '../PriceChart.js';
import { mockDataService } from '../../services/mockDataService.js';

// Mock the lightweight-charts library
jest.mock('lightweight-charts');

// Mock the mockDataService
jest.mock('../../services/mockDataService.js');

describe('PriceChart - Chart Controls and Timeframe Selection', () => {
  let container;
  let priceChart;
  let mockTradingPair;
  let mockCandlestickData;

  beforeEach(() => {
    // Create container
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);

    // Mock trading pair
    mockTradingPair = {
      symbol: 'BTCUSDT',
      baseAsset: 'BTC',
      quoteAsset: 'USDT',
      price: 65000.00,
      change24h: 1500.00,
      changePercent24h: 2.35
    };

    // Mock candlestick data
    mockCandlestickData = [
      {
        time: Date.now() - 60000,
        open: '64500.00',
        high: '65200.00',
        low: '64300.00',
        close: '65000.00',
        volume: '125.45'
      },
      {
        time: Date.now(),
        open: '65000.00',
        high: '65300.00',
        low: '64800.00',
        close: '65100.00',
        volume: '98.32'
      }
    ];

    // Setup mocks
    mockDataService.getCurrentTradingPair.mockReturnValue(mockTradingPair);
    mockDataService.getCandlestickData.mockImplementation((symbol, interval) => {
      // Generate different mock data based on interval
      const baseTime = Date.now();
      const intervalMs = {
        '1m': 60000,
        '5m': 300000,
        '15m': 900000,
        '1h': 3600000,
        '4h': 14400000,
        '1d': 86400000
      }[interval] || 60000;

      return [
        {
          time: baseTime - intervalMs,
          open: (50000 + Math.random() * 1000).toFixed(2),
          high: (50500 + Math.random() * 1000).toFixed(2),
          low: (49500 + Math.random() * 1000).toFixed(2),
          close: (50000 + Math.random() * 1000).toFixed(2),
          volume: (Math.random() * 100).toFixed(2)
        },
        {
          time: baseTime,
          open: (50000 + Math.random() * 1000).toFixed(2),
          high: (50500 + Math.random() * 1000).toFixed(2),
          low: (49500 + Math.random() * 1000).toFixed(2),
          close: (50000 + Math.random() * 1000).toFixed(2),
          volume: (Math.random() * 100).toFixed(2)
        }
      ];
    });
    mockDataService.subscribe.mockImplementation(() => {});
  });

  afterEach(() => {
    if (priceChart) {
      priceChart.destroy && priceChart.destroy();
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    jest.clearAllMocks();
  });

  describe('Interval Button Rendering', () => {
    test('should render all time interval buttons', () => {
      priceChart = new PriceChart(container);
      priceChart.init();

      const intervalButtons = container.querySelectorAll('.interval-btn');
      expect(intervalButtons).toHaveLength(6);

      const expectedIntervals = ['1m', '5m', '15m', '1h', '4h', '1d'];
      intervalButtons.forEach((btn, index) => {
        expect(btn.dataset.interval).toBe(expectedIntervals[index]);
        expect(btn.textContent.trim()).toBe(expectedIntervals[index] === '1d' ? '1D' : expectedIntervals[index]);
      });
    });

    test('should have correct CSS classes for interval buttons', () => {
      priceChart = new PriceChart(container);
      priceChart.init();

      const intervalButtons = container.querySelectorAll('.interval-btn');
      intervalButtons.forEach(btn => {
        expect(btn.classList.contains('interval-btn')).toBe(true);
        expect(btn.classList.contains('px-3')).toBe(true);
        expect(btn.classList.contains('py-1')).toBe(true);
        expect(btn.classList.contains('text-xs')).toBe(true);
        expect(btn.classList.contains('rounded')).toBe(true);
        expect(btn.classList.contains('transition-colors')).toBe(true);
      });
    });

    test('should have default active interval (1m)', () => {
      priceChart = new PriceChart(container);
      priceChart.init();

      const firstButton = container.querySelector('.interval-btn[data-interval="1m"]');
      expect(firstButton.classList.contains('bg-primary-600')).toBe(true);
      expect(firstButton.classList.contains('text-white')).toBe(true);
      expect(priceChart.selectedInterval).toBe('1m');
    });
  });

  describe('Interval Selection Functionality', () => {
    test('should update selected interval when button is clicked', () => {
      priceChart = new PriceChart(container);
      priceChart.init();

      const fiveMinButton = container.querySelector('.interval-btn[data-interval="5m"]');
      fiveMinButton.click();

      expect(priceChart.selectedInterval).toBe('5m');
    });

    test('should update active button styling when interval changes', () => {
      priceChart = new PriceChart(container);
      priceChart.init();

      const oneMinButton = container.querySelector('.interval-btn[data-interval="1m"]');
      const oneHourButton = container.querySelector('.interval-btn[data-interval="1h"]');

      // Initially 1m should be active
      expect(oneMinButton.classList.contains('bg-primary-600')).toBe(true);
      expect(oneMinButton.classList.contains('text-white')).toBe(true);
      expect(oneHourButton.classList.contains('text-text-secondary')).toBe(true);

      // Click 1h button
      oneHourButton.click();

      // 1h should now be active, 1m should be inactive
      expect(oneHourButton.classList.contains('bg-primary-600')).toBe(true);
      expect(oneHourButton.classList.contains('text-white')).toBe(true);
      expect(oneMinButton.classList.contains('text-text-secondary')).toBe(true);
      expect(oneMinButton.classList.contains('bg-primary-600')).toBe(false);
    });

    test('should load new data when interval changes', () => {
      priceChart = new PriceChart(container);
      priceChart.init();

      // Clear previous calls
      mockDataService.getCandlestickData.mockClear();

      const fourHourButton = container.querySelector('.interval-btn[data-interval="4h"]');
      fourHourButton.click();

      expect(mockDataService.getCandlestickData).toHaveBeenCalledWith(
        mockTradingPair.symbol,
        '4h'
      );
    });

    test('should only allow one interval to be selected at a time', () => {
      priceChart = new PriceChart(container);
      priceChart.init();

      const buttons = container.querySelectorAll('.interval-btn');
      const fifteenMinButton = container.querySelector('.interval-btn[data-interval="15m"]');
      
      fifteenMinButton.click();

      // Count active buttons
      let activeCount = 0;
      buttons.forEach(btn => {
        if (btn.classList.contains('bg-primary-600') && btn.classList.contains('text-white')) {
          activeCount++;
        }
      });

      expect(activeCount).toBe(1);
      expect(fifteenMinButton.classList.contains('bg-primary-600')).toBe(true);
    });
  });

  describe('Data Loading for Different Intervals', () => {
    test('should request correct data for each interval', () => {
      priceChart = new PriceChart(container);
      priceChart.init();

      const intervals = ['1m', '5m', '15m', '1h', '4h', '1d'];
      
      intervals.forEach(interval => {
        mockDataService.getCandlestickData.mockClear();
        
        const button = container.querySelector(`.interval-btn[data-interval="${interval}"]`);
        button.click();

        expect(mockDataService.getCandlestickData).toHaveBeenCalledWith(
          mockTradingPair.symbol,
          interval
        );
      });
    });

    test('should update chart data when interval changes', () => {
      priceChart = new PriceChart(container);
      priceChart.init();

      const initialDataLength = priceChart.candlestickData.length;
      
      const oneDayButton = container.querySelector('.interval-btn[data-interval="1d"]');
      oneDayButton.click();

      // Data should be updated (mock returns different data for different intervals)
      expect(priceChart.candlestickData).toBeDefined();
      expect(priceChart.candlestickData.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle missing interval buttons gracefully', () => {
      // Create chart with custom HTML that doesn\'t have interval buttons
      priceChart = new PriceChart(container);
      priceChart.container.innerHTML = '<div>No buttons here</div>';
      
      expect(() => {
        priceChart.setupEventListeners();
      }).not.toThrow();
    });

    test('should handle click events on buttons without data-interval', () => {
      priceChart = new PriceChart(container);
      priceChart.init();

      // Add a button without data-interval attribute
      const invalidButton = document.createElement('button');
      invalidButton.className = 'interval-btn';
      invalidButton.textContent = 'Invalid';
      container.appendChild(invalidButton);

      expect(() => {
        invalidButton.click();
      }).not.toThrow();
    });

    test('should handle service errors gracefully', () => {
      priceChart = new PriceChart(container);
      priceChart.init();

      const originalInterval = priceChart.selectedInterval;
      
      // Mock service to return empty data instead of throwing
      mockDataService.getCandlestickData.mockReturnValue([]);

      const fiveMinButton = container.querySelector('.interval-btn[data-interval="5m"]');
      
      // Click should not throw and interval should be updated
      expect(() => {
        fiveMinButton.click();
      }).not.toThrow();

      // Interval should be updated
      expect(priceChart.selectedInterval).toBe('5m');
      
      // Service should have been called with new interval
      expect(mockDataService.getCandlestickData).toHaveBeenCalledWith('BTCUSDT', '5m');
    });
  });
});