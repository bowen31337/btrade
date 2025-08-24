import { mockDataService } from '../services/mockDataService.js';

class MarketTrades {
  constructor(container) {
    this.container = container;
    this.trades = [];
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
          <h3 class="text-text-primary font-semibold">Market Trades</h3>
          <div class="text-xs text-text-secondary">
            Real-time
          </div>
        </div>
        
        <!-- Header -->
        <div class="grid grid-cols-3 gap-2 text-xs text-text-secondary mb-2 px-2">
          <div class="text-left">Price (USDT)</div>
          <div class="text-right">Amount (BTC)</div>
          <div class="text-right">Time</div>
        </div>
        
        <!-- Trades List -->
        <div id="trades-list" class="space-y-1 max-h-96 overflow-y-auto">
          <!-- Trades will be populated here -->
        </div>
      </div>
    `;
  }

  loadData() {
    // Get initial market trades data
    this.trades = mockDataService.getMarketTrades('BTCUSDT');
    this.updateTrades();
  }

  setupEventListeners() {
    // Subscribe to real-time market trades updates
    mockDataService.subscribe('trades', (data) => {
      if (data.symbol === 'BTCUSDT') {
        // Add new trade to the beginning of the list
        this.trades.unshift(data.trade);
        // Keep only the latest 50 trades
        this.trades = this.trades.slice(0, 50);
        this.updateTrades();
      }
    });
  }

  updateTrades() {
    const tradesList = this.container.querySelector('#trades-list');
    
    tradesList.innerHTML = this.trades.map((trade, index) => {
      const isBuy = trade.isBuy;
      const timeStr = this.formatTime(trade.timestamp);
      const fadeClass = index < 3 ? 'animate-pulse' : ''; // Highlight recent trades
      
      return `
        <div class="grid grid-cols-3 gap-2 text-xs py-1 px-2 hover:bg-dark-700 rounded transition-colors ${fadeClass}">
          <div class="text-left font-mono ${isBuy ? 'text-accent-green' : 'text-accent-red'}">
            ${this.formatPrice(parseFloat(trade.price))}
          </div>
          <div class="text-right text-text-primary font-mono">
            ${this.formatAmount(parseFloat(trade.amount))}
          </div>
          <div class="text-right text-text-secondary font-mono">
            ${timeStr}
          </div>
        </div>
      `;
    }).join('');
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

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffSecs < 60) {
      return `${diffSecs}s`;
    } else if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
}

export default MarketTrades;