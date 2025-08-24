import AssetListPanel from '../AssetListPanel.js';
import TradingPairSelector from '../TradingPairSelector.js';

// Mock the TradingPairSelector component
const mockTradingPairSelectorInstance = {
  destroy: jest.fn()
};

jest.mock('../TradingPairSelector.js', () => {
  const MockTradingPairSelector = jest.fn().mockImplementation((container) => {
    const instance = {
      container,
      destroy: jest.fn()
    };
    
    // Store the instance for testing
    MockTradingPairSelector.mockInstance = instance;
    
    return instance;
  });
  
  return MockTradingPairSelector;
});

describe('AssetListPanel', () => {
  let container;
  let assetListPanel;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create container
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (assetListPanel && typeof assetListPanel.destroy === 'function') {
      assetListPanel.destroy();
    }
    document.body.removeChild(container);
  });

  describe('Component Initialization', () => {
    test('should render the panel structure correctly', () => {
      assetListPanel = new AssetListPanel(container);
      
      // Check main panel structure
      const mainPanel = container.querySelector('.h-full.flex.flex-col.bg-primary-surface.border.border-primary-border');
      expect(mainPanel).toBeTruthy();
      
      // Check panel header
      const header = container.querySelector('.border-b.border-primary-border.p-3');
      expect(header).toBeTruthy();
      
      const title = container.querySelector('h3.text-sm.font-semibold.text-text-primary');
      expect(title).toBeTruthy();
      expect(title.textContent).toBe('Trading Pairs');
      
      // Check panel content area
      const content = container.querySelector('.flex-1.overflow-hidden');
      expect(content).toBeTruthy();
      
      const selectorContainer = container.querySelector('#trading-pair-selector-content.h-full');
      expect(selectorContainer).toBeTruthy();
    });

    test('should initialize TradingPairSelector component', () => {
      assetListPanel = new AssetListPanel(container);
      
      // Check that TradingPairSelector was instantiated
      expect(TradingPairSelector).toHaveBeenCalledTimes(1);
      
      // Check that it was called with the correct container
      const selectorContainer = container.querySelector('#trading-pair-selector-content');
      expect(TradingPairSelector).toHaveBeenCalledWith(selectorContainer);
      
      // Check that the instance is stored
      expect(assetListPanel.tradingPairSelector).toBeTruthy();
      expect(assetListPanel.tradingPairSelector).toBe(TradingPairSelector.mockInstance);
    });

    test('should handle missing selector container gracefully', () => {
      // Mock querySelector to return null
      const originalQuerySelector = container.querySelector;
      container.querySelector = jest.fn((selector) => {
        if (selector === '#trading-pair-selector-content') {
          return null;
        }
        return originalQuerySelector.call(container, selector);
      });
      
      assetListPanel = new AssetListPanel(container);
      
      expect(TradingPairSelector).not.toHaveBeenCalled();
      expect(assetListPanel.tradingPairSelector).toBeNull();
      
      // Restore original method
      container.querySelector = originalQuerySelector;
    });
  });

  describe('Component Lifecycle', () => {
    test('should call init method during construction', () => {
      const initSpy = jest.spyOn(AssetListPanel.prototype, 'init');
      
      assetListPanel = new AssetListPanel(container);
      
      expect(initSpy).toHaveBeenCalledTimes(1);
      
      initSpy.mockRestore();
    });

    test('should call render and initializeComponents during init', () => {
      const renderSpy = jest.spyOn(AssetListPanel.prototype, 'render');
      const initComponentsSpy = jest.spyOn(AssetListPanel.prototype, 'initializeComponents');
      
      assetListPanel = new AssetListPanel(container);
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
      expect(initComponentsSpy).toHaveBeenCalledTimes(1);
      
      renderSpy.mockRestore();
      initComponentsSpy.mockRestore();
    });
  });

  describe('Component Cleanup', () => {
    test('should destroy TradingPairSelector when destroy is called', () => {
      assetListPanel = new AssetListPanel(container);
      
      const mockTradingPairSelector = assetListPanel.tradingPairSelector;
      expect(mockTradingPairSelector).toBeTruthy();
      
      assetListPanel.destroy();
      
      expect(mockTradingPairSelector.destroy).toHaveBeenCalledTimes(1);
    });

    test('should handle destroy when TradingPairSelector is null', () => {
      assetListPanel = new AssetListPanel(container);
      assetListPanel.tradingPairSelector = null;
      
      // Should not throw error
      expect(() => {
        assetListPanel.destroy();
      }).not.toThrow();
    });

    test('should handle destroy when TradingPairSelector has no destroy method', () => {
      assetListPanel = new AssetListPanel(container);
      assetListPanel.tradingPairSelector = {}; // Object without destroy method
      
      // Should not throw error
      expect(() => {
        assetListPanel.destroy();
      }).not.toThrow();
    });
  });

  describe('DOM Structure Validation', () => {
    test('should have correct CSS classes for styling', () => {
      assetListPanel = new AssetListPanel(container);
      
      // Main container classes
      const mainContainer = container.querySelector('.h-full.flex.flex-col.bg-primary-surface.border.border-primary-border');
      expect(mainContainer).toBeTruthy();
      
      // Header classes
      const header = container.querySelector('.border-b.border-primary-border.p-3');
      expect(header).toBeTruthy();
      
      // Title classes
      const title = container.querySelector('h3.text-sm.font-semibold.text-text-primary');
      expect(title).toBeTruthy();
      
      // Content area classes
      const content = container.querySelector('.flex-1.overflow-hidden');
      expect(content).toBeTruthy();
      
      // Selector container classes
      const selectorContainer = container.querySelector('#trading-pair-selector-content.h-full');
      expect(selectorContainer).toBeTruthy();
    });

    test('should have proper HTML structure hierarchy', () => {
      assetListPanel = new AssetListPanel(container);
      
      // Check hierarchy: container > main panel > header + content
      const mainPanel = container.firstElementChild;
      expect(mainPanel.classList.contains('h-full')).toBe(true);
      
      const children = Array.from(mainPanel.children);
      expect(children).toHaveLength(2);
      
      // First child should be header
      const header = children[0];
      expect(header.classList.contains('border-b')).toBe(true);
      expect(header.querySelector('h3')).toBeTruthy();
      
      // Second child should be content
      const content = children[1];
      expect(content.classList.contains('flex-1')).toBe(true);
      expect(content.querySelector('#trading-pair-selector-content')).toBeTruthy();
    });
  });

  describe('Integration with TradingPairSelector', () => {
    test('should pass correct container to TradingPairSelector', () => {
      assetListPanel = new AssetListPanel(container);
      
      const expectedContainer = container.querySelector('#trading-pair-selector-content');
      expect(TradingPairSelector).toHaveBeenCalledWith(expectedContainer);
    });

    test('should store TradingPairSelector instance reference', () => {
      assetListPanel = new AssetListPanel(container);
      
      expect(assetListPanel.tradingPairSelector).toBe(TradingPairSelector.mockInstance);
      expect(assetListPanel.tradingPairSelector.container).toBe(
        container.querySelector('#trading-pair-selector-content')
      );
    });
  });

  describe('Error Handling', () => {
    test('should throw error when container is null or undefined', () => {
      // Test with null container
      expect(() => {
        new AssetListPanel(null);
      }).toThrow('Cannot set properties of null (setting \'innerHTML\')');
      
      // Test with undefined container
      expect(() => {
        new AssetListPanel(undefined);
      }).toThrow('Cannot set properties of undefined (setting \'innerHTML\')');
    });

    test('should handle DOM manipulation errors gracefully', () => {
      // Mock innerHTML to throw error
      const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
      Object.defineProperty(container, 'innerHTML', {
        set: jest.fn(() => {
          throw new Error('DOM manipulation failed');
        }),
        configurable: true
      });
      
      expect(() => {
        assetListPanel = new AssetListPanel(container);
      }).toThrow('DOM manipulation failed');
      
      // Restore original property
      Object.defineProperty(container, 'innerHTML', originalInnerHTML);
    });
  });
});