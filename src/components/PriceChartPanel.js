import PriceChart from './PriceChart.js';

class PriceChartPanel {
  constructor(container) {
    this.container = container;
    this.priceChart = null;
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
          <h3 class="text-sm font-semibold text-text-primary">Price Chart</h3>
        </div>
        
        <!-- Panel Content -->
        <div class="flex-1 overflow-hidden">
          <div id="price-chart-content" class="h-full">
            <!-- PriceChart component will be rendered here -->
          </div>
        </div>
      </div>
    `;
  }

  initializeComponents() {
    const priceChartContainer = this.container.querySelector('#price-chart-content');
    if (priceChartContainer) {
      this.priceChart = new PriceChart(priceChartContainer);
    }
  }

  destroy() {
    if (this.priceChart && typeof this.priceChart.destroy === 'function') {
      this.priceChart.destroy();
    }
  }
}

export default PriceChartPanel;