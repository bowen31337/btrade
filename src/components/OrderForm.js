import { mockDataService } from '../services/mockDataService.js';

export class OrderForm {
  constructor(container) {
    this.container = container;
    this.currentPair = null;
    this.currentPrice = null;
    this.orderType = 'limit'; // 'market' or 'limit'
    this.orderSide = 'buy'; // 'buy' or 'sell'
    this.init();
  }

  init() {
    this.loadData();
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="bg-primary-surface border border-primary-border rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-text-primary">Place Order</h3>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-text-secondary">Balance:</span>
            <span class="text-sm font-medium text-text-primary">$10,000.00</span>
          </div>
        </div>

        <!-- Order Type Tabs -->
        <div class="flex mb-4 bg-primary-surface rounded-lg p-1">
          <button id="limit-tab" class="flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors order-type-tab active">
            Limit
          </button>
          <button id="market-tab" class="flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors order-type-tab">
            Market
          </button>
        </div>

        <!-- Buy/Sell Tabs -->
        <div class="flex mb-4 space-x-2">
          <button id="buy-tab" class="flex-1 py-3 px-4 font-medium rounded-lg transition-colors order-side-tab buy-tab active">
            Buy ${this.currentPair ? this.currentPair.baseAsset : 'BTC'}
          </button>
          <button id="sell-tab" class="flex-1 py-3 px-4 font-medium rounded-lg transition-colors order-side-tab sell-tab">
            Sell ${this.currentPair ? this.currentPair.baseAsset : 'BTC'}
          </button>
        </div>

        <!-- Order Form -->
        <form id="order-form" class="space-y-4">
          <!-- Price Input (for limit orders) -->
          <div id="price-input-group" class="space-y-2">
            <label class="block text-sm font-medium text-text-secondary">Price</label>
            <div class="relative">
              <input 
                type="number" 
                id="price-input" 
                class="w-full px-3 py-2 bg-primary-surface border border-primary-border rounded-lg text-black placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-warning focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                value="${this.currentPrice ? this.currentPrice.price : ''}"
              />
              <span class="absolute right-3 top-2 text-sm text-text-secondary">
                ${this.currentPair ? this.currentPair.quoteAsset : 'USDT'}
              </span>
            </div>
          </div>

          <!-- Amount Input -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-text-secondary">Amount</label>
            <div class="relative">
              <input 
                type="number" 
                id="amount-input" 
                class="w-full px-3 py-2 bg-primary-surface border border-primary-border rounded-lg text-black placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-warning focus:border-transparent"
                placeholder="0.00"
                step="0.00001"
              />
              <span class="absolute right-3 top-2 text-sm text-text-secondary">
                ${this.currentPair ? this.currentPair.baseAsset : 'BTC'}
              </span>
            </div>
          </div>

          <!-- Percentage Buttons -->
          <div class="grid grid-cols-4 gap-2">
            <button type="button" class="percentage-btn" data-percentage="25">25%</button>
            <button type="button" class="percentage-btn" data-percentage="50">50%</button>
            <button type="button" class="percentage-btn" data-percentage="75">75%</button>
            <button type="button" class="percentage-btn" data-percentage="100">100%</button>
          </div>

          <!-- Total -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-text-secondary">Total</label>
            <div class="relative">
              <input 
                type="number" 
                id="total-input" 
                class="w-full px-3 py-2 bg-primary-surface border border-primary-border rounded-lg text-black placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-warning focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                readonly
              />
              <span class="absolute right-3 top-2 text-sm text-text-secondary">
                ${this.currentPair ? this.currentPair.quoteAsset : 'USDT'}
              </span>
            </div>
          </div>

          <!-- Advanced Options -->
          <div class="border-t border-primary-border pt-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-text-secondary">Advanced</span>
              <button type="button" id="advanced-toggle" class="text-xs text-accent-warning hover:text-accent-warning">
                Show
              </button>
            </div>
            <div id="advanced-options" class="hidden space-y-3">
              <div class="flex items-center space-x-2">
                <input type="checkbox" id="post-only" class="rounded border-primary-border">
                <label for="post-only" class="text-sm text-text-secondary">Post Only</label>
              </div>
              <div class="flex items-center space-x-2">
                <input type="checkbox" id="reduce-only" class="rounded border-primary-border">
                <label for="reduce-only" class="text-sm text-text-secondary">Reduce Only</label>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            id="submit-order" 
            class="w-full py-3 px-4 font-medium rounded-lg transition-colors submit-btn"
          >
            <span id="submit-text">Buy ${this.currentPair ? this.currentPair.baseAsset : 'BTC'}</span>
          </button>
        </form>

        <!-- Order Summary -->
        <div class="mt-4 p-3 bg-primary-surface rounded-lg">
          <div class="text-xs text-text-secondary space-y-1">
            <div class="flex justify-between">
              <span>Available:</span>
              <span id="available-balance">$10,000.00</span>
            </div>
            <div class="flex justify-between">
              <span>Fee (0.1%):</span>
              <span id="estimated-fee">$0.00</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Order type tabs
    const limitTab = this.container.querySelector('#limit-tab');
    const marketTab = this.container.querySelector('#market-tab');
    
    limitTab?.addEventListener('click', () => this.switchOrderType('limit'));
    marketTab?.addEventListener('click', () => this.switchOrderType('market'));

    // Order side tabs
    const buyTab = this.container.querySelector('#buy-tab');
    const sellTab = this.container.querySelector('#sell-tab');
    
    buyTab?.addEventListener('click', () => this.switchOrderSide('buy'));
    sellTab?.addEventListener('click', () => this.switchOrderSide('sell'));

    // Form inputs
    const priceInput = this.container.querySelector('#price-input');
    const amountInput = this.container.querySelector('#amount-input');
    const totalInput = this.container.querySelector('#total-input');

    priceInput?.addEventListener('input', () => this.calculateTotal());
    amountInput?.addEventListener('input', () => this.calculateTotal());
    totalInput?.addEventListener('input', () => this.calculateAmount());

    // Percentage buttons
    const percentageButtons = this.container.querySelectorAll('.percentage-btn');
    percentageButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const percentage = parseInt(e.target.dataset.percentage);
        this.setAmountByPercentage(percentage);
      });
    });

    // Advanced options toggle
    const advancedToggle = this.container.querySelector('#advanced-toggle');
    const advancedOptions = this.container.querySelector('#advanced-options');
    
    advancedToggle?.addEventListener('click', () => {
      const isHidden = advancedOptions.classList.contains('hidden');
      if (isHidden) {
        advancedOptions.classList.remove('hidden');
        advancedToggle.textContent = 'Hide';
      } else {
        advancedOptions.classList.add('hidden');
        advancedToggle.textContent = 'Show';
      }
    });

    // Form submission
    const orderForm = this.container.querySelector('#order-form');
    orderForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitOrder();
    });

    // Listen for trading pair changes
    mockDataService.subscribe('tradingPairChanged', (data) => {
      this.currentPair = data.pair;
      this.currentPrice = mockDataService.getCurrentPrice(this.currentPair);
      this.updateDisplay();
    });

    // Listen for price updates
    mockDataService.subscribe('priceUpdate', (data) => {
      if (data.symbol === this.currentPair) {
        this.currentPrice = data;
        this.updatePriceInput();
      }
    });
  }

  loadData() {
    this.currentPair = mockDataService.getCurrentTradingPair();
    this.currentPrice = mockDataService.getCurrentPrice(this.currentPair.symbol);
  }

  switchOrderType(type) {
    this.orderType = type;
    
    // Update tab styles
    const tabs = this.container.querySelectorAll('.order-type-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const activeTab = this.container.querySelector(`#${type}-tab`);
    activeTab?.classList.add('active');

    // Show/hide price input for market orders
    const priceInputGroup = this.container.querySelector('#price-input-group');
    if (type === 'market') {
      priceInputGroup.style.display = 'none';
    } else {
      priceInputGroup.style.display = 'block';
    }

    this.calculateTotal();
  }

  switchOrderSide(side) {
    this.orderSide = side;
    
    // Update tab styles
    const tabs = this.container.querySelectorAll('.order-side-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const activeTab = this.container.querySelector(`#${side}-tab`);
    activeTab?.classList.add('active');

    // Update submit button
    const submitBtn = this.container.querySelector('#submit-order');
    const submitText = this.container.querySelector('#submit-text');
    
    if (side === 'buy') {
      submitBtn.className = 'w-full py-3 px-4 font-medium rounded-lg transition-colors bg-success text-white hover:bg-success-hover';
      submitText.textContent = `Buy ${this.currentPair ? this.currentPair.baseAsset : 'BTC'}`;
    } else {
      submitBtn.className = 'w-full py-3 px-4 font-medium rounded-lg transition-colors bg-danger text-white hover:bg-danger-hover';
      submitText.textContent = `Sell ${this.currentPair ? this.currentPair.baseAsset : 'BTC'}`;
    }
  }

  calculateTotal() {
    const priceInput = this.container.querySelector('#price-input');
    const amountInput = this.container.querySelector('#amount-input');
    const totalInput = this.container.querySelector('#total-input');
    
    const price = this.orderType === 'market' 
      ? (this.currentPrice ? parseFloat(this.currentPrice.price) : 0)
      : parseFloat(priceInput.value) || 0;
    const amount = parseFloat(amountInput.value) || 0;
    
    const total = price * amount;
    totalInput.value = total.toFixed(2);
    
    this.updateFee(total);
  }

  calculateAmount() {
    const priceInput = this.container.querySelector('#price-input');
    const amountInput = this.container.querySelector('#amount-input');
    const totalInput = this.container.querySelector('#total-input');
    
    const price = this.orderType === 'market' 
      ? (this.currentPrice ? parseFloat(this.currentPrice.price) : 0)
      : parseFloat(priceInput.value) || 0;
    const total = parseFloat(totalInput.value) || 0;
    
    if (price > 0) {
      const amount = total / price;
      amountInput.value = amount.toFixed(8);
      this.updateFee(total);
    }
  }

  setAmountByPercentage(percentage) {
    const balance = 10000; // Mock balance
    const priceInput = this.container.querySelector('#price-input');
    const amountInput = this.container.querySelector('#amount-input');
    
    const price = this.orderType === 'market' 
      ? (this.currentPrice ? parseFloat(this.currentPrice.price) : 0)
      : parseFloat(priceInput.value) || 0;
    
    if (price > 0) {
      const totalToUse = (balance * percentage) / 100;
      const amount = totalToUse / price;
      amountInput.value = amount.toFixed(8);
      this.calculateTotal();
    }
  }

  updateFee(total) {
    const feeElement = this.container.querySelector('#estimated-fee');
    const fee = total * 0.001; // 0.1% fee
    feeElement.textContent = `$${fee.toFixed(2)}`;
  }

  updatePriceInput() {
    if (this.orderType === 'limit' && this.currentPrice) {
      const priceInput = this.container.querySelector('#price-input');
      if (priceInput && !priceInput.value) {
        priceInput.value = parseFloat(this.currentPrice.price).toFixed(2);
      }
    }
  }

  updateDisplay() {
    // Re-render to update trading pair references
    this.render();
    this.setupEventListeners();
  }

  submitOrder() {
    const priceInput = this.container.querySelector('#price-input');
    const amountInput = this.container.querySelector('#amount-input');
    const totalInput = this.container.querySelector('#total-input');
    
    const orderData = {
      type: this.orderType,
      side: this.orderSide,
      symbol: this.currentPair,
      amount: parseFloat(amountInput.value) || 0,
      price: this.orderType === 'limit' ? parseFloat(priceInput.value) || 0 : null,
      total: parseFloat(totalInput.value) || 0,
      timestamp: Date.now()
    };

    // Validate order
    if (orderData.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (orderData.type === 'limit' && orderData.price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    // Simulate order submission
    console.log('Submitting order:', orderData);
    
    // Show success message
    const submitBtn = this.container.querySelector('#submit-order');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Order Placed!';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      // Clear form
      amountInput.value = '';
      totalInput.value = '';
      if (this.orderType === 'limit') {
        priceInput.value = this.currentPrice ? parseFloat(this.currentPrice.price).toFixed(2) : '';
      }
    }, 2000);

    // Emit order event for other components
    mockDataService.notifySubscribers('orderPlaced', orderData);
  }
}