# 6. Epic Details

### Epic 1: Project Foundation & Core UI Layout

*   **Description:** Set up the project structure, and build the main layout of the trading interface, including the top navigation bar, and the main content area with its distinct panels.
*   **Stories:**
    *   **Story 1.1: Project Setup:** As a developer, I want to initialize a new static web project with HTML, JavaScript, and Tailwind CSS, so that I have a clean and organized foundation for building the application.
        *   **Acceptance Criteria:**
            *   A new project is created with `index.html`, a `src` folder for JavaScript and CSS, and a `package.json` file.
            *   Tailwind CSS is installed and configured for the project.
            *   A basic "Hello World" page is displayed when opening `index.html` in a browser.
    *   **Story 1.2: Main Layout Scaffolding:** As a user, I want to see the main layout of the trading interface, divided into the top navigation bar, and the main content area with left, center, and right panels, so that the application has a clear and organized structure.
        *   **Acceptance Criteria:**
            *   The main layout is implemented using a CSS grid or flexbox.
            *   The top navigation bar has a distinct background color and height.
            *   The main content area is divided into three columns (left, center, right) with placeholder content.
            *   The layout is responsive and adapts to different screen sizes.
    *   **Story 1.3: Top Navigation Bar:** As a user, I want to see the top navigation bar with a trading pair selector and 24-hour statistics, so that I can quickly identify the current market and its performance.
        *   **Acceptance Criteria:**
            *   The top navigation bar displays a dropdown menu for selecting the trading pair (e.g., "BTC/USDT").
            *   The 24-hour statistics (Change, High, Low, Volume) are displayed next to the trading pair selector.
            *   The statistics are populated with mock data.
    *   **Story 1.4: Main Content Panels:** As a user, I want to see the main content area with distinct panels for the asset list, price chart, order book, and market trades, so that I can access all the necessary trading information in one place.
        *   **Acceptance Criteria:**
            *   The left panel contains a placeholder for the "Asset/Trading Pair List."
            *   The center panel is divided horizontally into two sections for the "Price Chart" and "User's Order Information."
            *   The right panel is divided horizontally into two sections for the "Order Book" and "Market Trades."
            *   Each panel has a distinct border and a title indicating its purpose.

### Epic 2: Interactive Chart & Trading Pair Display

*   **Description:** Develop the interactive price chart and the asset/trading pair list components.
*   **Stories:**
    *   **Story 2.1: Price Chart Display:** As a user, I want to see a candlestick price chart for the selected trading pair, so that I can analyze its historical price movements.
        *   **Acceptance Criteria:**
            *   A candlestick chart is displayed in the center panel.
            *   The chart is rendered using a library like TradingView's Lightweight Charts or a similar alternative.
            *   The chart is populated with mock candlestick data (OHLCV).
    *   **Story 2.2: Time Interval Selector:** As a user, I want to be able to select different time intervals (e.g., 1m, 15m, 1h, 4h, 1d) on the price chart, so that I can view price data at different resolutions.
        *   **Acceptance Criteria:**
            *   A row of buttons for selecting the time interval is displayed above the chart.
            *   Clicking a button updates the chart to display data for the selected interval (using mock data).
            *   The currently selected time interval is visually highlighted.
    *   **Story 2.3: Volume Bars:** As a user, I want to see volume bars displayed below the price chart, so that I can gauge the trading activity for the selected pair.
        *   **Acceptance Criteria:**
            *   Volume bars are displayed as a separate series at the bottom of the chart.
            *   The color of the volume bars corresponds to the color of the candlesticks (e.g., green for up, red for down).
    *   **Story 2.4: Asset/Trading Pair List:** As a user, I want to see a list of available trading pairs, so that I can select a different market to view.
        *   **Acceptance Criteria:**
            *   The left panel displays a table of trading pairs with columns for Pair, Price, and 24h Change.
            *   The table is populated with mock data.
            *   Clicking on a trading pair in the list updates the main chart and other relevant components to reflect the selected pair.
    *   **Story 2.5: Search and Filter Trading Pairs:** As a user, I want to be able to search and filter the trading pair list, so that I can quickly find the specific market I'm interested in.
        *   **Acceptance Criteria:**
            *   An input field is provided above the trading pair list for searching.
            *   Typing in the search field filters the list to show only matching pairs.
            *   Tabs are provided to filter the list by market (e.g., BTC, ETH, USDT).

### Epic 3: Order Management & Execution Flow

*   **Description:** Implement the order form, order book, market trades ticker, and the user's order information panels.
*   **Stories:**
    *   **Story 3.1: Order Form:** As a user, I want to be able to enter the price and amount for a trade in the order form, so that I can prepare to place an order.
        *   **Acceptance Criteria:**
            *   The order form is displayed in the center panel, below the price chart.
            *   Input fields for "Price" and "Amount" are present.
            *   The "Total" value is automatically calculated and displayed based on the Price and Amount inputs.
    *   **Story 3.2: Order Type Selection:** As a user, I want to be able to switch between "Market" and "Limit" order types, so that I can choose the desired execution method.
        *   **Acceptance Criteria:**
            *   Tabs for "Market" and "Limit" order types are displayed in the order form.
            *   Selecting "Market" disables the "Price" input field.
            *   Selecting "Limit" enables the "Price" input field.
    *   **Story 3.3: Buy/Sell Execution:** As a user, I want to be able to click the "Buy" or "Sell" button to submit my order, so that I can execute a trade.
        *   **Acceptance Criteria:**
            *   "Buy" and "Sell" buttons are present in the order form.
            *   Clicking the buttons triggers a confirmation message (e.g., "Order placed successfully").
            *   The order form is cleared after a successful order placement.
    *   **Story 3.4: Order Book Display:** As a user, I want to see the order book with real-time updates (simulated), so that I can gauge market depth and liquidity.
        *   **Acceptance Criteria:**
            *   The order book is displayed in the right panel.
            *   It shows separate lists for "Asks" (sell orders) and "Bids" (buy orders).
            *   Each list displays Price, Amount, and Total.
            *   The lists are updated with mock data at regular intervals to simulate real-time activity.
    *   **Story 3.5: Market Trades Ticker:** As a user, I want to see a live ticker of market trades, so that I can monitor the most recent transactions.
        *   **Acceptance Criteria:**
            *   The market trades ticker is displayed in the right panel, below the order book.
            *   It shows a list of recent trades with Price, Amount, and Time.
            *   The list is updated with mock data to simulate a live feed.
    *   **Story 3.6: User's Order Information:** As a user, I want to be able to view my open orders, order history, and trade history, so that I can track my trading activity.
        *   **Acceptance Criteria:**
            *   A section for user order information is displayed below the order form.
            *   It contains tabs for "Open Orders," "Order History," and "Trade History."
            *   Each tab displays a table with relevant information (e.g., Date, Pair, Type, Price, Amount, Status).
            *   The tables are populated with mock data.