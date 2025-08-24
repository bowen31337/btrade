import { mockDataService } from '../services/mockDataService.js';

class TradingPairSelector {
  constructor(container) {
    this.container = container;
    this.tradingPairs = [];
    this.currentPair = null;
    this.searchTerm = '';
    this.render();
    this.setupEventListeners();
    this.loadData();
  }

  render() {
    this.container.innerHTML = `
      <div class="h-full flex flex-col bg-gray-900 text-white">
        <!-- Search Input Section -->
        <div class="flex-none p-3 border-b border-gray-700 bg-gray-800">
          <div class="relative">
            <input 
              type="text" 
              id="pair-search" 
              placeholder="Search pairs..." 
              class="w-full bg-gray-700 text-white px-3 py-2 pr-8 rounded-md border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm placeholder-gray-400"
            >
            <svg class="absolute right-2 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Category Filter Section -->
        <div class="flex border-b border-gray-700 bg-gray-800">
          <button class="category-btn flex-1 px-3 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-700 border-b-2 border-transparent transition-colors duration-200 active" data-category="all">All</button>
          <button class="category-btn flex-1 px-3 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-700 border-b-2 border-transparent transition-colors duration-200" data-category="btc">BTC</button>
          <button class="category-btn flex-1 px-3 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-700 border-b-2 border-transparent transition-colors duration-200" data-category="eth">ETH</button>
          <button class="category-btn flex-1 px-3 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-700 border-b-2 border-transparent transition-colors duration-200" data-category="usdt">USDT</button>
        </div>

        <!-- Trading Pairs List Section -->
        <div class="flex-1 overflow-y-auto bg-gray-900">
          <div id="pairs-list" class="divide-y divide-gray-700">
            <!-- Trading pairs will be rendered here -->
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
      .category-btn.active {
        color: #fbbf24 !important;
        border-bottom-color: #fbbf24 !important;
        background-color: #374151 !important;
      }
      
      .pair-item:hover {
        background-color: #374151 !important;
      }
      
      .pair-item.active {
        background-color: #374151 !important;
        border-left: 3px solid #fbbf24;
      }
      
      .trading-pairs-list::-webkit-scrollbar {
        width: 6px;
      }
      
      .trading-pairs-list::-webkit-scrollbar-track {
        background: #1f2937;
      }
      
      .trading-pairs-list::-webkit-scrollbar-thumb {
        background: #4b5563;
        border-radius: 3px;
      }
      
      .trading-pairs-list::-webkit-scrollbar-thumb:hover {
        background: #6b7280;
      }
    `;
    document.head.appendChild(style);

    // Search functionality
    const searchInput = document.getElementById('pair-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.renderPairsList();
      });
    }

    // Category buttons
    const categoryButtons = this.container.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Update active state
        categoryButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Filter pairs
        this.currentCategory = e.target.dataset.category;
        this.renderPairsList();
      });
    });

    // Subscribe to price updates
    mockDataService.subscribe('priceUpdate', (data) => {
      this.updatePairPrices(data);
    });
  }

  loadData() {
    this.tradingPairs = mockDataService.getTradingPairs();
    this.currentPair = mockDataService.getCurrentTradingPair();
    this.currentCategory = 'all';
    this.renderPairsList();
  }

  renderPairsList() {
    const pairsList = document.getElementById('pairs-list');
    if (!pairsList) return;

    // Filter pairs based on search and category
    let filteredPairs = this.tradingPairs.filter(pair => {
      const matchesSearch = pair.symbol.toLowerCase().includes(this.searchTerm) ||
                           pair.baseAsset.toLowerCase().includes(this.searchTerm) ||
                           pair.quoteAsset.toLowerCase().includes(this.searchTerm);
      
      const matchesCategory = this.currentCategory === 'all' ||
                             pair.quoteAsset.toLowerCase() === this.currentCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort by volume (descending)
    filteredPairs.sort((a, b) => b.volume24h - a.volume24h);

    if (filteredPairs.length === 0) {
      pairsList.innerHTML = '<div class="p-4 text-center text-gray-400 text-sm">No trading pairs found</div>';
      return;
    }

    pairsList.innerHTML = filteredPairs.map(pair => {
      const isActive = this.currentPair && this.currentPair.symbol === pair.symbol;
      const priceChange = pair.priceChange24h || 0;
      const isPositive = priceChange >= 0;
      const changeClass = isPositive ? 'text-green-400' : 'text-red-400';
      
      return `
        <div class="pair-item cursor-pointer hover:bg-gray-800 transition-colors duration-200 p-3 border-b border-gray-700 last:border-b-0 ${isActive ? 'bg-gray-800' : ''}" data-symbol="${pair.symbol}">
          <div class="flex justify-between items-center">
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm text-white truncate">${pair.baseAsset}/${pair.quoteAsset}</div>
              <div class="text-xs text-gray-400 mt-0.5">Vol: ${this.formatVolume(pair.volume24h)}</div>
            </div>
            <div class="text-right ml-2">
              <div class="font-medium text-sm text-white">
                $${pair.price.toFixed(pair.price < 1 ? 6 : 2)}
              </div>
              <div class="text-xs font-medium ${changeClass} mt-0.5">
                ${isPositive ? '+' : ''}${priceChange.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Add click handlers for pair selection
    const pairItems = pairsList.querySelectorAll('.pair-item');
    pairItems.forEach(item => {
      item.addEventListener('click', () => {
        const symbol = item.dataset.symbol;
        this.selectPair(symbol);
      });
    });
  }

  selectPair(symbol) {
    const pair = this.tradingPairs.find(p => p.symbol === symbol);
    if (pair) {
      mockDataService.setCurrentTradingPair(pair);
      this.currentPair = pair;
      this.renderPairsList(); // Re-render to update active state
    }
  }

  updatePairPrices(priceData) {
    // Update the price display for the current pair
    if (priceData && priceData.symbol) {
      const pairItem = this.container.querySelector(`[data-symbol="${priceData.symbol}"]`);
      if (pairItem) {
        const priceElement = pairItem.querySelector('.font-mono');
        const changeElement = pairItem.querySelector('.text-xs.font-medium');
        
        if (priceElement) {
          priceElement.textContent = `$${priceData.price.toFixed(priceData.price < 1 ? 6 : 2)}`;
        }
        
        if (changeElement && priceData.change24h !== undefined) {
          const isPositive = priceData.change24h >= 0;
          changeElement.textContent = `${isPositive ? '+' : ''}${priceData.change24h.toFixed(2)}%`;
          changeElement.className = `text-xs font-medium ${
            isPositive ? 'text-success' : 'text-danger'
          }`;
        }
      }
    }
  }

  formatVolume(volume) {
    if (!volume || isNaN(volume)) {
      return '0.00';
    }
    
    const numVolume = parseFloat(volume);
    if (numVolume >= 1000000) {
      return `${(numVolume / 1000000).toFixed(1)}M`;
    } else if (numVolume >= 1000) {
      return `${(numVolume / 1000).toFixed(1)}K`;
    }
    return numVolume.toFixed(2);
  }

  destroy() {
    mockDataService.unsubscribe('priceUpdate');
  }
}

export default TradingPairSelector;