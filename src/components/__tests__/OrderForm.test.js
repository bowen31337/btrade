import { OrderForm } from '../OrderForm.js';
import { mockDataService } from '../../services/mockDataService.js';

// Mock the mockDataService
jest.mock('../../services/mockDataService.js', () => ({
  mockDataService: {
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    notifySubscribers: jest.fn(),
    getCurrentPrice: jest.fn(() => ({ price: '50000.00', change: '+2.5%' })),
    getCurrentTradingPair: jest.fn(() => ({ baseAsset: 'BTC', quoteAsset: 'USDT', symbol: 'BTCUSDT' }))
  }
}));

describe('OrderForm Component', () => {
  let container;
  let orderForm;

  beforeEach(() => {
    // Create a container element
    container = document.createElement('div');
    document.body.appendChild(container);
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Create OrderForm instance
    orderForm = new OrderForm(container);
    
    // Set up mock data
    orderForm.currentPair = { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', price: 50000 };
    orderForm.currentPrice = { price: 50000 };
    orderForm.balance = { BTC: 1.5, USDT: 75000 };
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
  });

  // TC-UT-3.1-001: Verify OrderForm component renders correctly with all required elements
  describe('Component Rendering', () => {
    test('should render order form with all required elements', () => {
      expect(container.querySelector('h3')).toHaveTextContent('Place Order');
      expect(container.querySelector('#price-input')).toBeInTheDocument();
      expect(container.querySelector('#amount-input')).toBeInTheDocument();
      expect(container.querySelector('#total-input')).toBeInTheDocument();
      expect(container.querySelector('#submit-order')).toBeInTheDocument();
    });

    test('should render order type tabs (Market/Limit)', () => {
      expect(container.querySelector('#limit-tab')).toBeInTheDocument();
      expect(container.querySelector('#market-tab')).toBeInTheDocument();
      expect(container.querySelector('#limit-tab')).toHaveClass('active');
    });

    test('should render buy/sell tabs', () => {
      expect(container.querySelector('#buy-tab')).toBeInTheDocument();
      expect(container.querySelector('#sell-tab')).toBeInTheDocument();
      expect(container.querySelector('#buy-tab')).toHaveClass('active');
    });

    test('should render percentage buttons', () => {
      const percentageButtons = container.querySelectorAll('.percentage-btn');
      expect(percentageButtons).toHaveLength(4);
      expect(percentageButtons[0]).toHaveAttribute('data-percentage', '25');
      expect(percentageButtons[1]).toHaveAttribute('data-percentage', '50');
      expect(percentageButtons[2]).toHaveAttribute('data-percentage', '75');
      expect(percentageButtons[3]).toHaveAttribute('data-percentage', '100');
    });
  });

  // TC-UT-3.1-002: Test price input field validation and behavior
  describe('Price Input Validation', () => {
    test('should accept valid numeric price values', () => {
      const priceInput = container.querySelector('#price-input');
      priceInput.value = '50000.50';
      priceInput.dispatchEvent(new Event('input'));
      
      expect(priceInput.value).toBe('50000.50');
    });

    test('should handle empty price input', () => {
      const priceInput = container.querySelector('#price-input');
      priceInput.value = '';
      priceInput.dispatchEvent(new Event('input'));
      
      expect(priceInput.value).toBe('');
    });

    test('should hide price input for market orders', () => {
      orderForm.switchOrderType('market');
      
      const priceInputGroup = container.querySelector('#price-input-group');
      expect(priceInputGroup.style.display).toBe('none');
    });

    test('should enable price input for limit orders', () => {
      orderForm.switchOrderType('limit');
      const priceInput = container.querySelector('#price-input');
      
      expect(priceInput).not.toBeDisabled();
    });
  });

  // TC-UT-3.1-003: Test amount input field validation and behavior
  describe('Amount Input Validation', () => {
    test('should accept valid numeric amount values', () => {
      const amountInput = container.querySelector('#amount-input');
      amountInput.value = '0.5';
      amountInput.dispatchEvent(new Event('input'));
      
      expect(amountInput.value).toBe('0.5');
    });

    test('should handle empty amount input', () => {
      const amountInput = container.querySelector('#amount-input');
      amountInput.value = '';
      amountInput.dispatchEvent(new Event('input'));
      
      expect(amountInput.value).toBe('');
    });

    test('should calculate amount from percentage buttons', () => {
      const priceInput = container.querySelector('#price-input');
      const amountInput = container.querySelector('#amount-input');
      
      priceInput.value = '50000';
      
      const percentageBtn = container.querySelector('[data-percentage="50"]');
      percentageBtn.click();
      
      // 50% of 10000 balance = 5000, divided by price 50000 = 0.1
      expect(parseFloat(amountInput.value)).toBeCloseTo(0.1, 8);
    });
  });

  // TC-UT-3.1-004: Test automatic total calculation logic
  describe('Total Calculation Logic', () => {
    test('should calculate total correctly when price and amount are entered', () => {
      const priceInput = container.querySelector('#price-input');
      const amountInput = container.querySelector('#amount-input');
      const totalInput = container.querySelector('#total-input');
      
      priceInput.value = '50000';
      amountInput.value = '0.5';
      
      orderForm.calculateTotal();
      
      expect(totalInput.value).toBe('25000.00');
    });

    test('should calculate total as zero when inputs are empty', () => {
      const priceInput = container.querySelector('#price-input');
      const amountInput = container.querySelector('#amount-input');
      const totalInput = container.querySelector('#total-input');
      
      priceInput.value = '';
      amountInput.value = '';
      
      orderForm.calculateTotal();
      
      expect(totalInput.value).toBe('0.00');
    });

    test('should calculate amount when total and price are entered', () => {
      const priceInput = container.querySelector('#price-input');
      const amountInput = container.querySelector('#amount-input');
      const totalInput = container.querySelector('#total-input');
      
      priceInput.value = '50000';
      totalInput.value = '25000';
      
      orderForm.calculateAmount();
      
      expect(parseFloat(amountInput.value)).toBeCloseTo(0.5, 8);
    });

    test('should use market price for total calculation in market orders', () => {
      orderForm.switchOrderType('market');
      
      const amountInput = container.querySelector('#amount-input');
      const totalInput = container.querySelector('#total-input');
      
      amountInput.value = '0.5';
      amountInput.dispatchEvent(new Event('input'));
      
      // Manually trigger calculation since the event listener might not be set up
      orderForm.calculateTotal();
      
      // Market price from mock is 50000, so 0.5 * 50000 = 25000
      expect(totalInput.value).toBe('25000.00');
    });
  });

  // TC-UT-3.2: Order Type Selection Tests
  describe('Order Type Selection (TC-UT-3.2)', () => {
    // TC-UT-3.2-001: Order Type Tab Component Initialization
    test('should initialize order type tabs correctly', () => {
      // Verify both tabs are present
      expect(container.querySelector('#market-tab')).toBeInTheDocument();
      expect(container.querySelector('#limit-tab')).toBeInTheDocument();
      
      // Verify default state (Limit should be active by default)
      expect(container.querySelector('#limit-tab')).toHaveClass('active');
      expect(container.querySelector('#market-tab')).not.toHaveClass('active');
      
      // Verify initial order type state
      expect(orderForm.orderType).toBe('limit');
    });

    // TC-UT-3.2-002: Order Type State Management
    test('should manage order type state correctly', () => {
      // Test initial state
      expect(orderForm.orderType).toBe('limit');
      
      // Test Market tab selection
      orderForm.switchOrderType('market');
      expect(orderForm.orderType).toBe('market');
      expect(container.querySelector('#market-tab')).toHaveClass('active');
      expect(container.querySelector('#limit-tab')).not.toHaveClass('active');
      
      // Test Limit tab selection
      orderForm.switchOrderType('limit');
      expect(orderForm.orderType).toBe('limit');
      expect(container.querySelector('#limit-tab')).toHaveClass('active');
      expect(container.querySelector('#market-tab')).not.toHaveClass('active');
      
      // Test rapid switching
      orderForm.switchOrderType('market');
      orderForm.switchOrderType('limit');
      orderForm.switchOrderType('market');
      expect(orderForm.orderType).toBe('market');
      expect(container.querySelector('#market-tab')).toHaveClass('active');
    });

    // TC-UT-3.2-003: Price Field Control Logic
    test('should control price field based on order type', () => {
      const priceInput = container.querySelector('#price-input');
      const priceInputGroup = container.querySelector('#price-input-group');
      
      // Test Limit order - price field should be enabled
      orderForm.switchOrderType('limit');
      expect(priceInputGroup.style.display).not.toBe('none');
      expect(priceInput).not.toBeDisabled();
      
      // Test Market order - price field should be disabled/hidden
      orderForm.switchOrderType('market');
      expect(priceInputGroup.style.display).toBe('none');
      
      // Switch back to Limit and verify field is enabled again
      orderForm.switchOrderType('limit');
      expect(priceInputGroup.style.display).not.toBe('none');
      expect(priceInput).not.toBeDisabled();
    });

    // TC-UT-3.2-004: Tab Visual State Logic
    test('should apply correct visual states to tabs', () => {
      const marketTab = container.querySelector('#market-tab');
      const limitTab = container.querySelector('#limit-tab');
      
      // Test initial visual state (Limit active)
      expect(limitTab).toHaveClass('active');
      expect(marketTab).not.toHaveClass('active');
      
      // Test Market tab activation
      orderForm.switchOrderType('market');
      expect(marketTab).toHaveClass('active');
      expect(limitTab).not.toHaveClass('active');
      
      // Test Limit tab activation
      orderForm.switchOrderType('limit');
      expect(limitTab).toHaveClass('active');
      expect(marketTab).not.toHaveClass('active');
      
      // Verify only one tab can be active at a time
      expect(container.querySelectorAll('.order-type-tab.active')).toHaveLength(1);
    });

    // Additional integration test for order type and form validation
    test('should adapt form validation to order type', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      const amountInput = container.querySelector('#amount-input');
      
      // Test Market order validation (should not require price)
      orderForm.switchOrderType('market');
      amountInput.value = '0.5';
      orderForm.submitOrder();
      
      // Should not show price validation error for market orders
      expect(alertSpy).not.toHaveBeenCalledWith('Please enter a valid price');
      
      // Test Limit order validation (should require price)
      orderForm.switchOrderType('limit');
      const priceInput = container.querySelector('#price-input');
      priceInput.value = '0';
      amountInput.value = '0.5';
      orderForm.submitOrder();
      
      // Should show price validation error for limit orders
      expect(alertSpy).toHaveBeenCalledWith('Please enter a valid price');
      
      alertSpy.mockRestore();
    });
  });

  // Additional tests for order side switching
  describe('Order Side Switching', () => {
    test('should switch to buy order side', () => {
      orderForm.switchOrderSide('buy');
      
      expect(orderForm.orderSide).toBe('buy');
      expect(container.querySelector('#buy-tab')).toHaveClass('active');
      expect(container.querySelector('#sell-tab')).not.toHaveClass('active');
    });

    test('should switch to sell order side', () => {
      orderForm.switchOrderSide('sell');
      
      expect(orderForm.orderSide).toBe('sell');
      expect(container.querySelector('#sell-tab')).toHaveClass('active');
      expect(container.querySelector('#buy-tab')).not.toHaveClass('active');
    });
  });

  // Tests for form submission and validation
  describe('Form Submission', () => {
    test('should validate amount before submission', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      const amountInput = container.querySelector('#amount-input');
      amountInput.value = '0';
      
      orderForm.submitOrder();
      
      expect(alertSpy).toHaveBeenCalledWith('Please enter a valid amount');
      alertSpy.mockRestore();
    });

    test('should validate price for limit orders before submission', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      orderForm.switchOrderType('limit');
      const priceInput = container.querySelector('#price-input');
      const amountInput = container.querySelector('#amount-input');
      
      priceInput.value = '0';
      amountInput.value = '0.5';
      
      orderForm.submitOrder();
      
      expect(alertSpy).toHaveBeenCalledWith('Please enter a valid price');
      alertSpy.mockRestore();
    });

    test('should submit valid order and notify subscribers', () => {
      const priceInput = container.querySelector('#price-input');
      const amountInput = container.querySelector('#amount-input');
      
      priceInput.value = '50000';
      amountInput.value = '0.5';
      
      orderForm.submitOrder();
      
      expect(mockDataService.notifySubscribers).toHaveBeenCalledWith('orderPlaced', expect.objectContaining({
        type: 'limit',
        side: 'buy',
        amount: 0.5,
        price: 50000
      }));
    });
  });

  // Tests for fee calculation
  describe('Fee Calculation', () => {
    test('should calculate and display estimated fee', () => {
      const total = 25000;
      orderForm.updateFee(total);
      
      const feeElement = container.querySelector('#estimated-fee');
      expect(feeElement.textContent).toBe('$25.00'); // 0.1% of 25000
    });
  });

  // TC-UT-3.3: Buy/Sell Execution Tests
  describe('Buy/Sell Execution (TC-UT-3.3)', () => {
    // TC-UT-3.3-001: Buy Button Rendering
    describe('UT-3.3-001: Buy Button Rendering', () => {
      test('should render Buy button with correct styling and text', () => {
        // Ensure we're in buy mode
        orderForm.switchOrderSide('buy');
        
        const submitBtn = container.querySelector('#submit-order');
        const submitText = container.querySelector('#submit-text');
        
        // Verify button is present and has correct text
        expect(submitBtn).toBeInTheDocument();
        expect(submitText).toHaveTextContent('Buy BTC');
        
        // Check green styling for buy button
        expect(submitBtn).toHaveClass('bg-success');
        expect(submitBtn).toHaveClass('text-white');
        
        // Verify button is clickable and not disabled by default
        expect(submitBtn).not.toBeDisabled();
        expect(submitBtn.type).toBe('submit');
      });

      test('should have appropriate accessibility attributes', () => {
        orderForm.switchOrderSide('buy');
        
        const submitBtn = container.querySelector('#submit-order');
        expect(submitBtn.tagName).toBe('BUTTON');
        expect(submitBtn).toBeVisible();
      });
    });

    // TC-UT-3.3-002: Sell Button Rendering
    describe('UT-3.3-002: Sell Button Rendering', () => {
      test('should render Sell button with correct styling and text', () => {
        // Switch to sell mode
        orderForm.switchOrderSide('sell');
        
        const submitBtn = container.querySelector('#submit-order');
        const submitText = container.querySelector('#submit-text');
        
        // Verify button is present and has correct text
        expect(submitBtn).toBeInTheDocument();
        expect(submitText).toHaveTextContent('Sell BTC');
        
        // Check red styling for sell button
        expect(submitBtn).toHaveClass('bg-danger');
        expect(submitBtn).toHaveClass('text-white');
        
        // Verify button is clickable and not disabled by default
        expect(submitBtn).not.toBeDisabled();
        expect(submitBtn.type).toBe('submit');
      });

      test('should update button text based on trading pair', () => {
        orderForm.currentPair = { baseAsset: 'ETH', quoteAsset: 'USDT', symbol: 'ETHUSDT' };
        orderForm.switchOrderSide('sell');
        
        const submitText = container.querySelector('#submit-text');
        expect(submitText).toHaveTextContent('Sell ETH');
      });
    });

    // TC-UT-3.3-003: Form Validation Logic
    describe('UT-3.3-003: Form Validation Logic', () => {
      test('should prevent submission with empty amount field', () => {
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
        
        const amountInput = container.querySelector('#amount-input');
        amountInput.value = '';
        
        orderForm.submitOrder();
        
        expect(alertSpy).toHaveBeenCalledWith('Please enter a valid amount');
        alertSpy.mockRestore();
      });

      test('should prevent submission with invalid amount (≤0)', () => {
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
        
        const amountInput = container.querySelector('#amount-input');
        amountInput.value = '0';
        
        orderForm.submitOrder();
        
        expect(alertSpy).toHaveBeenCalledWith('Please enter a valid amount');
        
        amountInput.value = '-1';
        orderForm.submitOrder();
        
        expect(alertSpy).toHaveBeenCalledWith('Please enter a valid amount');
        alertSpy.mockRestore();
      });

      test('should prevent submission with invalid price for limit orders (≤0)', () => {
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
        
        orderForm.switchOrderType('limit');
        const priceInput = container.querySelector('#price-input');
        const amountInput = container.querySelector('#amount-input');
        
        priceInput.value = '0';
        amountInput.value = '1';
        
        orderForm.submitOrder();
        
        expect(alertSpy).toHaveBeenCalledWith('Please enter a valid price');
        
        priceInput.value = '-100';
        orderForm.submitOrder();
        
        expect(alertSpy).toHaveBeenCalledWith('Please enter a valid price');
        alertSpy.mockRestore();
      });

      test('should allow submission with valid data', () => {
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
        
        const priceInput = container.querySelector('#price-input');
        const amountInput = container.querySelector('#amount-input');
        
        priceInput.value = '50000';
        amountInput.value = '0.5';
        
        orderForm.submitOrder();
        
        // Should not show any validation errors
        expect(alertSpy).not.toHaveBeenCalled();
        alertSpy.mockRestore();
      });

      test('should skip price validation for market orders', () => {
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
        
        orderForm.switchOrderType('market');
        const amountInput = container.querySelector('#amount-input');
        
        amountInput.value = '0.5';
        
        orderForm.submitOrder();
        
        // Should not show price validation error for market orders
        expect(alertSpy).not.toHaveBeenCalledWith('Please enter a valid price');
        alertSpy.mockRestore();
      });
    });

    // TC-UT-3.3-004: Form Reset Logic
    describe('UT-3.3-004: Form Reset Logic', () => {
      test('should clear form fields after successful submission', (done) => {
        const priceInput = container.querySelector('#price-input');
        const amountInput = container.querySelector('#amount-input');
        const totalInput = container.querySelector('#total-input');
        
        // Populate form with test data
        priceInput.value = '50000';
        amountInput.value = '0.5';
        totalInput.value = '25000';
        
        orderForm.submitOrder();
        
        // Check that form is cleared after the 2-second timeout
        setTimeout(() => {
          expect(amountInput.value).toBe('');
          expect(totalInput.value).toBe('');
          // Price should be reset to current price for limit orders
          if (orderForm.orderType === 'limit') {
            expect(priceInput.value).toBe('50000.00');
          }
          done();
        }, 2100); // Wait slightly longer than the 2-second timeout
      });

      test('should reset form state to initial values', (done) => {
        const priceInput = container.querySelector('#price-input');
        const amountInput = container.querySelector('#amount-input');
        const totalInput = container.querySelector('#total-input');
        
        // Populate form with test data
        priceInput.value = '45000';
        amountInput.value = '1.2';
        totalInput.value = '54000';
        
        orderForm.submitOrder();
        
        // Verify form is ready for new input after reset
        setTimeout(() => {
          expect(amountInput.value).toBe('');
          expect(totalInput.value).toBe('');
          expect(amountInput).not.toBeDisabled();
          expect(totalInput).not.toBeDisabled();
          done();
        }, 2100);
      });

      test('should show success message and disable button temporarily', (done) => {
        const submitBtn = container.querySelector('#submit-order');
        const originalText = submitBtn.textContent;
        
        const priceInput = container.querySelector('#price-input');
        const amountInput = container.querySelector('#amount-input');
        
        priceInput.value = '50000';
        amountInput.value = '0.5';
        
        orderForm.submitOrder();
        
        // Check immediate feedback
        expect(submitBtn.textContent).toBe('Order Placed!');
        expect(submitBtn).toBeDisabled();
        
        // Check that button is restored after timeout
        setTimeout(() => {
          expect(submitBtn.textContent).toBe(originalText);
          expect(submitBtn).not.toBeDisabled();
          done();
        }, 2100);
      });

      test('should emit order event after successful submission', () => {
        const priceInput = container.querySelector('#price-input');
        const amountInput = container.querySelector('#amount-input');
        
        priceInput.value = '50000';
        amountInput.value = '0.5';
        
        orderForm.submitOrder();
        
        expect(mockDataService.notifySubscribers).toHaveBeenCalledWith('orderPlaced', expect.objectContaining({
          type: 'limit',
          side: 'buy',
          amount: 0.5,
          price: 50000,
          timestamp: expect.any(Number)
        }));
      });
    });
  });
});