# 6. Data Flow and State Management

For the MVP, we will use a simple, centralized state management approach using vanilla JavaScript. A global `state` object will hold the application's state, and a publisher/subscriber pattern will be used to notify components of state changes.

*   **State:** A single JavaScript object will hold the application state, including the selected trading pair, chart data, order book data, etc.
*   **Actions:** Functions that update the state. For example, `selectTradingPair(pair)`.
*   **Subscriptions:** Components will subscribe to changes in the state and re-render themselves when the data they depend on changes.

This approach avoids the complexity of a full-fledged state management library like Redux or Vuex, which is not necessary for the MVP.