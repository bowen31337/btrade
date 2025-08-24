# 5. Component Architecture

The application will be broken down into the following high-level components, each with its own dedicated module:

*   **App:** The root component that orchestrates the entire application.
*   **Header:** The top navigation bar, including the BTrade logo, navigation links, and user authentication buttons.
*   **TradingPairSelector:** A dropdown to select the active trading pair.
*   **PriceChart:** The interactive candlestick chart with time interval selection and volume bars.
*   **OrderBook:** Displays the list of buy (bids) and sell (asks) orders.
*   **MarketTrades:** A real-time ticker of the latest market trades.
*   **OrderForm:** The form for placing buy and sell orders, with support for different order types.
*   **UserOrders:** A tabbed view of the user's open orders, order history, and trade history.
*   **AssetList:** A searchable and filterable list of all available trading pairs.