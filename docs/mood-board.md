# Mood Board: BTrade - Binance CEX Clone

This document outlines the visual design direction for the BTrade project, a 1:1 clone of the Binance Spot Trading UI.

## Visual Inspiration

The primary inspiration is the official Binance Spot Trading interface. We will aim to replicate its clean, data-dense, and intuitive design.

Key characteristics of the Binance UI:
*   **Dark Theme:** Predominantly dark backgrounds with contrasting text and UI elements for reduced eye strain during long trading sessions.
*   **Data-Rich:** Displays a large amount of information (charts, order books, trade history) in a structured and accessible manner.
*   **Clear Hierarchy:** Uses color, size, and placement to guide the user's attention to the most critical information and actions.
*   **Responsive:** The layout adapts to different screen sizes, although our initial focus will be on the desktop experience.

## Color Palette

| Color Name      | Hex Code  | Usage                               |
| --------------- | --------- | ----------------------------------- |
| Primary BG      | `#1E2026` | Main background color               |
| Secondary BG    | `#252930` | Panels, cards, and other containers |
| Primary Text    | `#EAECEF` | Main text color                     |
| Secondary Text  | `#848E9C` | Labels, subtitles, and less important text |
| Accent (Buy)    | `#0ECB81` | Buy buttons, positive price changes |
| Accent (Sell)   | `#F6465D` | Sell buttons, negative price changes|
| Accent (Highlight)| `#F0B90B` | Highlights, selected items, warnings |

## Typography

*   **Primary Font:** We will use a clean, sans-serif font like **Inter** or **Roboto**. This ensures readability for both text and numerical data.
*   **Font Sizes:**
    *   **H1 (Page Title):** 24px
    *   **H2 (Section Title):** 20px
    *   **Body:** 14px
    *   **Small:** 12px

## UI Components

We will replicate the following key UI components from the Binance interface:

*   **Price Chart:** A detailed, interactive chart with time interval selectors, volume bars, and drawing tools.
*   **Order Form:** A clear and concise form for placing market, limit, and stop-limit orders.
*   **Order Book:** A real-time list of buy and sell orders.
*   **Market Trades:** A ticker of the most recent trades.
*   **Asset/Trading Pair List:** A searchable and filterable list of all available trading pairs.
*   **Top Navigation Bar:** Provides access to different sections of the platform.
*   **User's Order Information:** A section displaying the user's open orders, order history, and trade history.

## Next Steps

With this mood board as our guide, the next step is to create low-fidelity wireframes for each of the key UI components. This will allow us to map out the layout and user flow before moving on to high-fidelity mockups.