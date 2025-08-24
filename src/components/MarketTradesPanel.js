import MarketTrades from './MarketTrades.js';

class MarketTradesPanel {
  constructor(container) {
    this.container = container;
    this.marketTrades = null;
    this.init();
  }

  init() {
    this.render();
    this.initializeComponents();
  }

  render() {
    this.container.innerHTML = `
      <div class="h-full flex flex-col bg-primary-surface border border-primary-border">
        <!-- Panel Header -->
        <div class="border-b border-primary-border p-3">
          <h3 class="text-sm font-semibold text-text-primary">Market Trades</h3>
        </div>
        
        <!-- Panel Content -->
        <div class="flex-1 overflow-hidden">
          <div id="market-trades-content" class="h-full">
            <!-- MarketTrades component will be rendered here -->
          </div>
        </div>
      </div>
    `;
  }

  initializeComponents() {
    const marketTradesContainer = this.container.querySelector('#market-trades-content');
    if (marketTradesContainer) {
      this.marketTrades = new MarketTrades(marketTradesContainer);
    }
  }

  destroy() {
    if (this.marketTrades && typeof this.marketTrades.destroy === 'function') {
      this.marketTrades.destroy();
    }
  }
}

export default MarketTradesPanel;