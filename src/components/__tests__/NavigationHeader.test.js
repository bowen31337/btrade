import NavigationHeader from '../NavigationHeader.js';
import { mockDataService } from '../../services/mockDataService.js';

// Mock the data service
jest.mock('../../services/mockDataService.js', () => ({
  mockDataService: {
    getCurrentTradingPair: jest.fn(),
    getCurrentPrice: jest.fn(),
    subscribe: jest.fn(),
    startPriceUpdates: jest.fn()
  }
}));

describe('NavigationHeader Component', () => {
  let container;
  let navigationHeader;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create a container for the component
    container = document.createElement('div');
    document.body.appendChild(container);
    
    // Mock data service responses
    mockDataService.getCurrentTradingPair.mockReturnValue('BTC/USDT');
    mockDataService.getCurrentPrice.mockReturnValue({
      price: 50000,
      change24h: 2.45
    });
  });

  afterEach(() => {
    if (navigationHeader) {
      navigationHeader = null;
    }
    document.body.removeChild(container);
  });

  describe('Component Initialization', () => {
    test('should initialize NavigationHeader and render header structure', () => {
      navigationHeader = new NavigationHeader(container);
      
      // Check main header structure
      const header = container.querySelector('header');
      expect(header).toBeTruthy();
      expect(header.classList.contains('bg-primary-surface')).toBe(true);
      
      // Check logo and brand
      const logo = container.querySelector('.w-8.h-8');
      const brandName = container.querySelector('h1');
      expect(logo).toBeTruthy();
      expect(brandName.textContent).toBe('BTrade');
    });

    test('should display trading pair information elements', () => {
      navigationHeader = new NavigationHeader(container);
      
      // Check trading pair elements exist
      const currentPair = container.querySelector('#current-pair');
      const currentPrice = container.querySelector('#current-price');
      const priceChange = container.querySelector('#price-change');
      
      expect(currentPair).toBeTruthy();
      expect(currentPrice).toBeTruthy();
      expect(priceChange).toBeTruthy();
    });

    test('should render navigation menu items', () => {
      navigationHeader = new NavigationHeader(container);
      
      // Check desktop navigation
      const navLinks = container.querySelectorAll('nav a');
      expect(navLinks.length).toBeGreaterThan(0);
      
      // Check for specific navigation items
      const tradeLink = Array.from(navLinks).find(link => link.textContent === 'Trade');
      const marketsLink = Array.from(navLinks).find(link => link.textContent === 'Markets');
      const portfolioLink = Array.from(navLinks).find(link => link.textContent === 'Portfolio');
      const historyLink = Array.from(navLinks).find(link => link.textContent === 'History');
      
      expect(tradeLink).toBeTruthy();
      expect(marketsLink).toBeTruthy();
      expect(portfolioLink).toBeTruthy();
      expect(historyLink).toBeTruthy();
    });

    test('should render user action buttons', () => {
      navigationHeader = new NavigationHeader(container);
      
      // Check Connect Wallet button
      const connectWalletButton = container.querySelector('button.bg-accent-warning');
      expect(connectWalletButton).toBeTruthy();
      expect(connectWalletButton.textContent.trim()).toBe('Connect Wallet');
      
      // Check mobile menu button
      const mobileMenuButton = container.querySelector('#mobile-menu-button');
      expect(mobileMenuButton).toBeTruthy();
    });
  });

  describe('Data Loading and Display', () => {
    test('should load and display current trading pair data', () => {
      navigationHeader = new NavigationHeader(container);
      
      // Verify data service calls
      expect(mockDataService.getCurrentTradingPair).toHaveBeenCalled();
      expect(mockDataService.getCurrentPrice).toHaveBeenCalledWith('BTC/USDT');
      
      // Check display elements
      const currentPair = container.querySelector('#current-pair');
      const currentPrice = container.querySelector('#current-price');
      const priceChange = container.querySelector('#price-change');
      
      expect(currentPair.textContent).toBe('BTC/USDT');
      expect(currentPrice.textContent).toBe('$50,000.00');
      expect(priceChange.textContent).toBe('+2.45%');
      expect(priceChange.classList.contains('bg-success-bg')).toBe(true);
    });

    test('should display negative price change correctly', () => {
      mockDataService.getCurrentPrice.mockReturnValue({
        price: 48000,
        change24h: -3.25
      });
      
      navigationHeader = new NavigationHeader(container);
      
      const priceChange = container.querySelector('#price-change');
      expect(priceChange.textContent).toBe('-3.25%');
      expect(priceChange.classList.contains('bg-danger-bg')).toBe(true);
      expect(priceChange.classList.contains('text-danger-text')).toBe(true);
    });

    test('should handle missing price data gracefully', () => {
      mockDataService.getCurrentPrice.mockReturnValue(null);
      
      navigationHeader = new NavigationHeader(container);
      
      // Should not throw errors and elements should exist
      const currentPair = container.querySelector('#current-pair');
      const currentPrice = container.querySelector('#current-price');
      const priceChange = container.querySelector('#price-change');
      
      expect(currentPair).toBeTruthy();
      expect(currentPrice).toBeTruthy();
      expect(priceChange).toBeTruthy();
    });
  });

  describe('Event Subscriptions', () => {
    test('should subscribe to trading pair changes and price updates', () => {
      navigationHeader = new NavigationHeader(container);
      
      // Verify subscriptions were set up
      expect(mockDataService.subscribe).toHaveBeenCalledWith('tradingPairChanged', expect.any(Function));
      expect(mockDataService.subscribe).toHaveBeenCalledWith('priceUpdate', expect.any(Function));
    });

    test('should update display when trading pair changes', () => {
      navigationHeader = new NavigationHeader(container);
      
      // Get the callback function for tradingPairChanged
      const tradingPairCallback = mockDataService.subscribe.mock.calls
        .find(call => call[0] === 'tradingPairChanged')[1];
      
      // Mock new price data for the new pair
      mockDataService.getCurrentPrice.mockReturnValue({
        price: 3000,
        change24h: 1.85
      });
      
      // Simulate trading pair change
      tradingPairCallback({ pair: 'ETH/USDT' });
      
      // Check updated display
      const currentPair = container.querySelector('#current-pair');
      const currentPrice = container.querySelector('#current-price');
      const priceChange = container.querySelector('#price-change');
      
      expect(currentPair.textContent).toBe('ETH/USDT');
      expect(currentPrice.textContent).toBe('$3,000.00');
      expect(priceChange.textContent).toBe('+1.85%');
    });

    test('should update display when price updates for current pair', () => {
      navigationHeader = new NavigationHeader(container);
      
      // Get the callback function for priceUpdate
      const priceUpdateCallback = mockDataService.subscribe.mock.calls
        .find(call => call[0] === 'priceUpdate')[1];
      
      // Simulate price update for current pair
      priceUpdateCallback({
        symbol: 'BTC/USDT',
        price: 51000,
        change24h: 3.75
      });
      
      // Check updated display
      const currentPrice = container.querySelector('#current-price');
      const priceChange = container.querySelector('#price-change');
      
      expect(currentPrice.textContent).toBe('$51,000.00');
      expect(priceChange.textContent).toBe('+3.75%');
    });

    test('should not update display for price updates of different pairs', () => {
      navigationHeader = new NavigationHeader(container);
      
      // Get the callback function for priceUpdate
      const priceUpdateCallback = mockDataService.subscribe.mock.calls
        .find(call => call[0] === 'priceUpdate')[1];
      
      // Store original display values
      const originalPrice = container.querySelector('#current-price').textContent;
      const originalChange = container.querySelector('#price-change').textContent;
      
      // Simulate price update for different pair
      priceUpdateCallback({
        symbol: 'ETH/USDT',
        price: 3500,
        change24h: 2.15
      });
      
      // Check display remains unchanged
      const currentPrice = container.querySelector('#current-price');
      const priceChange = container.querySelector('#price-change');
      
      expect(currentPrice.textContent).toBe(originalPrice);
      expect(priceChange.textContent).toBe(originalChange);
    });
  });

  describe('Navigation Functionality', () => {
    test('should set Trade link as active by default', () => {
      navigationHeader = new NavigationHeader(container);
      
      const desktopTradeLink = container.querySelector('nav a');
      const mobileTradeLink = container.querySelector('#mobile-menu a');
      
      expect(desktopTradeLink.classList.contains('text-accent-warning')).toBe(true);
      expect(mobileTradeLink.classList.contains('bg-primary-bg')).toBe(true);
      expect(mobileTradeLink.classList.contains('text-text-primary')).toBe(true);
    });

    test('should handle navigation link clicks', () => {
      navigationHeader = new NavigationHeader(container);
      
      const navLinks = container.querySelectorAll('nav a');
      const marketsLink = Array.from(navLinks).find(link => link.textContent === 'Markets');
      
      // Click on Markets link
      marketsLink.click();
      
      // Check that Markets link becomes active
      expect(marketsLink.classList.contains('text-text-primary')).toBe(true);
      expect(marketsLink.classList.contains('text-text-secondary')).toBe(false);
    });

    test('should toggle mobile menu visibility', () => {
      navigationHeader = new NavigationHeader(container);
      
      const mobileMenuButton = container.querySelector('#mobile-menu-button');
      const mobileMenu = container.querySelector('#mobile-menu');
      
      // Initially hidden
      expect(mobileMenu.classList.contains('hidden')).toBe(true);
      
      // Click to show
      mobileMenuButton.click();
      expect(mobileMenu.classList.contains('hidden')).toBe(false);
      
      // Click to hide
      mobileMenuButton.click();
      expect(mobileMenu.classList.contains('hidden')).toBe(true);
    });

    test('should handle Connect Wallet button click', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      navigationHeader = new NavigationHeader(container);
      
      const connectWalletButton = container.querySelector('button.bg-accent-warning');
      connectWalletButton.click();
      
      expect(consoleSpy).toHaveBeenCalledWith('Connect Wallet button clicked');
      consoleSpy.mockRestore();
    });
  });

  describe('External Updates', () => {
    test('should update trading pair when updateTradingPair is called', () => {
      navigationHeader = new NavigationHeader(container);
      
      // Mock new price data
      mockDataService.getCurrentPrice.mockReturnValue({
        price: 2800,
        change24h: -1.25
      });
      
      // Update trading pair externally
      navigationHeader.updateTradingPair('ETH/USDT');
      
      // Check updated display
      const currentPair = container.querySelector('#current-pair');
      const currentPrice = container.querySelector('#current-price');
      const priceChange = container.querySelector('#price-change');
      
      expect(currentPair.textContent).toBe('ETH/USDT');
      expect(currentPrice.textContent).toBe('$2,800.00');
      expect(priceChange.textContent).toBe('-1.25%');
      expect(priceChange.classList.contains('bg-danger-bg')).toBe(true);
    });
  });
});