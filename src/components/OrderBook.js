import { mockDataService } from '../services/mockDataService.js';

class OrderBook {
  constructor(container) {
    this.container = container;
    this.orderBookData = { bids: [], asks: [] };
    this.init();
  }

  init() {
    this.render();
    this.loadData();
    this.setupEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="bg-dark-800 rounded-lg p-4 h-full">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-text-primary font-semibold">Order Book</h3>
          <div class="flex space-x-2">
            <button class="text-xs px-2 py-1 bg-dark-700 text-text-secondary rounded hover:bg-dark-600 transition-colors">
              0.01
            </button>
            <button class="text-xs px-2 py-1 bg-dark-700 text-text-secondary rounded hover:bg-dark-600 transition-colors">
              0.1
            </button>
            <button class="text-xs px-2 py-1 bg-primary-600 text-white rounded">
              1
            </button>
          </div>
        </div>
        
        <!-- Header -->
        <div class="grid grid-cols-3 gap-2 text-xs text-text-secondary mb-2 px-2">
          <div class="text-left">Price (USDT)</div>
          <div class="text-right">Amount (BTC)</div>
          <div class="text-right">Total</div>
        </div>
        
        <!-- Asks (Sell Orders) -->
        <div class="asks-container mb-4">
          <div id="asks-list" class="space-y-1">
            <!-- Asks will be populated here -->
          </div>
        </div>
        
        <!-- Current Price -->
        <div class="current-price-section py-3 px-2 bg-dark-700 rounded mb-4">
          <div class="flex items-center justify-between">
            <span id="current-price" class="text-lg font-bold text-accent-green">$0.00</span>
            <span id="price-change" class="text-sm text-accent-green">+0.00%</span>
          </div>
          <div class="text-xs text-text-secondary mt-1">≈ $0.00</div>
        </div>
        
        <!-- Bids (Buy Orders) -->
        <div class="bids-container">
          <div id="bids-list" class="space-y-1">
            <!-- Bids will be populated here -->
          </div>
        </div>
      </div>
    `;
  }

  loadData() {
    // Get initial order book data
    this.orderBookData = mockDataService.getOrderBook('BTCUSDT');
    this.updateOrderBook();
    
    // Get current price
    const currentPrice = mockDataService.getCurrentPrice('BTCUSDT');
    this.updateCurrentPrice(currentPrice);
  }

  setupEventListeners() {
    // Subscribe to real-time order book updates
    mockDataService.subscribe('orderbook', (data) => {
      if (data.symbol === 'BTCUSDT') {
        this.orderBookData = data;
        this.updateOrderBook();
      }
    });

    // Subscribe to price updates
    mockDataService.subscribe('price', (data) => {
      if (data.symbol === 'BTCUSDT') {
        this.updateCurrentPrice(data);
      }
    });
  }

  updateOrderBook() {
    this.updateAsks();
    this.updateBids();
  }

  updateAsks() {
    const asksList = this.container.querySelector('#asks-list');
    const asks = this.orderBookData.asks.slice(0, 10); // Show top 10 asks
    
    asksList.innerHTML = asks.map(ask => {
      const price = parseFloat(ask.price);
      const amount = parseFloat(ask.amount);
      const total = (price * amount).toFixed(2);
      const percentage = (amount / this.getMaxAmount()) * 100;
      
      return `
        <div class="relative grid grid-cols-3 gap-2 text-xs py-1 px-2 hover:bg-dark-700 rounded transition-colors">
          <div class="absolute inset-0 bg-accent-red bg-opacity-10 rounded" style="width: ${percentage}%"></div>
          <div class="relative text-accent-red font-mono">${this.formatPrice(price)}</div>
          <div class="relative text-right text-text-primary font-mono">${this.formatAmount(amount)}</div>
          <div class="relative text-right text-text-secondary font-mono">${total}</div>
        </div>
      `;
    }).join('');
  }

  updateBids() {
    const bidsList = this.container.querySelector('#bids-list');
    const bids = this.orderBookData.bids.slice(0, 10); // Show top 10 bids
    
    bidsList.innerHTML = bids.map(bid => {
      const price = parseFloat(bid.price);
      const amount = parseFloat(bid.amount);
      const total = (price * amount).toFixed(2);
      const percentage = (amount / this.getMaxAmount()) * 100;
      
      return `
        <div class="relative grid grid-cols-3 gap-2 text-xs py-1 px-2 hover:bg-dark-700 rounded transition-colors">
          <div class="absolute inset-0 bg-accent-green bg-opacity-10 rounded" style="width: ${percentage}%"></div>
          <div class="relative text-accent-green font-mono">${this.formatPrice(price)}</div>
          <div class="relative text-right text-text-primary font-mono">${this.formatAmount(amount)}</div>
          <div class="relative text-right text-text-secondary font-mono">${total}</div>
        </div>
      `;
    }).join('');
  }

  updateCurrentPrice(priceData) {
    const currentPriceEl = this.container.querySelector('#current-price');
    const priceChangeEl = this.container.querySelector('#price-change');
    
    if (currentPriceEl && priceChangeEl) {
      currentPriceEl.textContent = `$${this.formatPrice(priceData.price)}`;
      
      const changePercent = priceData.change24h;
      const isPositive = changePercent >= 0;
      
      priceChangeEl.textContent = `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`;
      priceChangeEl.className = `text-sm ${isPositive ? 'text-accent-green' : 'text-accent-red'}`;
      currentPriceEl.className = `text-lg font-bold ${isPositive ? 'text-accent-green' : 'text-accent-red'}`;
    }
  }

  getMaxAmount() {
    const allAmounts = [
      ...this.orderBookData.asks.map(ask => parseFloat(ask.amount)),
      ...this.orderBookData.bids.map(bid => parseFloat(bid.amount))
    ];
    return Math.max(...allAmounts);
  }

  formatPrice(price) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  formatAmount(amount) {
    return amount.toFixed(6);
  }
}

export default OrderBook;