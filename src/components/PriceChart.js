import { mockDataService } from '../services/mockDataService.js';
import { createChart, ColorType, CandlestickSeries, HistogramSeries } from 'lightweight-charts';

class PriceChart {
  constructor(container) {
    this.container = container;
    this.currentPair = null;
    this.candlestickData = [];
    this.selectedInterval = '1m';
    this.chart = null;
    this.candlestickSeries = null;
    this.volumeSeries = null;
    this.init();
  }

  init() {
    this.render();
    this.loadData();
    this.setupEventListeners();
    this.initChart();
  }

  render() {
    this.container.innerHTML = `
      <div class="bg-dark-800 rounded-lg p-4 h-full flex flex-col">
        <!-- Chart Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-4">
            <div>
              <h2 id="pair-symbol" class="text-xl font-bold text-text-primary">BTC/USDT</h2>
              <div class="flex items-center space-x-2 text-sm">
                <span id="current-price" class="text-accent-green font-mono text-lg">$43,250.50</span>
                <span id="price-change" class="text-accent-green">+2.45%</span>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-4 text-xs text-text-secondary">
              <div>
                <div class="text-text-primary font-mono" id="high-24h">$44,120.00</div>
                <div>24h High</div>
              </div>
              <div>
                <div class="text-text-primary font-mono" id="low-24h">$42,850.00</div>
                <div>24h Low</div>
              </div>
              <div>
                <div class="text-text-primary font-mono" id="volume-24h">12,456.78</div>
                <div>24h Volume (BTC)</div>
              </div>
            </div>
          </div>
          
          <!-- Chart Controls -->
          <div class="flex items-center space-x-2">
            <div class="flex bg-dark-700 rounded-lg p-1">
              <button class="interval-btn px-3 py-1 text-xs rounded transition-colors bg-primary-600 text-white" data-interval="1m">1m</button>
              <button class="interval-btn px-3 py-1 text-xs rounded transition-colors text-text-secondary hover:text-text-primary" data-interval="5m">5m</button>
              <button class="interval-btn px-3 py-1 text-xs rounded transition-colors text-text-secondary hover:text-text-primary" data-interval="15m">15m</button>
              <button class="interval-btn px-3 py-1 text-xs rounded transition-colors text-text-secondary hover:text-text-primary" data-interval="1h">1h</button>
              <button class="interval-btn px-3 py-1 text-xs rounded transition-colors text-text-secondary hover:text-text-primary" data-interval="4h">4h</button>
              <button class="interval-btn px-3 py-1 text-xs rounded transition-colors text-text-secondary hover:text-text-primary" data-interval="1d">1D</button>
            </div>
            
            <div class="flex bg-dark-700 rounded-lg p-1">
              <button class="px-3 py-1 text-xs rounded transition-colors text-text-secondary hover:text-text-primary">MA</button>
              <button class="px-3 py-1 text-xs rounded transition-colors text-text-secondary hover:text-text-primary">EMA</button>
              <button class="px-3 py-1 text-xs rounded transition-colors text-text-secondary hover:text-text-primary">BOLL</button>
            </div>
          </div>
        </div>
        
        <!-- Chart Area -->
        <div class="flex-1 bg-dark-900 rounded-lg p-4 relative overflow-hidden">
          <div id="chart-container" class="w-full h-full relative">
          </div>
        </div>
      </div>
    `;
  }

  loadData() {
    // Get current trading pair
    this.currentPair = mockDataService.getCurrentTradingPair();
    
    // Get candlestick data
    this.candlestickData = mockDataService.getCandlestickData(this.currentPair.symbol, this.selectedInterval);
    
    // Update chart display
    this.updateChartHeader();
    this.updateChartData();
  }

  setupEventListeners() {
    // Interval selection buttons
    const intervalBtns = this.container.querySelectorAll('.interval-btn');
    intervalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Update active button
        intervalBtns.forEach(b => {
          b.classList.remove('bg-primary-600', 'text-white');
          b.classList.add('text-text-secondary');
        });
        e.target.classList.add('bg-primary-600', 'text-white');
        e.target.classList.remove('text-text-secondary');
        
        // Update selected interval
        this.selectedInterval = e.target.dataset.interval;
        this.loadData();
      });
    });

    // Subscribe to real-time price updates
    mockDataService.subscribe('priceUpdate', (data) => {
      const currentPairData = data.find(pair => pair.symbol === this.currentPair.symbol);
      if (currentPairData) {
        this.updatePriceDisplay(currentPairData);
        
        // Update the last candlestick in real-time
        if (this.candlestickSeries && this.candlestickData.length > 0) {
          const lastCandle = this.candlestickData[this.candlestickData.length - 1];
          const newPrice = currentPairData.price;
          
          // Update the source data array for consistency
          lastCandle.high = Math.max(parseFloat(lastCandle.high), newPrice);
          lastCandle.low = Math.min(parseFloat(lastCandle.low), newPrice);
          lastCandle.close = newPrice;
          
          // Create an update object for the series with time in seconds
          this.candlestickSeries.update({
            time: Math.floor(lastCandle.time / 1000),
            open: parseFloat(lastCandle.open),
            high: lastCandle.high,
            low: lastCandle.low,
            close: lastCandle.close,
          });
        }
      }
    });

    // Subscribe to trading pair changes
    mockDataService.subscribe('tradingPairChanged', (pair) => {
      this.currentPair = pair;
      this.loadData();
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (this.chart) {
        this.chart.applyOptions({ width: this.getChartWidth() });
      }
    });
  }

  updateChartHeader() {
    const pairSymbol = this.container.querySelector('#pair-symbol');
    const currentPrice = this.container.querySelector('#current-price');
    const priceChange = this.container.querySelector('#price-change');
    const high24h = this.container.querySelector('#high-24h');
    const low24h = this.container.querySelector('#low-24h');
    const volume24h = this.container.querySelector('#volume-24h');

    if (pairSymbol) pairSymbol.textContent = `${this.currentPair.baseAsset}/${this.currentPair.quoteAsset}`;
    if (currentPrice) currentPrice.textContent = `$${this.formatPrice(this.currentPair.price)}`;
    
    const isPositive = this.currentPair.change24h >= 0;
    if (priceChange) {
      priceChange.textContent = `${isPositive ? '+' : ''}${this.currentPair.change24h.toFixed(2)}%`;
      priceChange.className = `${isPositive ? 'text-accent-green' : 'text-accent-red'}`;
    }
    
    if (currentPrice) {
      currentPrice.className = `font-mono text-lg ${isPositive ? 'text-accent-green' : 'text-accent-red'}`;
    }

    // Mock 24h stats
    if (high24h) high24h.textContent = `$${this.formatPrice(this.currentPair.price * 1.02)}`;
    if (low24h) low24h.textContent = `$${this.formatPrice(this.currentPair.price * 0.98)}`;
    if (volume24h) volume24h.textContent = `${(Math.random() * 10000 + 1000).toFixed(2)}`;
  }

  updatePriceDisplay(priceData) {
    const currentPrice = this.container.querySelector('#current-price');
    const priceChange = this.container.querySelector('#price-change');
    
    if (currentPrice) {
      currentPrice.textContent = `$${this.formatPrice(priceData.price)}`;
      const isPositive = priceData.change24h >= 0;
      currentPrice.className = `font-mono text-lg ${isPositive ? 'text-accent-green' : 'text-accent-red'}`;
    }
    
    if (priceChange) {
      const isPositive = priceData.change24h >= 0;
      priceChange.textContent = `${isPositive ? '+' : ''}${priceData.change24h.toFixed(2)}%`;
      priceChange.className = `${isPositive ? 'text-accent-green' : 'text-accent-red'}`;
    }
  }

  initChart() {
    const chartContainer = this.container.querySelector('#chart-container');
    if (!chartContainer) return;
    
    // Clear any existing content
    chartContainer.innerHTML = '';
    
    // Create chart
    this.chart = createChart(chartContainer, {
      width: this.getChartWidth(),
      height: chartContainer.clientHeight,
      layout: {
        background: { color: '#1a1d29' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#2d3748' },
        horzLines: { color: '#2d3748' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: '#6b7280',
          style: 0,
        },
        horzLine: {
          width: 1,
          color: '#6b7280',
          style: 0,
        },
      },
      timeScale: {
        borderColor: '#2d3748',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: '#2d3748',
      },
    });
    
    // Create candlestick series
    try {
      this.candlestickSeries = this.chart.addSeries(CandlestickSeries, {
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });
      
      // Create volume series
      this.volumeSeries = this.chart.addSeries(HistogramSeries, {
        color: '#6b7280',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'volume',
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });
      
      // Update chart with data
      this.updateChartData();
    } catch (error) {
      console.error('Error creating chart series:', error);
    }
  }
  
  getChartWidth() {
    const chartContainer = this.container.querySelector('#chart-container');
    return chartContainer && chartContainer.clientWidth > 0 ? chartContainer.clientWidth : 800;
  }
  
  updateChartData() {
    if (!this.chart || !this.candlestickSeries || !this.candlestickData.length) return;
    
    // Format data for lightweight-charts
    const formattedData = this.candlestickData.map(candle => ({
      time: Math.floor(candle.time / 1000),
      open: parseFloat(candle.open),
      high: parseFloat(candle.high),
      low: parseFloat(candle.low),
      close: parseFloat(candle.close),
    }));
    
    const volumeData = this.candlestickData.map(candle => ({
      time: Math.floor(candle.time / 1000),
      value: parseFloat(candle.volume),
      color: parseFloat(candle.close) >= parseFloat(candle.open) ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)',
    }));
    
    // Set data to series
    this.candlestickSeries.setData(formattedData);
    this.volumeSeries.setData(volumeData);
    
    // Fit content
    this.chart.timeScale().fitContent();
  }

  formatPrice(price) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}

export default PriceChart;