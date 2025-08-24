import OrderBook from './OrderBook.js';

class OrderBookPanel {
  constructor(container) {
    this.container = container;
    this.orderBook = null;
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
          <h3 class="text-sm font-semibold text-text-primary">Order Book</h3>
        </div>
        
        <!-- Panel Content -->
        <div class="flex-1 overflow-hidden">
          <div id="order-book-content" class="h-full">
            <!-- OrderBook component will be rendered here -->
          </div>
        </div>
      </div>
    `;
  }

  initializeComponents() {
    const orderBookContainer = this.container.querySelector('#order-book-content');
    if (orderBookContainer) {
      this.orderBook = new OrderBook(orderBookContainer);
    }
  }

  destroy() {
    if (this.orderBook && typeof this.orderBook.destroy === 'function') {
      this.orderBook.destroy();
    }
  }
}

export default OrderBookPanel;