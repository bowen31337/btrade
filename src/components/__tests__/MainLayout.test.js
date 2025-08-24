import MainLayout from '../MainLayout.js';
import { mockDataService } from '../../services/mockDataService.js';

// Mock all the component dependencies
jest.mock('../NavigationHeader.js', () => {
  return jest.fn().mockImplementation(() => ({
    init: jest.fn()
  }));
});

jest.mock('../AssetListPanel.js', () => {
  return jest.fn().mockImplementation(() => ({
    init: jest.fn()
  }));
});

jest.mock('../PriceChartPanel.js', () => {
  return jest.fn().mockImplementation(() => ({
    init: jest.fn()
  }));
});

jest.mock('../OrderBookPanel.js', () => {
  return jest.fn().mockImplementation(() => ({
    init: jest.fn()
  }));
});

jest.mock('../MarketTradesPanel.js', () => {
  return jest.fn().mockImplementation(() => ({
    init: jest.fn()
  }));
});

jest.mock('../OrderForm.js', () => ({
  OrderForm: jest.fn().mockImplementation(() => ({
    init: jest.fn()
  }))
}));

jest.mock('../UserOrdersPanel.js', () => {
  return jest.fn().mockImplementation(() => ({
    init: jest.fn()
  }));
});

// Mock the data service
jest.mock('../../services/mockDataService.js', () => ({
  mockDataService: {
    getCurrentTradingPair: jest.fn(() => ({
      symbol: 'BTC/USDT',
      baseAsset: 'BTC',
      quoteAsset: 'USDT',
      price: 50000,
      change24h: 2.5
    })),
    startPriceUpdates: jest.fn(),
    subscribe: jest.fn(),
    setCurrentTradingPair: jest.fn()
  }
}));

describe('MainLayout Component', () => {
  let mainLayout;
  let mockApp;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Create app container
    mockApp = document.createElement('div');
    mockApp.id = 'app';
    document.body.appendChild(mockApp);
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock ResizeObserver
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    }));
  });

  afterEach(() => {
    if (mainLayout && mainLayout.navigationHeaderObserver) {
      mainLayout.navigationHeaderObserver.disconnect();
    }
  });

  describe('Component Initialization', () => {
    test('should initialize MainLayout and render main structure', () => {
      mainLayout = new MainLayout();
      
      // Check if main container is created
      const mainContainer = document.querySelector('.min-h-screen');
      expect(mainContainer).toBeTruthy();
      
      // Check if navigation header container exists
      const navContainer = document.querySelector('#navigation-header-container');
      expect(navContainer).toBeTruthy();
      
      // Check if main content grid exists
      const mainGrid = document.querySelector('#main-content-grid');
      expect(mainGrid).toBeTruthy();
      expect(mainGrid.classList.contains('grid')).toBe(true);
    });

    test('should initialize all component containers', () => {
      mainLayout = new MainLayout();
      
      // Check all component containers exist
      expect(document.querySelector('#trading-pair-selector-container')).toBeTruthy();
      expect(document.querySelector('#price-chart-container')).toBeTruthy();
      expect(document.querySelector('#order-form-container')).toBeTruthy();
      expect(document.querySelector('#order-book-container')).toBeTruthy();
      expect(document.querySelector('#market-trades-container')).toBeTruthy();
      expect(document.querySelector('#user-orders-container')).toBeTruthy();
    });

    test('should display current trading pair information', () => {
      mainLayout = new MainLayout();
      
      // Check current pair display
      const pairSymbol = document.querySelector('#current-pair-symbol');
      const currentPrice = document.querySelector('#current-price');
      const currentChange = document.querySelector('#current-change');
      
      expect(pairSymbol.textContent).toBe('BTC/USDT');
      expect(currentPrice.textContent).toBe('$50,000');
      expect(currentChange.textContent.trim()).toBe('+2.50%');
      expect(currentChange.classList.contains('text-accent-buy')).toBe(true);
    });

    test('should call mockDataService.startPriceUpdates on initialization', () => {
      mainLayout = new MainLayout();
      
      expect(mockDataService.startPriceUpdates).toHaveBeenCalled();
    });
  });

  describe('Trading Pair Switching', () => {
    beforeEach(() => {
      mainLayout = new MainLayout();
      
      // Create mock trading pair elements
      const pairElement1 = document.createElement('div');
      pairElement1.className = 'trading-pair';
      pairElement1.dataset.symbol = 'BTC/USDT';
      document.body.appendChild(pairElement1);
      
      const pairElement2 = document.createElement('div');
      pairElement2.className = 'trading-pair';
      pairElement2.dataset.symbol = 'ETH/USDT';
      document.body.appendChild(pairElement2);
    });

    test('should switch trading pair when pair element is clicked', () => {
      const ethPairElement = document.querySelector('[data-symbol="ETH/USDT"]');
      
      // Simulate click event
      const clickEvent = new Event('click', { bubbles: true });
      ethPairElement.dispatchEvent(clickEvent);
      
      expect(mockDataService.setCurrentTradingPair).toHaveBeenCalledWith('ETH/USDT');
    });

    test('should update active state when switching trading pair', () => {
      const btcPairElement = document.querySelector('[data-symbol="BTC/USDT"]');
      const ethPairElement = document.querySelector('[data-symbol="ETH/USDT"]');
      
      // Initially set BTC as active
      btcPairElement.classList.add('bg-primary-bg');
      
      // Switch to ETH
      mainLayout.switchTradingPair('ETH/USDT');
      
      expect(btcPairElement.classList.contains('bg-primary-bg')).toBe(false);
      expect(ethPairElement.classList.contains('bg-primary-bg')).toBe(true);
    });
  });

  describe('Price Updates', () => {
    beforeEach(() => {
      mainLayout = new MainLayout();
    });

    test('should update current pair display when updateCurrentPairDisplay is called', () => {
      // Update current pair data
      mainLayout.currentPair = {
        symbol: 'ETH/USDT',
        price: 3000,
        change24h: -1.5
      };
      
      mainLayout.updateCurrentPairDisplay();
      
      const pairSymbol = document.querySelector('#current-pair-symbol');
      const currentPrice = document.querySelector('#current-price');
      const currentChange = document.querySelector('#current-change');
      
      expect(pairSymbol.textContent).toBe('ETH/USDT');
      expect(currentPrice.textContent).toBe('$3,000');
      expect(currentChange.textContent).toBe('-1.50%');
      expect(currentChange.classList.contains('text-accent-sell')).toBe(true);
    });

    test('should update prices for multiple trading pairs', () => {
      // Create mock pair elements with price displays
      const btcPairElement = document.createElement('div');
      btcPairElement.dataset.symbol = 'BTC/USDT';
      const btcPriceElement = document.createElement('span');
      btcPriceElement.className = 'text-sm text-text-primary';
      const btcChangeElement = document.createElement('span');
      btcChangeElement.className = 'text-xs';
      btcPairElement.appendChild(btcPriceElement);
      btcPairElement.appendChild(btcChangeElement);
      document.body.appendChild(btcPairElement);
      
      const mockPairs = [
        { symbol: 'BTC/USDT', price: 51000, change24h: 3.2 }
      ];
      
      mainLayout.updatePrices(mockPairs);
      
      expect(btcPriceElement.textContent).toBe('$51,000');
      expect(btcChangeElement.textContent).toBe('+3.20%');
      expect(btcChangeElement.classList.contains('text-accent-buy')).toBe(true);
    });
  });

  describe('Event Subscriptions', () => {
    test('should subscribe to price updates and trading pair changes', () => {
      mainLayout = new MainLayout();
      
      expect(mockDataService.subscribe).toHaveBeenCalledWith('priceUpdate', expect.any(Function));
      expect(mockDataService.subscribe).toHaveBeenCalledWith('tradingPairChanged', expect.any(Function));
    });
  });

  describe('ResizeObserver Integration', () => {
    test('should set up ResizeObserver for navigation header', () => {
      mainLayout = new MainLayout();
      
      // The ResizeObserver should be called during initialization
      expect(global.ResizeObserver).toHaveBeenCalled();
      
      // Check that the observer was created and assigned
      const navContainer = document.querySelector('#navigation-header-container');
      const mainGrid = document.querySelector('#main-content-grid');
      expect(navContainer).toBeTruthy();
      expect(mainGrid).toBeTruthy();
    });
  });
});