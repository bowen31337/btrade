import { mockDataService } from '../services/mockDataService.js';
import NavigationHeader from './NavigationHeader.js';
import AssetListPanel from './AssetListPanel.js';
import PriceChartPanel from './PriceChartPanel.js';
import OrderBookPanel from './OrderBookPanel.js';
import MarketTradesPanel from './MarketTradesPanel.js';
import { OrderForm } from './OrderForm.js';
import UserOrdersPanel from './UserOrdersPanel.js';

class MainLayout {
  constructor() {
    this.container = null;
    this.currentPair = mockDataService.getCurrentTradingPair();
    this.init();
    this.navigationHeaderObserver = null;
  }

  init() {
    this.render();
    this.bindEvents();
    // Initialize components
    this.initializeComponents();
    // Start real-time updates
    mockDataService.startPriceUpdates();
    this.observeNavigationHeader();
  }

  render() {
    const app = document.querySelector('#app');
    app.innerHTML = `
      <div class="min-h-screen bg-primary-bg text-text-primary">
        <!-- Top Navigation -->
        <div id="navigation-header-container">
          <!-- NavigationHeader component will be rendered here -->
        </div>

        <!-- Main Content Grid -->
        <div id="main-content-grid" class="grid grid-cols-12 gap-1 absolute w-full" style="top: 73px; height: calc(100vh - 73px);">
          <!-- Left Panel - Asset List and User Orders -->
          <div class="col-span-12 sm:col-span-2 flex flex-col">
            <!-- Asset List Panel -->
            <div class="flex-1 min-h-0">
              <div id="trading-pair-selector-container" class="h-full">
                <!-- AssetListPanel component will be rendered here -->
              </div>
            </div>
            
            <!-- User Orders Panel -->
            <div class="h-64 border-t border-gray-700">
              <div id="user-orders-container" class="h-full">
                <!-- UserOrdersPanel component will be rendered here -->
              </div>
            </div>
          </div>

          <!-- Center Panel - Chart and Order Form -->
          <div class="col-span-12 sm:col-span-7 flex flex-col">
            <!-- Trading Pair Info -->
            <div class="bg-primary-surface border border-primary-border p-4 hidden sm:block">
              <div class="flex items-center space-x-6">
                <div class="flex items-center space-x-2">
                  <h2 class="text-lg font-bold" id="current-pair-symbol">${this.currentPair.symbol}</h2>
                  <span class="text-xs text-text-secondary">${this.currentPair.baseAsset}/${this.currentPair.quoteAsset}</span>
                </div>
                <div class="flex items-center space-x-4 text-sm">
                  <div>
                    <span class="text-text-secondary">Price:</span>
                    <span class="text-text-primary font-medium ml-1" id="current-price">$${this.currentPair.price.toLocaleString()}</span>
                  </div>
                  <div>
                    <span class="text-text-secondary">24h Change:</span>
                    <span class="ml-1 ${this.currentPair.change24h >= 0 ? 'text-accent-buy' : 'text-accent-sell'}" id="current-change">
                      ${this.currentPair.change24h >= 0 ? '+' : ''}${this.currentPair.change24h.toFixed(2)}%
                    </span>
                  </div>
                  <div>
                    <span class="text-text-secondary">24h High:</span>
                    <span class="text-text-primary ml-1">$${(this.currentPair.price * 1.05).toLocaleString()}</span>
                  </div>
                  <div>
                    <span class="text-text-secondary">24h Low:</span>
                    <span class="text-text-primary ml-1">$${(this.currentPair.price * 0.95).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chart Panel -->
            <div class="flex-1">
              <div id="price-chart-container" class="h-full">
                <!-- PriceChartPanel component will be rendered here -->
              </div>
            </div>

            <!-- Order Form -->
            <div class="bg-primary-surface border border-primary-border p-4">
              <div id="order-form-container" class="h-full">
                <!-- OrderForm component will be rendered here -->
              </div>
            </div>
          </div>

          <!-- Right Panel - Order Book and Trades -->
          <div class="col-span-12 sm:col-span-3 flex flex-col">
            <!-- Order Book Panel -->
            <div class="flex-1">
              <div id="order-book-container" class="h-full">
                <!-- OrderBookPanel component will be rendered here -->
              </div>
            </div>

            <!-- Market Trades Panel -->
            <div class="flex-1">
              <div id="market-trades-container" class="h-full">
                <!-- MarketTradesPanel component will be rendered here -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.container = app.querySelector('.min-h-screen');
  }

  initializeComponents() {
    // Initialize NavigationHeader component
    const navigationHeaderContainer = document.querySelector('#navigation-header-container');
    if (navigationHeaderContainer) {
      this.navigationHeader = new NavigationHeader(navigationHeaderContainer);
    }
    
    // Initialize AssetListPanel component
    const assetListPanelContainer = document.querySelector('#trading-pair-selector-container');
    if (assetListPanelContainer) {
      this.assetListPanel = new AssetListPanel(assetListPanelContainer);
    }
    
    // Initialize PriceChartPanel component
    const priceChartPanelContainer = document.querySelector('#price-chart-container');
    if (priceChartPanelContainer) {
      this.priceChartPanel = new PriceChartPanel(priceChartPanelContainer);
    }
    
    // Initialize OrderForm component
    const orderFormContainer = document.querySelector('#order-form-container');
    if (orderFormContainer) {
      this.orderForm = new OrderForm(orderFormContainer);
    }
    
    // Initialize OrderBookPanel component
    const orderBookPanelContainer = document.querySelector('#order-book-container');
    if (orderBookPanelContainer) {
      this.orderBookPanel = new OrderBookPanel(orderBookPanelContainer);
    }
    
    // Initialize MarketTradesPanel component
    const marketTradesPanelContainer = document.querySelector('#market-trades-container');
    if (marketTradesPanelContainer) {
      this.marketTradesPanel = new MarketTradesPanel(marketTradesPanelContainer);
    }
    
    // Initialize UserOrdersPanel component
     const userOrdersPanelContainer = document.querySelector('#user-orders-container');
     if (userOrdersPanelContainer) {
       this.userOrdersPanel = new UserOrdersPanel(userOrdersPanelContainer);
     }
  }

  observeNavigationHeader() {
    const navigationHeaderContainer = document.querySelector('#navigation-header-container');
    const mainContentGrid = document.querySelector('#main-content-grid');

    if (navigationHeaderContainer && mainContentGrid) {
      this.navigationHeaderObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const height = entry.contentRect.height;
          mainContentGrid.style.top = `${height}px`;
          mainContentGrid.style.height = `calc(100vh - ${height}px)`;
        }
      });

      this.navigationHeaderObserver.observe(navigationHeaderContainer);
    }
  }

  bindEvents() {
    // Trading pair selection
    document.addEventListener('click', (e) => {
      const pairElement = e.target.closest('.trading-pair');
      if (pairElement) {
        const symbol = pairElement.dataset.symbol;
        this.switchTradingPair(symbol);
      }
    });

    // Subscribe to price updates
    mockDataService.subscribe('priceUpdate', (pairs) => {
      this.updatePrices(pairs);
    });

    mockDataService.subscribe('tradingPairChanged', (pair) => {
      this.currentPair = pair;
      this.updateCurrentPairDisplay();
    });
  }

  switchTradingPair(symbol) {
    mockDataService.setCurrentTradingPair(symbol);
    
    // Update active state
    document.querySelectorAll('.trading-pair').forEach(el => {
      el.classList.remove('bg-primary-bg');
    });
    document.querySelector(`[data-symbol="${symbol}"]`).classList.add('bg-primary-bg');
  }

  updateCurrentPairDisplay() {
    document.getElementById('current-pair-symbol').textContent = this.currentPair.symbol;
    document.getElementById('current-price').textContent = `$${this.currentPair.price.toLocaleString()}`;
    
    const changeElement = document.getElementById('current-change');
    changeElement.textContent = `${this.currentPair.change24h >= 0 ? '+' : ''}${this.currentPair.change24h.toFixed(2)}%`;
    changeElement.className = `ml-1 ${this.currentPair.change24h >= 0 ? 'text-accent-buy' : 'text-accent-sell'}`;
  }

  updatePrices(pairs) {
    // Update trading pairs list
    pairs.forEach(pair => {
      const pairElement = document.querySelector(`[data-symbol="${pair.symbol}"]`);
      if (pairElement) {
        const priceElement = pairElement.querySelector('.text-sm.text-text-primary');
        const changeElement = pairElement.querySelector('.text-xs');
        
        if (priceElement) priceElement.textContent = `$${pair.price.toLocaleString()}`;
        if (changeElement) {
          changeElement.textContent = `${pair.change24h >= 0 ? '+' : ''}${pair.change24h.toFixed(2)}%`;
          changeElement.className = `text-xs ${pair.change24h >= 0 ? 'text-accent-buy' : 'text-accent-sell'}`;
        }
      }
    });

    // Update current pair if it matches
    const currentPairUpdate = pairs.find(p => p.symbol === this.currentPair.symbol);
    if (currentPairUpdate) {
      this.currentPair = currentPairUpdate;
      this.updateCurrentPairDisplay();
    }
  }
}

export default MainLayout;