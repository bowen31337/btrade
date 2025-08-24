# 2. Requirements

### Functional

*   **FR1:** The application MUST display a candlestick chart with selectable time intervals (1m, 15m, 1h, 4h, 1d) and volume bars.
*   **FR2:** The application MUST include an order form with tabs for "Buy" and "Sell" actions.
*   **FR3:** The order form MUST support "Market" and "Limit" order types.
*   **FR4:** The order form MUST have input fields for Price and Amount, and display the Total value.
*   **FR5:** The application MUST display an order book with separate lists for "Asks" (sell orders) and "Bids" (buy orders).
*   **FR6:** The application MUST display a live ticker of market trades, showing Price, Amount, and Time.
*   **FR7:** The application MUST feature a top navigation bar with a trading pair selector and 24-hour statistics (Change, High, Low, Volume).
*   **FR8:** The application MUST include a searchable and filterable list of all available trading pairs.
*   **FR9:** The application MUST provide a section for users to view their "Open Orders," "Order History," and "Trade History."
*   **FR10:** The UI components MUST be visually identical to the Binance spot trading interface.

### Non-Functional

*   **NFR1:** The application MUST be a single-page application (SPA) built with HTML, JavaScript, and Tailwind CSS.
*   **NFR2:** The application MUST be responsive and function correctly on modern web browsers (Chrome, Firefox, Safari, Edge).
*   **NFR3:** The application MUST use mock data for all dynamic components (charts, order book, etc.); no live data integration is required for the MVP.
*   **NFR4:** The application's code MUST be well-structured, component-based, and easily maintainable.