import PriceChart from '../PriceChart.js';
import { mockDataService } from '../../services/mockDataService.js';
import { createChart } from 'lightweight-charts';

// Mock the lightweight-charts library
jest.mock('lightweight-charts');

// Mock the mockDataService
jest.mock('../../services/mockDataService.js', () => ({
  mockDataService: {
    getCurrentTradingPair: jest.fn(),
    getCandlestickData: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn()
  }
}));

describe('PriceChart', () => {
  let container;
  let priceChart;
  
  const mockTradingPair = {
    symbol: 'BTC/USDT',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    price: 43250.50,
    change24h: 2.45
  };
  
  const mockCandlestickData = [
    {
      time: 1640995200000,
      open: '43000.00',
      high: '43500.00',
      low: '42800.00',
      close: '43250.50',
      volume: '125.45'
    },
    {
      time: 1640995260000,
      open: '43250.50',
      high: '43400.00',
      low: '43100.00',
      close: '43300.00',
      volume: '98.32'
    }
  ];
  
  beforeEach(() => {
    // Create container element
    container = document.createElement('div');
    container.innerHTML = '<div id="chart-container" style="width: 800px; height: 400px;"></div>';
    document.body.appendChild(container);
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup default mock returns
    mockDataService.getCurrentTradingPair.mockReturnValue(mockTradingPair);
    // Let getCandlestickData use the real implementation to return actual data
    mockDataService.getCandlestickData.mockImplementation((symbol, interval, limit) => {
      // Use a smaller limit for tests to avoid too much data
      const testLimit = limit || 2;
      const basePrice = 50000;
      const data = [];
      const now = Date.now();
      
      for (let i = 0; i < testLimit; i++) {
        data.push({
          time: now - (testLimit - i) * 60000,
          open: (basePrice + Math.random() * 100).toFixed(2),
          high: (basePrice + Math.random() * 200).toFixed(2),
          low: (basePrice - Math.random() * 200).toFixed(2),
          close: (basePrice + Math.random() * 100).toFixed(2),
          volume: (Math.random() * 1000).toFixed(2)
        });
      }
      return data;
    });
    
    // Mock window resize event
    global.addEventListener = jest.fn();
    global.removeEventListener = jest.fn();
  });
  
  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    priceChart = null;
  });
  
  describe('Component Initialization', () => {
    test('should initialize with correct default values', () => {
      priceChart = new PriceChart(container);
      
      expect(priceChart.container).toBe(container);
      expect(priceChart.currentPair).toBe(mockTradingPair);
      expect(priceChart.selectedInterval).toBe('1m');
      expect(priceChart.candlestickData).toBeDefined();
      expect(priceChart.candlestickData.length).toBeGreaterThan(0);
    });
    
    test('should call init method during construction', () => {
      const initSpy = jest.spyOn(PriceChart.prototype, 'init');
      priceChart = new PriceChart(container);
      
      expect(initSpy).toHaveBeenCalledTimes(1);
      initSpy.mockRestore();
    });
    
    test('should call render, loadData, setupEventListeners, and initChart during init', () => {
      const renderSpy = jest.spyOn(PriceChart.prototype, 'render');
      const loadDataSpy = jest.spyOn(PriceChart.prototype, 'loadData');
      const setupEventListenersSpy = jest.spyOn(PriceChart.prototype, 'setupEventListeners');
      const initChartSpy = jest.spyOn(PriceChart.prototype, 'initChart');
      
      priceChart = new PriceChart(container);
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
      expect(loadDataSpy).toHaveBeenCalledTimes(1);
      expect(setupEventListenersSpy).toHaveBeenCalledTimes(1);
      expect(initChartSpy).toHaveBeenCalledTimes(1);
      
      renderSpy.mockRestore();
      loadDataSpy.mockRestore();
      setupEventListenersSpy.mockRestore();
      initChartSpy.mockRestore();
    });
  });
  
  describe('DOM Rendering', () => {
    test('should render chart header with trading pair information', () => {
      priceChart = new PriceChart(container);
      
      const pairSymbol = container.querySelector('#pair-symbol');
      const currentPrice = container.querySelector('#current-price');
      const priceChange = container.querySelector('#price-change');
      const high24h = container.querySelector('#high-24h');
      const low24h = container.querySelector('#low-24h');
      const volume24h = container.querySelector('#volume-24h');
      
      expect(pairSymbol).toBeTruthy();
      expect(currentPrice).toBeTruthy();
      expect(priceChange).toBeTruthy();
      expect(high24h).toBeTruthy();
      expect(low24h).toBeTruthy();
      expect(volume24h).toBeTruthy();
    });
    
    test('should render interval selection buttons', () => {
      priceChart = new PriceChart(container);
      
      const intervalBtns = container.querySelectorAll('.interval-btn');
      expect(intervalBtns.length).toBeGreaterThan(0);
      
      // Check for common intervals
      const intervals = Array.from(intervalBtns).map(btn => btn.dataset.interval);
      expect(intervals).toContain('1m');
      expect(intervals).toContain('5m');
      expect(intervals).toContain('1h');
      expect(intervals).toContain('1d');
    });
    
    test('should render chart container', () => {
      priceChart = new PriceChart(container);
      
      const chartContainer = container.querySelector('#chart-container');
      expect(chartContainer).toBeTruthy();
    });
  });
  
  describe('Data Loading', () => {
    test('should load current trading pair data', () => {
      priceChart = new PriceChart(container);
      
      expect(mockDataService.getCurrentTradingPair).toHaveBeenCalledTimes(1);
      expect(priceChart.currentPair).toEqual(mockTradingPair);
    });
    
    test('should load candlestick data for current pair and interval', () => {
      priceChart = new PriceChart(container);
      
      expect(mockDataService.getCandlestickData).toHaveBeenCalledWith(
        mockTradingPair.symbol,
        '1m'
      );
      expect(priceChart.candlestickData).toBeDefined();
      expect(priceChart.candlestickData.length).toBeGreaterThan(0);
      expect(priceChart.candlestickData[0]).toHaveProperty('time');
      expect(priceChart.candlestickData[0]).toHaveProperty('open');
      expect(priceChart.candlestickData[0]).toHaveProperty('high');
      expect(priceChart.candlestickData[0]).toHaveProperty('low');
      expect(priceChart.candlestickData[0]).toHaveProperty('close');
      expect(priceChart.candlestickData[0]).toHaveProperty('volume');
    });
    
    test('should update chart header with pair information', () => {
      priceChart = new PriceChart(container);
      
      const pairSymbol = container.querySelector('#pair-symbol');
      const currentPrice = container.querySelector('#current-price');
      const priceChange = container.querySelector('#price-change');
      
      expect(pairSymbol.textContent).toBe('BTC/USDT');
      expect(currentPrice.textContent).toBe('$43,250.50');
      expect(priceChange.textContent).toBe('+2.45%');
      expect(priceChange.className).toContain('text-accent-green');
    });
  });
  
  describe('Chart Initialization', () => {
    test('should create chart with correct configuration', () => {
      priceChart = new PriceChart(container);
      
      expect(createChart).toHaveBeenCalledWith(
        container.querySelector('#chart-container'),
        expect.objectContaining({
          width: expect.any(Number),
          height: expect.any(Number),
          layout: expect.objectContaining({
            background: { color: '#1a1d29' },
            textColor: '#d1d5db'
          })
        })
      );
    });
    
    test('should create candlestick and volume series', () => {
      priceChart = new PriceChart(container);
      
      expect(priceChart.chart.addSeries).toHaveBeenCalledTimes(2);
      expect(priceChart.chart.addSeries).toHaveBeenCalledWith(
        'CandlestickSeries',
        expect.objectContaining({
          upColor: '#10b981',
          downColor: '#ef4444'
        })
      );
      expect(priceChart.chart.addSeries).toHaveBeenCalledWith(
        'HistogramSeries',
        expect.objectContaining({
          color: '#6b7280',
          priceScaleId: 'volume'
        })
      );
    });
    
    test('should handle chart creation errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      priceChart = new PriceChart(container);
      priceChart.init(); // Initialize first to create the chart
      
      // Mock addSeries to throw an error
      priceChart.chart.addSeries.mockImplementationOnce(() => {
        throw new Error('Chart creation failed');
      });
      
      // Try to initialize chart again to trigger the error
      priceChart.initChart();
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
  
  describe('Interval Selection', () => {
    test('should handle interval button clicks', () => {
      priceChart = new PriceChart(container);
      
      const intervalBtn = container.querySelector('[data-interval="5m"]');
      expect(intervalBtn).toBeTruthy();
      
      // Mock loadData to track calls
      const loadDataSpy = jest.spyOn(priceChart, 'loadData');
      
      // Simulate click
      intervalBtn.click();
      
      expect(priceChart.selectedInterval).toBe('5m');
      expect(loadDataSpy).toHaveBeenCalledTimes(1);
      
      loadDataSpy.mockRestore();
    });
    
    test('should update active button styling on interval change', () => {
      priceChart = new PriceChart(container);
      
      const intervalBtns = container.querySelectorAll('.interval-btn');
      const fiveMinBtn = container.querySelector('[data-interval="5m"]');
      const oneMinBtn = container.querySelector('[data-interval="1m"]');
      
      // Initially 1m should be active
      expect(oneMinBtn.classList.contains('bg-primary-600')).toBe(true);
      
      // Click 5m button
      fiveMinBtn.click();
      
      // Check styling updates
      expect(fiveMinBtn.classList.contains('bg-primary-600')).toBe(true);
      expect(fiveMinBtn.classList.contains('text-white')).toBe(true);
      expect(oneMinBtn.classList.contains('bg-primary-600')).toBe(false);
      expect(oneMinBtn.classList.contains('text-text-secondary')).toBe(true);
    });
  });
  
  describe('Real-time Updates', () => {
    test('should subscribe to price updates', () => {
      priceChart = new PriceChart(container);
      
      expect(mockDataService.subscribe).toHaveBeenCalledWith(
        'priceUpdate',
        expect.any(Function)
      );
    });
    
    test('should update price display on price updates', () => {
      priceChart = new PriceChart(container);
      
      // Get the callback function for priceUpdate
      const priceUpdateCallback = mockDataService.subscribe.mock.calls
        .find(call => call[0] === 'priceUpdate')[1];
      
      // Simulate price update for current pair
      priceUpdateCallback([
        {
          symbol: 'BTC/USDT',
          price: 44000.00,
          change24h: 3.25
        }
      ]);
      
      // Check updated display
      const currentPrice = container.querySelector('#current-price');
      const priceChange = container.querySelector('#price-change');
      
      expect(currentPrice.textContent).toBe('$44,000.00');
      expect(priceChange.textContent).toBe('+3.25%');
      expect(currentPrice.className).toContain('text-accent-green');
    });
    
    test('should update candlestick data in real-time', () => {
      priceChart = new PriceChart(container);
      
      // Get the callback function for priceUpdate
      const priceUpdateCallback = mockDataService.subscribe.mock.calls
        .find(call => call[0] === 'priceUpdate')[1];
      
      // Simulate price update
      priceUpdateCallback([
        {
          symbol: 'BTC/USDT',
          price: 44000.00,
          change24h: 3.25
        }
      ]);
      
      // Check that candlestick series was updated
      expect(priceChart.candlestickSeries.update).toHaveBeenCalledWith(
        expect.objectContaining({
          close: 44000.00,
          high: expect.any(Number),
          low: expect.any(Number)
        })
      );
    });
    
    test('should not update display for different trading pairs', () => {
      priceChart = new PriceChart(container);
      
      // Store original values
      const originalPrice = container.querySelector('#current-price').textContent;
      const originalChange = container.querySelector('#price-change').textContent;
      
      // Get the callback function for priceUpdate
      const priceUpdateCallback = mockDataService.subscribe.mock.calls
        .find(call => call[0] === 'priceUpdate')[1];
      
      // Simulate price update for different pair
      priceUpdateCallback([
        {
          symbol: 'ETH/USDT',
          price: 3500.00,
          change24h: 2.15
        }
      ]);
      
      // Check display remains unchanged
      const currentPrice = container.querySelector('#current-price');
      const priceChange = container.querySelector('#price-change');
      
      expect(currentPrice.textContent).toBe(originalPrice);
      expect(priceChange.textContent).toBe(originalChange);
    });
  });
  
  describe('Trading Pair Changes', () => {
    test('should subscribe to trading pair changes', () => {
      priceChart = new PriceChart(container);
      
      expect(mockDataService.subscribe).toHaveBeenCalledWith(
        'tradingPairChanged',
        expect.any(Function)
      );
    });
    
    test('should reload data when trading pair changes', () => {
      priceChart = new PriceChart(container);
      
      const loadDataSpy = jest.spyOn(priceChart, 'loadData');
      
      // Get the callback function for tradingPairChanged
      const pairChangeCallback = mockDataService.subscribe.mock.calls
        .find(call => call[0] === 'tradingPairChanged')[1];
      
      const newPair = {
        symbol: 'ETH/USDT',
        baseAsset: 'ETH',
        quoteAsset: 'USDT',
        price: 3500.00,
        change24h: 2.15
      };
      
      // Mock getCurrentTradingPair to return the new pair
      mockDataService.getCurrentTradingPair.mockReturnValue(newPair);
      
      // Simulate trading pair change
      pairChangeCallback(newPair);
      
      expect(priceChart.currentPair).toEqual(newPair);
      expect(loadDataSpy).toHaveBeenCalledTimes(1);
      
      loadDataSpy.mockRestore();
    });
  });
  
  describe('Chart Data Updates', () => {
    test('should format and set candlestick data correctly', () => {
      priceChart = new PriceChart(container);
      
      expect(priceChart.candlestickSeries.setData).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            time: expect.any(Number),
            open: expect.any(Number),
            high: expect.any(Number),
            low: expect.any(Number),
            close: expect.any(Number)
          })
        ])
      );
    });
    
    test('should format and set volume data correctly', () => {
      priceChart = new PriceChart(container);
      priceChart.render();
      priceChart.init(); // This should trigger data loading and setData calls
      
      expect(priceChart.volumeSeries.setData).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            time: expect.any(Number),
            value: expect.any(Number),
            color: expect.any(String)
          })
        ])
      );
    });
    
    test('should fit chart content after data update', () => {
      priceChart = new PriceChart(container);
      priceChart.init(); // This should trigger loadData, initChart, and fitContent
      
      // Verify that the chart and series are properly initialized
      expect(priceChart.chart).toBeTruthy();
      expect(priceChart.candlestickSeries).toBeTruthy();
      expect(priceChart.candlestickData.length).toBeGreaterThan(0);
      
      // Clear previous calls and manually trigger updateChartData
      priceChart.chart.timeScale().fitContent.mockClear();
      priceChart.updateChartData();
      
      expect(priceChart.chart.timeScale().fitContent).toHaveBeenCalled();
    });
  });
  
  describe('Responsive Behavior', () => {
    test('should handle window resize events', () => {
      priceChart = new PriceChart(container);
      
      // Check that resize listener was added
      expect(global.addEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });
    
    test('should update chart width on resize', () => {
      priceChart = new PriceChart(container);
      priceChart.render(); // Render first to create DOM structure
      priceChart.init(); // Initialize to set up event listeners and create chart
      
      // Mock the chart container with clientWidth after chart is created
      const chartContainer = container.querySelector('#chart-container');
      Object.defineProperty(chartContainer, 'clientWidth', {
        value: 900,
        writable: true
      });
      
      // Get the resize callback
      const resizeCallback = global.addEventListener.mock.calls
        .find(call => call[0] === 'resize')[1];
      
      // Clear previous calls to applyOptions
      priceChart.chart.applyOptions.mockClear();
      
      // Simulate resize
      resizeCallback();
      
      // Should call chart applyOptions method with new width
      expect(priceChart.chart.applyOptions).toHaveBeenCalledWith({ width: 900 });
    });
  });
  
  describe('Utility Functions', () => {
    test('should format prices correctly', () => {
      priceChart = new PriceChart(container);
      
      expect(priceChart.formatPrice(43250.5)).toBe('43,250.50');
      expect(priceChart.formatPrice(1000)).toBe('1,000.00');
      expect(priceChart.formatPrice(0.5)).toBe('0.50');
    });
    
    test('should calculate chart width correctly', () => {
      const testContainer = document.createElement('div');
      const testPriceChart = new PriceChart(testContainer);
      testPriceChart.render(); // Render to create DOM structure
      
      // Mock clientWidth property on the created chart container
      const chartContainer = testContainer.querySelector('#chart-container');
      Object.defineProperty(chartContainer, 'clientWidth', {
        value: 800,
        writable: true
      });
      
      const width = testPriceChart.getChartWidth();
      expect(width).toBe(800); // Based on our mock container width
    });
    
    test('should return default width when chart container not found', () => {
      const testContainer = document.createElement('div');
      const testPriceChart = new PriceChart(testContainer);
      // Don't render, so no chart container exists
      
      const width = testPriceChart.getChartWidth();
      expect(width).toBe(800); // Default fallback
    });
    
    test('should return default width when clientWidth is 0', () => {
      const testContainer = document.createElement('div');
      const testPriceChart = new PriceChart(testContainer);
      testPriceChart.render(); // Render to create DOM structure
      
      // In JSDOM, clientWidth is 0 by default
      const width = testPriceChart.getChartWidth();
      expect(width).toBe(800); // Should fallback to default when clientWidth is 0
    });
  });
  
  describe('Error Handling', () => {
    test('should handle missing chart container gracefully', () => {
      const emptyContainer = document.createElement('div');
      
      expect(() => {
        priceChart = new PriceChart(emptyContainer);
      }).not.toThrow();
    });
    
    test('should handle null container', () => {
      expect(() => {
        priceChart = new PriceChart(null);
      }).toThrow();
    });
    
    test('should handle updateChartData when chart is not initialized', () => {
      priceChart = new PriceChart(container);
      priceChart.chart = null;
      
      expect(() => {
        priceChart.updateChartData();
      }).not.toThrow();
    });
  });
});