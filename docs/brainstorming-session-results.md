# Brainstorming Session: Binance CEX Application Clone

## Session Details

*   **Date:** 2024-07-31
*   **Topic:** Clone a Binance CEX application, focusing on a web-based MVP with a wireframe demo.
*   **Goal:** Focused ideation on a spot trading demo UI.
*   **Technology Stack:** HTML, JavaScript, Tailwind CSS

---

## 2. Feature Brainstorming (1:1 Binance Clone)

This section breaks down the features required for a 1:1 clone of the Binance Spot Trading UI, categorized into Must-Haves for the MVP and Could-Haves for future iterations.

### 2.1. Price Chart

*   **Must-Haves:**
    *   Candlestick Display
    *   Time Interval Selector (1m, 15m, 1h, 4h, 1d)
    *   Volume Bars
    *   Current Price Line
*   **Could-Haves:**
    *   Drawing Tools (Trend lines, etc.)
    *   Technical Indicators (RSI, MACD)
    *   Chart Type Toggle (Depth Chart)

### 2.2. Order Form

*   **Must-Haves:**
    *   Buy/Sell Tabs
    *   Order Type Tabs (Limit, Market, Stop-Limit)
    *   Price Input Field
    *   Amount Input Field
    *   Amount Slider (25%, 50%, 75%, 100%)
    *   Total Value Display
    *   Available Balance Display
    *   "Buy/Sell" Execution Button

### 2.3. Order Book & Market Trades

*   **Must-Haves:**
    *   **Order Book:** Asks (Red) and Bids (Green) with Price, Amount, Total columns.
    *   **Market Trades:** Live ticker with Price, Amount, Time, and color-coding.
*   **Could-Haves:**
    *   **Order Book:** Decimal Precision Selector, Click-to-Fill price.
    *   **Market Trades:** Highlighting user's own trades.

### 2.4. Top Bar & Navigation

*   **Must-Haves:**
    *   Trading Pair Selector with current price.
    *   24h Change, High, Low, and Volume statistics.

### 2.5. Asset/Trading Pair List

*   **Must-Haves:**
    *   Search Bar
    *   Market Tabs (Favorites, BTC, ALTS, FIAT)
    *   Pair List Table (Name, Price, Change)

### 2.6. User's Order Information

*   **Must-Haves:**
    *   Tabs: Open Orders, Order History, Trade History
    *   Detailed table for orders/trades.
    *   "Cancel All Orders" Button

---

## 1. Mind Mapping

The following mind map outlines the core components and structure of the spot trading UI, aiming for a 1:1 representation of the Binance interface.

### Central Topic: Spot Trading UI Demo

*   **1. Top Bar/Navigation**
    *   1.1. Trading Pair Selector (e.g., BTC/USDT)
    *   1.2. Current Market Price
    *   1.3. 24h Price Change (%)
    *   1.4. 24h High Price
    *   1.5. 24h Low Price
    *   1.6. 24h Trading Volume (in both assets)

*   **2. Main Content Area**
    *   **2.1. Left Panel: Asset/Trading Pair List**
        *   2.1.1. Search Bar for pairs
        *   2.1.2. Market Tabs (e.g., Favorites, BTC, ALTS, FIAT)
        *   2.1.3. Pair List Table (Name, Last Price, 24h Change)
    *   **2.2. Center Panel: Core Trading View**
        *   **2.2.1. Price Chart**
            *   2.2.1.1. Candlestick View
            *   2.2.1.2. Chart Type Toggle (e.g., Depth Chart)
            *   2.2.1.3. Time Interval Selector (1m, 15m, 1h, 4h, 1d)
            *   2.2.1.4. Volume Bars
        *   **2.2.2. Order Form**
            *   2.2.2.1. Buy/Sell Tabs
            *   2.2.2.2. Order Type Tabs (Limit, Market, Stop-Limit)
            *   2.2.2.3. Price Input Field
            *   2.2.2.4. Amount Input Field
            *   2.2.2.5. Amount Slider (25%, 50%, 75%, 100%)
            *   2.2.2.6. Total Value Display
            *   2.2.2.7. Available Balance Display
            *   2.2.2.8. "Buy/Sell" Execution Button
    *   **2.3. Right Panel: Order Book & Market Trades**
        *   **2.3.1. Order Book**
            *   2.3.1.1. Asks (Sell Orders - Red)
            *   2.3.1.2. Bids (Buy Orders - Green)
            *   2.3.1.3. Columns: Price, Amount, Total
            *   2.3.1.4. Decimal Precision Selector
        *   **2.3.2. Market Trades (Live Ticker)**
            *   2.3.2.1. Columns: Price, Amount, Time

*   **3. Bottom Panel: User's Order Information**
    *   3.1. Tabs: Open Orders, Order History, Trade History
    *   3.2. Table with order details (Date, Pair, Type, Side, Price, Amount, Filled, Total)
    *   3.3. "Cancel All Orders" Button

---