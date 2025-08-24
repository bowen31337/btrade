import { UserOrders } from './UserOrders.js';

class UserOrdersPanel {
  constructor(container) {
    this.container = container;
    this.userOrders = null;
    this.init();
  }

  init() {
    this.render();
    this.initializeComponents();
  }

  render() {
    this.container.innerHTML = `
      <div class="h-full flex flex-col bg-gray-900 text-white">
        <!-- Panel Header -->
        <div class="border-b border-gray-700 p-3 bg-gray-800">
          <h3 class="text-sm font-semibold text-gray-200">Open Orders</h3>
        </div>
        
        <!-- Panel Content -->
        <div class="flex-1 overflow-hidden">
          <div id="user-orders-content" class="h-full">
            <!-- UserOrders component will be rendered here -->
          </div>
        </div>
      </div>
    `;
  }

  initializeComponents() {
    const userOrdersContainer = this.container.querySelector('#user-orders-content');
    if (userOrdersContainer) {
      this.userOrders = new UserOrders(userOrdersContainer);
      this.userOrders.init();
    }
  }

  destroy() {
    if (this.userOrders && typeof this.userOrders.destroy === 'function') {
      this.userOrders.destroy();
    }
  }
}

export default UserOrdersPanel;