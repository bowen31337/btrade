import { mockDataService } from '../services/mockDataService.js';

export class UserOrders {
  constructor(container) {
    this.container = container;
    this.activeTab = 'open'; // 'open', 'history', 'trades'
    this.orders = [];
    this.orderHistory = [];
    this.tradeHistory = [];
  }

  init() {
    this.loadData();
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="user-orders-panel h-full flex flex-col bg-gray-900 text-white">
        <!-- Tab Navigation -->
        <div class="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
          <div class="flex space-x-4">
            <button id="open-tab" class="text-xs pb-1 user-orders-tab ${this.activeTab === 'open' ? 'active' : 'text-gray-400 hover:text-white'}">
              Open Orders
            </button>
            <button id="history-tab" class="text-xs pb-1 user-orders-tab ${this.activeTab === 'history' ? 'active' : 'text-gray-400 hover:text-white'}">
              Order History
            </button>
            <button id="trades-tab" class="text-xs pb-1 user-orders-tab ${this.activeTab === 'trades' ? 'active' : 'text-gray-400 hover:text-white'}">
              Trade History
            </button>
          </div>
          <button id="hide-all-btn" class="text-xs text-gray-400 hover:text-white">
            Hide All
          </button>
        </div>

        <!-- Content Area -->
        <div id="orders-content" class="orders-content flex-1 overflow-y-auto p-1 min-h-0">
          ${this.renderContent()}
        </div>
      </div>
    `;
  }

  renderContent() {
    switch (this.activeTab) {
      case 'open':
        return this.renderOpenOrders();
      case 'history':
        return this.renderOrderHistory();
      case 'trades':
        return this.renderTradeHistory();
      default:
        return this.renderOpenOrders();
    }
  }

  renderOpenOrders() {
    if (this.orders.length === 0) {
      return `
        <div class="text-center text-gray-400 py-6">
          <div class="text-lg mb-2">📋</div>
          <div class="text-xs">No Open Orders</div>
          <div class="text-xs mt-1 text-gray-500">Your active orders will appear here</div>
        </div>
      `;
    }

    return `
      <div class="orders-table h-full">
        <!-- Desktop header -->
        <div class="orders-header hidden lg:grid grid-cols-7 gap-3 text-xs text-gray-400 font-semibold mb-2 px-2 py-1.5 bg-gray-800 rounded border border-gray-700">
          <div>Date</div>
          <div>Pair</div>
          <div>Type</div>
          <div>Side</div>
          <div>Amount</div>
          <div>Price</div>
          <div class="text-center">Action</div>
        </div>
        <!-- Tablet header -->
        <div class="orders-header hidden md:grid lg:hidden grid-cols-4 gap-3 text-xs text-gray-400 font-semibold mb-2 px-2 py-1.5 bg-gray-800 rounded border border-gray-700">
          <div>Order Info</div>
          <div class="text-center">Type</div>
          <div class="text-right">Details</div>
          <div class="text-center">Action</div>
        </div>
        <!-- Mobile: No header needed as we use card layout -->
        <div class="orders-list space-y-1">
          ${this.orders.map(order => this.renderOrderRow(order)).join('')}
        </div>
      </div>
    `;
  }

  renderOrderHistory() {
    if (this.orderHistory.length === 0) {
      return `
        <div class="text-center text-gray-400 py-8">
          <div class="text-2xl mb-3">📜</div>
          <div class="text-sm font-medium">No Order History</div>
          <div class="text-xs mt-2 text-gray-500">Your completed orders will appear here</div>
        </div>
      `;
    }

    return `
      <div class="orders-table">
        <!-- Desktop header -->
        <div class="orders-header hidden lg:grid grid-cols-6 gap-3 text-xs text-gray-400 font-semibold mb-3 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700">
          <div>Date</div>
          <div>Pair</div>
          <div>Type</div>
          <div>Side</div>
          <div>Amount</div>
          <div class="text-center">Status</div>
        </div>
        <!-- Tablet header -->
        <div class="orders-header hidden md:grid lg:hidden grid-cols-4 gap-3 text-xs text-gray-400 font-semibold mb-3 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700">
          <div>Order Info</div>
          <div class="text-center">Type</div>
          <div class="text-right">Amount</div>
          <div class="text-center">Status</div>
        </div>
        <div class="orders-list">
          ${this.orderHistory.map(order => this.renderHistoryRow(order)).join('')}
        </div>
      </div>
    `;
  }

  renderTradeHistory() {
    if (this.tradeHistory.length === 0) {
      return `
        <div class="text-center text-gray-400 py-8">
          <div class="text-2xl mb-3">💱</div>
          <div class="text-sm font-medium">No Trade History</div>
          <div class="text-xs mt-2 text-gray-500">Your executed trades will appear here</div>
        </div>
      `;
    }

    return `
      <div class="orders-table">
        <!-- Desktop header -->
        <div class="orders-header hidden lg:grid grid-cols-6 gap-3 text-xs text-gray-400 font-semibold mb-3 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700">
          <div>Date</div>
          <div>Pair</div>
          <div>Side</div>
          <div>Amount</div>
          <div>Price</div>
          <div class="text-center">Fee</div>
        </div>
        <!-- Tablet header -->
        <div class="orders-header hidden md:grid lg:hidden grid-cols-4 gap-3 text-xs text-gray-400 font-semibold mb-3 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700">
          <div>Trade Info</div>
          <div class="text-center">Side</div>
          <div class="text-right">Amount</div>
          <div class="text-center">Fee</div>
        </div>
        <div class="orders-list">
          ${this.tradeHistory.map(trade => this.renderTradeRow(trade)).join('')}
        </div>
      </div>
    `;
  }

  renderOrderRow(order) {
    return `
      <!-- Desktop layout -->
      <div class="order-row hidden lg:grid grid-cols-7 gap-2 text-sm py-2 px-2 hover:bg-gray-800 rounded border border-gray-700 hover:border-gray-600 mb-1 transition-all duration-200">
        <div class="text-gray-300 truncate text-xs">${this.formatDate(order.timestamp)}</div>
        <div class="text-white font-semibold text-sm truncate">${order.symbol}</div>
        <div class="text-blue-400 capitalize font-medium text-xs">${order.type}</div>
        <div class="${order.side === 'buy' ? 'text-green-400' : 'text-red-400'} font-bold capitalize text-sm">
          ${order.side}
        </div>
        <div class="text-gray-300 font-mono text-xs truncate">${order.amount} ${order.baseAsset}</div>
        <div class="text-gray-300 font-mono text-xs truncate">$${order.price.toLocaleString()}</div>
        <div class="flex justify-end">
          <button class="cancel-order-btn text-red-400 hover:text-white text-xs px-2 py-1 bg-red-500 bg-opacity-20 hover:bg-opacity-100 border border-red-500 rounded transition-all duration-200 font-medium" 
                  data-order-id="${order.id}">
            Cancel
          </button>
        </div>
      </div>
      
      <!-- Tablet layout -->
      <div class="order-row hidden md:grid lg:hidden grid-cols-4 gap-2 text-sm py-2 px-2 hover:bg-gray-800 rounded border border-gray-700 hover:border-gray-600 mb-1 transition-all duration-200">
        <div class="space-y-0.5">
          <div class="text-white font-semibold text-sm truncate">${order.symbol}</div>
          <div class="text-gray-400 text-xs">${this.formatDate(order.timestamp)}</div>
        </div>
        <div class="text-center">
          <div class="${order.side === 'buy' ? 'text-green-400' : 'text-red-400'} font-bold capitalize text-sm">${order.side}</div>
          <div class="text-blue-400 capitalize text-xs">${order.type}</div>
        </div>
        <div class="text-right space-y-0.5">
          <div class="text-gray-300 font-mono text-xs">${order.amount} ${order.baseAsset}</div>
          <div class="text-gray-300 font-mono text-xs">$${order.price.toLocaleString()}</div>
        </div>
        <div class="flex justify-end">
          <button class="cancel-order-btn text-red-400 hover:text-white text-xs px-2 py-1 bg-red-500 bg-opacity-20 hover:bg-opacity-100 border border-red-500 rounded transition-all duration-200" 
                  data-order-id="${order.id}">
            Cancel
          </button>
        </div>
      </div>
      
      <!-- Mobile layout -->
      <div class="order-row md:hidden bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-gray-600 p-3 mb-2 transition-all duration-200">
        <div class="flex justify-between items-start mb-2">
          <div class="flex-1 min-w-0">
            <div class="text-white font-semibold text-sm mb-1 truncate">${order.symbol}</div>
            <div class="text-gray-400 text-xs">${this.formatDate(order.timestamp)}</div>
          </div>
          <div class="text-right ml-3 flex-shrink-0">
            <div class="${order.side === 'buy' ? 'text-green-400' : 'text-red-400'} font-bold capitalize text-sm">${order.side}</div>
            <div class="text-blue-400 capitalize text-xs">${order.type}</div>
          </div>
        </div>
        <div class="bg-gray-750 rounded p-2 space-y-1.5 mb-2">
          <div class="flex justify-between text-xs">
            <span class="text-gray-400">Amount:</span>
            <span class="text-white font-mono truncate ml-2">${order.amount} ${order.baseAsset}</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-gray-400">Price:</span>
            <span class="text-white font-mono truncate ml-2">$${order.price.toLocaleString()}</span>
          </div>
        </div>
        <div class="flex justify-center">
          <button class="cancel-order-btn text-red-400 hover:text-white text-xs px-3 py-1.5 bg-red-500 bg-opacity-20 hover:bg-opacity-100 border border-red-500 rounded transition-all duration-200 font-medium w-full" 
                  data-order-id="${order.id}">
            Cancel
          </button>
        </div>
      </div>
    `;
  }

  renderHistoryRow(order) {
    return `
      <!-- Desktop layout -->
      <div class="order-row hidden md:grid grid-cols-6 gap-4 text-sm py-2 px-2 hover:bg-primary-hover rounded">
        <div class="text-text-secondary">${this.formatDate(order.timestamp)}</div>
        <div class="text-text-primary font-medium">${order.symbol}</div>
        <div class="text-text-secondary capitalize">${order.type}</div>
        <div class="${order.side === 'buy' ? 'text-accent-buy' : 'text-accent-sell'} font-medium capitalize">
          ${order.side}
        </div>
        <div class="text-text-primary">${order.amount} ${order.baseAsset}</div>
        <div class="text-text-secondary capitalize">
          <span class="${order.status === 'filled' ? 'text-green-500' : order.status === 'cancelled' ? 'text-red-500' : 'text-yellow-500'}">
            ${order.status}
          </span>
        </div>
      </div>
      <!-- Mobile layout -->
      <div class="order-row md:hidden grid grid-cols-2 gap-2 text-sm py-2 px-2 hover:bg-primary-hover rounded">
        <div>
          <div class="text-text-primary font-medium">${order.symbol}</div>
          <div class="${order.side === 'buy' ? 'text-accent-buy' : 'text-accent-sell'} font-medium text-xs capitalize">${order.side} ${order.type}</div>
          <div class="text-text-primary text-xs">${order.amount} ${order.baseAsset}</div>
          <div class="text-text-secondary text-xs">${this.formatDate(order.timestamp)}</div>
        </div>
        <div class="flex flex-col items-end">
          <span class="${order.status === 'filled' ? 'text-green-500' : order.status === 'cancelled' ? 'text-red-500' : 'text-yellow-500'} font-medium capitalize">
            ${order.status}
          </span>
        </div>
      </div>
    `;
  }

  renderTradeRow(trade) {
    return `
      <!-- Desktop layout -->
      <div class="trade-row hidden md:grid grid-cols-6 gap-4 text-sm py-2 px-2 hover:bg-primary-hover rounded">
        <div class="text-text-secondary">${this.formatDate(trade.timestamp)}</div>
        <div class="text-text-primary font-medium">${trade.symbol}</div>
        <div class="${trade.side === 'buy' ? 'text-accent-buy' : 'text-accent-sell'} font-medium capitalize">
          ${trade.side}
        </div>
        <div class="text-text-primary">${trade.amount} ${trade.baseAsset}</div>
        <div class="text-text-primary">$${trade.price.toLocaleString()}</div>
        <div class="text-text-secondary">$${trade.fee.toFixed(4)}</div>
      </div>
      <!-- Mobile layout -->
      <div class="trade-row md:hidden grid grid-cols-2 gap-2 text-sm py-2 px-2 hover:bg-primary-hover rounded">
        <div>
          <div class="text-text-primary font-medium">${trade.symbol}</div>
          <div class="${trade.side === 'buy' ? 'text-accent-buy' : 'text-accent-sell'} font-medium text-xs capitalize">${trade.side}</div>
          <div class="text-text-secondary text-xs">${this.formatDate(trade.timestamp)}</div>
        </div>
        <div class="flex flex-col items-end">
          <div class="text-text-primary">${trade.amount} ${trade.baseAsset}</div>
          <div class="text-text-primary text-xs">@ $${trade.price.toLocaleString()}</div>
          <div class="text-text-secondary text-xs">Fee: $${trade.fee.toFixed(4)}</div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Tab switching
    const openTab = this.container.querySelector('#open-tab');
    const historyTab = this.container.querySelector('#history-tab');
    const tradesTab = this.container.querySelector('#trades-tab');
    const hideAllBtn = this.container.querySelector('#hide-all-btn');

    openTab?.addEventListener('click', () => this.switchTab('open'));
    historyTab?.addEventListener('click', () => this.switchTab('history'));
    tradesTab?.addEventListener('click', () => this.switchTab('trades'));
    hideAllBtn?.addEventListener('click', () => this.hidePanel());

    // Cancel order buttons
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('cancel-order-btn')) {
        const orderId = e.target.dataset.orderId;
        this.cancelOrder(orderId);
      }
    });

    // Listen for new orders from OrderForm
    mockDataService.subscribe('orderPlaced', (orderData) => {
      const newOrder = {
        id: `order_${Date.now()}`,
        symbol: orderData.symbol,
        baseAsset: orderData.symbol ? orderData.symbol.replace('USDT', '') : 'BTC',
        quoteAsset: 'USDT',
        side: orderData.side,
        type: orderData.type,
        amount: orderData.amount.toString(),
        price: orderData.price || 0,
        filled: '0.0000',
        status: 'open',
        timestamp: orderData.timestamp
      };
      
      this.addOrder(newOrder);
    });
  }

  switchTab(tab) {
    this.activeTab = tab;
    this.updateTabStyles();
    this.updateContent();
  }

  updateTabStyles() {
    const tabs = this.container.querySelectorAll('.user-orders-tab');
    tabs.forEach(tab => {
      tab.classList.remove('active', 'text-white', 'border-b-2', 'border-yellow-500');
      tab.classList.add('text-gray-400');
      if (tab.id === `${this.activeTab}-tab`) {
        tab.classList.add('active', 'text-white', 'border-b-2', 'border-yellow-500');
        tab.classList.remove('text-gray-400');
      }
    });
  }

  updateContent() {
    const contentArea = this.container.querySelector('#orders-content');
    if (contentArea) {
      contentArea.innerHTML = this.renderContent();
    }
  }

  loadData() {
    // Load mock data for demonstration
    this.orders = mockDataService.getUserOrders();
    this.orderHistory = mockDataService.getOrderHistory();
    this.tradeHistory = mockDataService.getTradeHistory();
  }

  cancelOrder(orderId) {
    // Find and remove the order
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      const cancelledOrder = this.orders.splice(orderIndex, 1)[0];
      cancelledOrder.status = 'cancelled';
      cancelledOrder.timestamp = Date.now();
      this.orderHistory.unshift(cancelledOrder);
      
      // Update display
      this.updateContent();
      
      // Show notification (you could implement a toast notification system)
      console.log(`Order ${orderId} cancelled successfully`);
    }
  }

  hidePanel() {
    // This could minimize the panel or hide it completely
    this.container.style.display = 'none';
  }

  showPanel() {
    this.container.style.display = 'block';
  }

  addOrder(order) {
    // Add new order to the list
    this.orders.unshift(order);
    if (this.activeTab === 'open') {
      this.updateContent();
    }
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  // Method to refresh data
  refresh() {
    this.loadData();
    this.updateContent();
  }
}

export default UserOrders;