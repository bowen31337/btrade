import TradingPairSelector from './TradingPairSelector.js';

class AssetListPanel {
  constructor(container) {
    this.container = container;
    this.tradingPairSelector = null;
    this.init();
  }

  init() {
    this.render();
    this.initializeComponents();
  }

  render() {
    this.container.innerHTML = `
      <div class="asset-list-panel h-full bg-gray-900 text-white flex flex-col">
        <!-- Header -->
        <div class="p-3 border-b border-gray-700 bg-gray-800">
          <h2 class="text-sm font-semibold text-gray-200">Trading Pairs</h2>
        </div>
        
        <!-- Trading Pair Selector -->
        <div class="trading-pair-selector-container flex-1 overflow-hidden">
          <!-- TradingPairSelector will be mounted here -->
        </div>
      </div>
    `;
  }

  initializeComponents() {
    const tradingPairSelectorContainer = this.container.querySelector('.trading-pair-selector-container');
    if (tradingPairSelectorContainer) {
      this.tradingPairSelector = new TradingPairSelector(tradingPairSelectorContainer);
    }
  }

  destroy() {
    if (this.tradingPairSelector && typeof this.tradingPairSelector.destroy === 'function') {
      this.tradingPairSelector.destroy();
    }
  }
}

export default AssetListPanel;