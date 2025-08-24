import TradingPairSelector from '../TradingPairSelector.js';
import { mockDataService } from '../../services/mockDataService.js';

// Mock the mockDataService
jest.mock('../../services/mockDataService.js', () => ({
  mockDataService: {
    getTradingPairs: jest.fn(),
    getCurrentTradingPair: jest.fn(),
    setCurrentTradingPair: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn()
  }
}));

describe('TradingPairSelector', () => {
  let container;
  let tradingPairSelector;
  let mockTradingPairs;
  let mockCurrentPair;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create container
    container = document.createElement('div');
    document.body.appendChild(container);
    
    // Mock trading pairs data
    mockTradingPairs = [
      {
        symbol: 'BTC/USDT',
        baseAsset: 'BTC',
        quoteAsset: 'USDT',
        price: 50000,
        priceChange24h: 2.5,
        volume24h: 1500000
      },
      {
        symbol: 'ETH/USDT',
        baseAsset: 'ETH',
        quoteAsset: 'USDT',
        price: 3000,
        priceChange24h: -1.2,
        volume24h: 800000
      },
      {
        symbol: 'BTC/ETH',
        baseAsset: 'BTC',
        quoteAsset: 'ETH',
        price: 16.67,
        priceChange24h: 0.8,
        volume24h: 500000
      }
    ];
    
    mockCurrentPair = mockTradingPairs[0];
    
    // Setup mock returns
    mockDataService.getTradingPairs.mockReturnValue(mockTradingPairs);
    mockDataService.getCurrentTradingPair.mockReturnValue(mockCurrentPair);
  });

  afterEach(() => {
    if (tradingPairSelector && typeof tradingPairSelector.destroy === 'function') {
      tradingPairSelector.destroy();
    }
    document.body.removeChild(container);
  });

  describe('Component Initialization', () => {
    test('should render the component structure correctly', () => {
      tradingPairSelector = new TradingPairSelector(container);
      
      // Check main structure
      expect(container.querySelector('.h-full.flex.flex-col.bg-primary-surface')).toBeTruthy();
      expect(container.querySelector('h3')).toBeTruthy();
      expect(container.querySelector('h3').textContent).toBe('Trading Pairs');
      
      // Check search input
      const searchInput = container.querySelector('#pair-search');
      expect(searchInput).toBeTruthy();
      expect(searchInput.placeholder).toBe('Search pairs...');
      
      // Check category buttons
      const categoryButtons = container.querySelectorAll('.category-btn');
      expect(categoryButtons).toHaveLength(4);
      expect(categoryButtons[0].textContent).toBe('All');
      expect(categoryButtons[1].textContent).toBe('BTC');
      expect(categoryButtons[2].textContent).toBe('ETH');
      expect(categoryButtons[3].textContent).toBe('USDT');
      
      // Check pairs list container
      expect(container.querySelector('#pairs-list')).toBeTruthy();
    });

    test('should load data on initialization', () => {
      tradingPairSelector = new TradingPairSelector(container);
      
      expect(mockDataService.getTradingPairs).toHaveBeenCalled();
      expect(mockDataService.getCurrentTradingPair).toHaveBeenCalled();
    });

    test('should subscribe to price updates', () => {
      tradingPairSelector = new TradingPairSelector(container);
      
      expect(mockDataService.subscribe).toHaveBeenCalledWith('priceUpdate', expect.any(Function));
    });

    test('should render trading pairs list', () => {
      tradingPairSelector = new TradingPairSelector(container);
      
      const pairItems = container.querySelectorAll('.pair-item');
      expect(pairItems).toHaveLength(3);
      
      // Check first pair (BTC/USDT)
      const btcPair = container.querySelector('[data-symbol="BTC/USDT"]');
      expect(btcPair).toBeTruthy();
      expect(btcPair.textContent).toContain('BTC');
      expect(btcPair.textContent).toContain('/USDT');
      expect(btcPair.textContent).toContain('$50000.00');
      expect(btcPair.textContent).toContain('+2.50%');
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      tradingPairSelector = new TradingPairSelector(container);
    });

    test('should filter pairs by search term', () => {
      const searchInput = container.querySelector('#pair-search');
      
      // Search for 'BTC'
      searchInput.value = 'BTC';
      searchInput.dispatchEvent(new Event('input'));
      
      const pairItems = container.querySelectorAll('.pair-item');
      expect(pairItems).toHaveLength(2); // BTC/USDT and BTC/ETH
      
      expect(container.querySelector('[data-symbol="BTC/USDT"]')).toBeTruthy();
      expect(container.querySelector('[data-symbol="BTC/ETH"]')).toBeTruthy();
      expect(container.querySelector('[data-symbol="ETH/USDT"]')).toBeFalsy();
    });

    test('should filter pairs by base asset search', () => {
      const searchInput = container.querySelector('#pair-search');
      
      // Search for 'ETH'
      searchInput.value = 'ETH';
      searchInput.dispatchEvent(new Event('input'));
      
      const pairItems = container.querySelectorAll('.pair-item');
      expect(pairItems).toHaveLength(2); // ETH/USDT and BTC/ETH
    });

    test('should show no results for non-matching search', () => {
      const searchInput = container.querySelector('#pair-search');
      
      // Search for non-existent pair
      searchInput.value = 'XYZ';
      searchInput.dispatchEvent(new Event('input'));
      
      const pairItems = container.querySelectorAll('.pair-item');
      expect(pairItems).toHaveLength(0);
    });

    test('should be case insensitive', () => {
      const searchInput = container.querySelector('#pair-search');
      
      // Search with lowercase
      searchInput.value = 'btc';
      searchInput.dispatchEvent(new Event('input'));
      
      const pairItems = container.querySelectorAll('.pair-item');
      expect(pairItems).toHaveLength(2);
    });
  });

  describe('Category Filtering', () => {
    beforeEach(() => {
      tradingPairSelector = new TradingPairSelector(container);
    });

    test('should show all pairs by default', () => {
      const pairItems = container.querySelectorAll('.pair-item');
      expect(pairItems).toHaveLength(3);
      
      const allButton = container.querySelector('[data-category="all"]');
      expect(allButton.classList.contains('active')).toBe(true);
    });

    test('should filter by USDT category', () => {
      const usdtButton = container.querySelector('[data-category="usdt"]');
      usdtButton.click();
      
      const pairItems = container.querySelectorAll('.pair-item');
      expect(pairItems).toHaveLength(2); // BTC/USDT and ETH/USDT
      
      expect(container.querySelector('[data-symbol="BTC/USDT"]')).toBeTruthy();
      expect(container.querySelector('[data-symbol="ETH/USDT"]')).toBeTruthy();
      expect(container.querySelector('[data-symbol="BTC/ETH"]')).toBeFalsy();
    });

    test('should filter by ETH category', () => {
      const ethButton = container.querySelector('[data-category="eth"]');
      ethButton.click();
      
      const pairItems = container.querySelectorAll('.pair-item');
      expect(pairItems).toHaveLength(1); // BTC/ETH
      
      expect(container.querySelector('[data-symbol="BTC/ETH"]')).toBeTruthy();
    });

    test('should update active state when switching categories', () => {
      const allButton = container.querySelector('[data-category="all"]');
      const btcButton = container.querySelector('[data-category="btc"]');
      
      // Initially 'All' should be active
      expect(allButton.classList.contains('active')).toBe(true);
      expect(btcButton.classList.contains('active')).toBe(false);
      
      // Click BTC category
      btcButton.click();
      
      expect(allButton.classList.contains('active')).toBe(false);
      expect(btcButton.classList.contains('active')).toBe(true);
    });
  });

  describe('Pair Selection', () => {
    beforeEach(() => {
      tradingPairSelector = new TradingPairSelector(container);
    });

    test('should select pair when clicked', () => {
      const ethPair = container.querySelector('[data-symbol="ETH/USDT"]');
      ethPair.click();
      
      expect(mockDataService.setCurrentTradingPair).toHaveBeenCalledWith(mockTradingPairs[1]);
    });

    test('should update active state after selection', () => {
      const ethPair = container.querySelector('[data-symbol="ETH/USDT"]');
      
      // Mock the current pair change
      tradingPairSelector.currentPair = mockTradingPairs[1];
      tradingPairSelector.renderPairsList();
      
      const activePair = container.querySelector('.pair-item.active');
      expect(activePair.dataset.symbol).toBe('ETH/USDT');
    });

    test('should handle selection of non-existent pair gracefully', () => {
      tradingPairSelector.selectPair('INVALID/PAIR');
      
      expect(mockDataService.setCurrentTradingPair).not.toHaveBeenCalled();
    });
  });

  describe('Price Updates', () => {
    beforeEach(() => {
      tradingPairSelector = new TradingPairSelector(container);
    });

    test('should update pair price display', () => {
      const priceData = {
        symbol: 'BTC/USDT',
        price: 51000,
        change24h: 3.2
      };
      
      tradingPairSelector.updatePairPrices(priceData);
      
      const btcPair = container.querySelector('[data-symbol="BTC/USDT"]');
      const priceElement = btcPair.querySelector('.font-mono');
      const changeElement = btcPair.querySelector('.text-xs.font-medium');
      
      expect(priceElement.textContent).toBe('$51000.00');
      expect(changeElement.textContent).toBe('+3.20%');
      expect(changeElement.classList.contains('text-success')).toBe(true);
    });

    test('should handle negative price changes', () => {
      const priceData = {
        symbol: 'ETH/USDT',
        price: 2950,
        change24h: -1.8
      };
      
      tradingPairSelector.updatePairPrices(priceData);
      
      const ethPair = container.querySelector('[data-symbol="ETH/USDT"]');
      const changeElement = ethPair.querySelector('.text-xs.font-medium');
      
      expect(changeElement.textContent).toBe('-1.80%');
      expect(changeElement.classList.contains('text-danger')).toBe(true);
    });

    test('should handle price updates for non-existent pairs', () => {
      const priceData = {
        symbol: 'INVALID/PAIR',
        price: 100,
        change24h: 5.0
      };
      
      // Should not throw error
      expect(() => {
        tradingPairSelector.updatePairPrices(priceData);
      }).not.toThrow();
    });
  });

  describe('Volume Formatting', () => {
    beforeEach(() => {
      tradingPairSelector = new TradingPairSelector(container);
    });

    test('should format large volumes with M suffix', () => {
      const result = tradingPairSelector.formatVolume(1500000);
      expect(result).toBe('1.5M');
    });

    test('should format medium volumes with K suffix', () => {
      const result = tradingPairSelector.formatVolume(1500);
      expect(result).toBe('1.5K');
    });

    test('should format small volumes as decimal', () => {
      const result = tradingPairSelector.formatVolume(150);
      expect(result).toBe('150.00');
    });

    test('should handle invalid volume values', () => {
      expect(tradingPairSelector.formatVolume(null)).toBe('0.00');
      expect(tradingPairSelector.formatVolume(undefined)).toBe('0.00');
      expect(tradingPairSelector.formatVolume('invalid')).toBe('0.00');
    });
  });

  describe('Component Cleanup', () => {
    test('should unsubscribe from price updates on destroy', () => {
      tradingPairSelector = new TradingPairSelector(container);
      
      tradingPairSelector.destroy();
      
      expect(mockDataService.unsubscribe).toHaveBeenCalledWith('priceUpdate');
    });
  });

  describe('Sorting and Display', () => {
    beforeEach(() => {
      tradingPairSelector = new TradingPairSelector(container);
    });

    test('should sort pairs by volume in descending order', () => {
      const pairItems = container.querySelectorAll('.pair-item');
      
      // First should be BTC/USDT (highest volume: 1,500,000)
      expect(pairItems[0].dataset.symbol).toBe('BTC/USDT');
      // Second should be ETH/USDT (volume: 800,000)
      expect(pairItems[1].dataset.symbol).toBe('ETH/USDT');
      // Third should be BTC/ETH (volume: 500,000)
      expect(pairItems[2].dataset.symbol).toBe('BTC/ETH');
    });

    test('should display volume in formatted form', () => {
      const btcPair = container.querySelector('[data-symbol="BTC/USDT"]');
      expect(btcPair.textContent).toContain('Vol: 1.5M');
      
      const ethPair = container.querySelector('[data-symbol="ETH/USDT"]');
      expect(ethPair.textContent).toContain('Vol: 800.0K');
    });

    test('should display price with appropriate decimal places', () => {
      const btcPair = container.querySelector('[data-symbol="BTC/USDT"]');
      expect(btcPair.textContent).toContain('$50000.00'); // Large price, 2 decimals
      
      const btcEthPair = container.querySelector('[data-symbol="BTC/ETH"]');
      expect(btcEthPair.textContent).toContain('$16.67'); // Small price, 2 decimals
    });
  });
});