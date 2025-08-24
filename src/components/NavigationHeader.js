import { mockDataService } from '../services/mockDataService.js';

class NavigationHeader {
  constructor(container) {
    this.container = container;
    this.currentPair = null;
    this.currentPrice = null;
    this.init();
  }

  init() {
    this.render();
    this.loadData();
    this.setupEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <header class="bg-primary-surface border-b border-primary-border px-4 sm:px-6 py-4">
        <div class="flex items-center justify-between flex-wrap">
          <!-- Logo and Brand -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-accent-warning rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">B</span>
              </div>
              <h1 class="text-xl font-bold text-text-primary">BTrade</h1>
            </div>
          </div>

          <!-- Spacer for mobile -->
          <div class="w-full sm:hidden h-4"></div>

          <!-- Current Trading Pair Info -->
          <div class="flex items-center space-x-2 sm:space-x-6 order-3 sm:order-2 w-full sm:w-auto justify-between sm:justify-start">
            <div class="flex items-center space-x-2 sm:space-x-4">
              <div class="text-right">
                <div class="flex items-center space-x-2">
                  <span id="current-pair" class="text-base sm:text-lg font-semibold text-text-primary">BTC/USDT</span>
                  <span id="price-change" class="text-sm px-2 py-1 rounded bg-success-bg text-success-text">+2.45%</span>
                </div>
                <div class="flex items-center space-x-2 mt-1">
                  <span id="current-price" class="text-xl sm:text-2xl font-bold text-text-primary">$45,234.56</span>
                  <span class="text-sm text-text-secondary hidden md:block">≈ $45,234.56</span>
                </div>
              </div>
            </div>

            <!-- Navigation Menu -->
            <nav class="hidden md:flex items-center space-x-6">
              <a href="#" class="text-text-primary hover:text-accent-warning transition-colors font-medium">Trade</a>
                <a href="#" class="text-text-secondary hover:text-accent-warning transition-colors font-medium">Markets</a>
                <a href="#" class="text-text-secondary hover:text-accent-warning transition-colors font-medium">Portfolio</a>
                <a href="#" class="text-text-secondary hover:text-accent-warning transition-colors font-medium">History</a>
            </nav>
          </div>

          <!-- User Actions -->
          <div class="flex items-center space-x-3 order-2 sm:order-3">
            <button class="px-3 sm:px-4 py-2 bg-accent-warning text-white rounded-lg hover:bg-accent-warning transition-colors font-medium text-sm sm:text-base">
              Connect Wallet
            </button>
            <button class="p-2 text-text-secondary hover:text-text-primary transition-colors md:hidden" id="mobile-menu-button">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
            <button class="hidden md:block p-2 text-text-secondary hover:text-text-primary transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
            </button>
          </div>
        </div>
        <!-- Mobile Menu -->
        <div id="mobile-menu" class="hidden md:hidden mt-4">
            <nav class="flex flex-col space-y-2">
                <a href="#" class="text-text-primary hover:text-accent-warning transition-colors font-medium p-2 rounded-md bg-primary-bg">Trade</a>
                <a href="#" class="text-text-secondary hover:text-accent-warning transition-colors font-medium p-2 rounded-md">Markets</a>
                <a href="#" class="text-text-secondary hover:text-accent-warning transition-colors font-medium p-2 rounded-md">Portfolio</a>
                <a href="#" class="text-text-secondary hover:text-accent-warning transition-colors font-medium p-2 rounded-md">History</a>
            </nav>
        </div>
      </header>
    `;
  }

  loadData() {
    // Load current trading pair
    this.currentPair = mockDataService.getCurrentTradingPair();
    
    // Load current price data
    this.currentPrice = mockDataService.getCurrentPrice(this.currentPair);
    
    this.updateDisplay();
  }

  updateDisplay() {
    if (!this.currentPair || !this.currentPrice) return;

    const pairElement = this.container.querySelector('#current-pair');
    const priceElement = this.container.querySelector('#current-price');
    const changeElement = this.container.querySelector('#price-change');

    if (pairElement) {
      pairElement.textContent = this.currentPair;
    }

    if (priceElement && this.currentPrice.price) {
      priceElement.textContent = `$${parseFloat(this.currentPrice.price).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }

    if (changeElement && this.currentPrice.change24h !== undefined) {
      const change = parseFloat(this.currentPrice.change24h);
      const isPositive = change >= 0;
      
      changeElement.textContent = `${isPositive ? '+' : ''}${change.toFixed(2)}%`;
      changeElement.className = `text-sm px-2 py-1 rounded ${
        isPositive 
          ? 'bg-success-bg text-success-text' 
          : 'bg-danger-bg text-danger-text'
      }`;
    }
  }

  setupEventListeners() {
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
        this.updateDisplay();
      }
    });

    // Add click handlers for navigation
    const navLinks = this.container.querySelectorAll('nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(l => {
            l.classList.remove('text-accent-warning', 'bg-primary-bg', 'text-text-primary');
            l.classList.add('text-text-secondary');
        });
        
        // Add active class to clicked link
        link.classList.remove('text-text-secondary');
        link.classList.add('text-text-primary');
        if(link.closest('#mobile-menu')) {
            link.classList.add('bg-primary-bg');
        } else {
            link.classList.add('text-accent-warning');
        }
      });
    });

    // Set Trade as active by default
    const tradeLink = this.container.querySelector('nav a:not([id^="mobile-menu"])');
    if (tradeLink) {
      tradeLink.classList.remove('text-text-secondary');
      tradeLink.classList.add('text-accent-warning');
    }
    const mobileTradeLink = this.container.querySelector('#mobile-menu a');
    if (mobileTradeLink) {
        mobileTradeLink.classList.add('bg-primary-bg');
        mobileTradeLink.classList.add('text-text-primary');
        mobileTradeLink.classList.remove('text-text-secondary');
    }

    // Mobile menu toggle
    const mobileMenuButton = this.container.querySelector('#mobile-menu-button');
    const mobileMenu = this.container.querySelector('#mobile-menu');
    if(mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Connect wallet button
    const connectWalletButton = this.container.querySelector('button.bg-accent-warning');
    if (connectWalletButton) {
      connectWalletButton.addEventListener('click', () => {
        console.log('Connect Wallet button clicked');
        // Placeholder for wallet connection logic
      });
    }
  }

  // Method to update trading pair from external components
  updateTradingPair(pair) {
    this.currentPair = pair;
    this.currentPrice = mockDataService.getCurrentPrice(pair);
    this.updateDisplay();
  }
}

export default NavigationHeader;