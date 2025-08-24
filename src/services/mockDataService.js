// Mock Data Service for BTrade Application

class MockDataService {
  constructor() {
    this.tradingPairs = [
      { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', price: 43250.50, change24h: 2.45 },
      { symbol: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT', price: 2650.75, change24h: -1.23 },
      { symbol: 'BNBUSDT', baseAsset: 'BNB', quoteAsset: 'USDT', price: 315.20, change24h: 3.67 },
      { symbol: 'ADAUSDT', baseAsset: 'ADA', quoteAsset: 'USDT', price: 0.4521, change24h: -0.89 },
      { symbol: 'SOLUSDT', baseAsset: 'SOL', quoteAsset: 'USDT', price: 98.45, change24h: 5.12 },
    ];
    
    this.currentPair = this.tradingPairs[0];
    this.subscribers = new Map();
  }

  // Get all trading pairs
  getTradingPairs() {
    return this.tradingPairs;
  }

  // Get current trading pair
  getCurrentTradingPair() {
    return this.currentPair;
  }

  // Set current trading pair
  setCurrentTradingPair(symbol) {
    const pair = this.tradingPairs.find(p => p.symbol === symbol);
    if (pair) {
      this.currentPair = pair;
      this.notifySubscribers('tradingPairChanged', pair);
    }
  }

  // Get current price for a symbol
  getCurrentPrice(symbol = this.currentPair.symbol) {
    const pair = this.tradingPairs.find(p => p.symbol === symbol);
    return pair ? {
      symbol: pair.symbol,
      price: pair.price,
      change24h: pair.change24h
    } : null;
  }

  // Generate mock order book data
  getOrderBook(symbol = this.currentPair.symbol) {
    const basePrice = this.currentPair.price;
    const asks = [];
    const bids = [];

    // Generate asks (sell orders)
    for (let i = 1; i <= 20; i++) {
      asks.push({
        price: (basePrice + (i * basePrice * 0.001)).toFixed(2),
        amount: (Math.random() * 10 + 0.1).toFixed(4),
        total: 0
      });
    }

    // Generate bids (buy orders)
    for (let i = 1; i <= 20; i++) {
      bids.push({
        price: (basePrice - (i * basePrice * 0.001)).toFixed(2),
        amount: (Math.random() * 10 + 0.1).toFixed(4),
        total: 0
      });
    }

    // Calculate totals
    let askTotal = 0;
    asks.forEach(ask => {
      askTotal += parseFloat(ask.amount);
      ask.total = askTotal.toFixed(4);
    });

    let bidTotal = 0;
    bids.forEach(bid => {
      bidTotal += parseFloat(bid.amount);
      bid.total = bidTotal.toFixed(4);
    });

    return { asks, bids };
  }

  // Generate mock market trades
  getMarketTrades(symbol = this.currentPair.symbol, limit = 50) {
    const trades = [];
    const basePrice = this.currentPair.price;
    let currentTime = Date.now();

    for (let i = 0; i < limit; i++) {
      const isBuy = Math.random() > 0.5;
      const priceVariation = (Math.random() - 0.5) * 0.02; // ±1% variation
      const price = (basePrice * (1 + priceVariation)).toFixed(2);
      const amount = (Math.random() * 5 + 0.01).toFixed(4);
      
      trades.push({
        id: `trade_${i}`,
        price: price,
        amount: amount,
        isBuy: isBuy,
        time: new Date(currentTime - (i * 1000)).toLocaleTimeString(),
        timestamp: currentTime - (i * 1000)
      });
    }

    return trades.sort((a, b) => b.timestamp - a.timestamp);
  }

  getCandlestickData(symbol = this.currentPair.symbol, interval = '1m', limit = 100) {
    // Generate mock candlestick data
    const basePrice = this.tradingPairs.find(pair => pair.symbol === symbol)?.price || 45000;
    const data = [];
    const now = Date.now();
    
    // Determine time increment based on interval
    let timeIncrement;
    switch(interval) {
      case '1m': timeIncrement = 60 * 1000; break;
      case '5m': timeIncrement = 5 * 60 * 1000; break;
      case '15m': timeIncrement = 15 * 60 * 1000; break;
      case '1h': timeIncrement = 60 * 60 * 1000; break;
      case '4h': timeIncrement = 4 * 60 * 60 * 1000; break;
      case '1d': timeIncrement = 24 * 60 * 60 * 1000; break;
      default: timeIncrement = 60 * 1000;
    }
    
    let currentPrice = basePrice;
    
    for (let i = 0; i < limit; i++) {
      const time = now - (limit - i) * timeIncrement;
      const volatility = basePrice * 0.002; // 0.2% volatility
      
      // Generate random price movement
      const changePercent = (Math.random() - 0.5) * 2 * volatility;
      const change = basePrice * changePercent;
      
      // Ensure price doesn't drift too far from base price over time
      currentPrice = currentPrice + change;
      if (currentPrice > basePrice * 1.1 || currentPrice < basePrice * 0.9) {
        currentPrice = basePrice + (Math.random() - 0.5) * basePrice * 0.05;
      }
      
      // Generate OHLC values
      const open = currentPrice;
      const close = currentPrice + (Math.random() - 0.5) * volatility;
      const high = Math.max(open, close) + Math.random() * volatility;
      const low = Math.min(open, close) - Math.random() * volatility;
      
      // Generate volume
      const volume = Math.random() * basePrice * 0.5 + basePrice * 0.1;
      
      data.push({
        time,
        open: open.toFixed(2),
        high: high.toFixed(2),
        low: low.toFixed(2),
        close: close.toFixed(2),
        volume: volume.toFixed(2)
      });
      
      currentPrice = close;
    }
    
    return data;
  }

  // Generate mock user orders
  getUserOrders() {
    return [
      {
        id: 'order_1',
        symbol: 'BTCUSDT',
        baseAsset: 'BTC',
        quoteAsset: 'USDT',
        side: 'buy',
        type: 'limit',
        amount: '0.1500',
        price: 43000.00,
        filled: '0.0750',
        status: 'partially_filled',
        timestamp: Date.now() - 3600000 // 1 hour ago
      },
      {
        id: 'order_2',
        symbol: 'ETHUSDT',
        baseAsset: 'ETH',
        quoteAsset: 'USDT',
        side: 'sell',
        type: 'limit',
        amount: '2.0000',
        price: 2700.00,
        filled: '0.0000',
        status: 'open',
        timestamp: Date.now() - 7200000 // 2 hours ago
      }
    ];
  }

  // Generate mock order history
  getOrderHistory() {
    return [
      {
        id: 'order_3',
        symbol: 'BTCUSDT',
        baseAsset: 'BTC',
        quoteAsset: 'USDT',
        side: 'buy',
        type: 'market',
        amount: '0.0500',
        price: 43180.50,
        filled: '0.0500',
        status: 'filled',
        timestamp: Date.now() - 86400000 // 1 day ago
      },
      {
        id: 'order_4',
        symbol: 'ETHUSDT',
        baseAsset: 'ETH',
        quoteAsset: 'USDT',
        side: 'sell',
        type: 'limit',
        amount: '1.5000',
        price: 2650.00,
        filled: '1.5000',
        status: 'filled',
        timestamp: Date.now() - 172800000 // 2 days ago
      },
      {
        id: 'order_5',
        symbol: 'ADAUSDT',
        baseAsset: 'ADA',
        quoteAsset: 'USDT',
        side: 'buy',
        type: 'limit',
        amount: '1000.0000',
        price: 0.45,
        filled: '0.0000',
        status: 'cancelled',
        timestamp: Date.now() - 259200000 // 3 days ago
      }
    ];
  }

  // Generate mock trade history
  getTradeHistory() {
    return [
      {
        id: 'trade_1',
        symbol: 'BTCUSDT',
        baseAsset: 'BTC',
        quoteAsset: 'USDT',
        side: 'buy',
        amount: '0.0500',
        price: 43180.50,
        fee: 2.159,
        timestamp: Date.now() - 86400000 // 1 day ago
      },
      {
        id: 'trade_2',
        symbol: 'ETHUSDT',
        baseAsset: 'ETH',
        quoteAsset: 'USDT',
        side: 'sell',
        amount: '1.5000',
        price: 2650.00,
        fee: 3.975,
        timestamp: Date.now() - 172800000 // 2 days ago
      },
      {
        id: 'trade_3',
        symbol: 'BTCUSDT',
        baseAsset: 'BTC',
        quoteAsset: 'USDT',
        side: 'buy',
        amount: '0.0250',
        price: 42800.00,
        fee: 1.070,
        timestamp: Date.now() - 345600000 // 4 days ago
      }
    ];
  }

  // Subscribe to data updates
  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event).push(callback);
  }

  // Unsubscribe from data updates
  unsubscribe(event, callback) {
    if (this.subscribers.has(event)) {
      const callbacks = this.subscribers.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Notify subscribers
  notifySubscribers(event, data) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(callback => callback(data));
    }
  }

  startPriceUpdates() {
    // Simulate real-time price updates
    setInterval(() => {
      this.tradingPairs.forEach(pair => {
        // Random price change
        const changePercent = (Math.random() - 0.5) * 0.002; // Max 0.1% change
        const change = pair.price * changePercent;
        const newPrice = parseFloat((pair.price + change).toFixed(2));
        
        // Update price
        pair.price = newPrice;
        
        // Update 24h change (simplified simulation)
        pair.change24h = parseFloat((pair.change24h + changePercent * 100).toFixed(2));
        if (pair.change24h > 15) pair.change24h = 15;
        if (pair.change24h < -15) pair.change24h = -15;
      });
      
      // Notify subscribers with all updated pairs
      this.notifySubscribers('priceUpdate', this.tradingPairs);
    }, 2000); // Update every 2 seconds
  }
}

// Export singleton instance
const mockDataService = new MockDataService();
export { mockDataService };
export default mockDataService;