# 7. Mock Data Service

A dedicated mock data service (`src/services/marketData.js`) will be responsible for generating and providing realistic-looking data for the application. This service will expose functions to get:

*   Candlestick data for the price chart.
*   Order book data.
*   A stream of market trades.
*   A list of available trading pairs.

This will allow us to develop and test the UI components independently of any real backend.