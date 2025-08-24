# 4. Project Structure

The project will follow a standard frontend project structure:

```
/btrade
|-- /dist/                # Build output
|-- /docs/                # Project documentation (PRD, mockups, etc.)
|-- /src/
|   |-- /components/      # Reusable UI components
|   |   |-- Chart.js
|   |   |-- OrderBook.js
|   |   |-- OrderForm.js
|   |   |-- ...
|   |-- /services/        # Mock data services
|   |   |-- marketData.js
|   |-- /styles/          # Global styles and Tailwind CSS configuration
|   |   |-- main.css
|   |-- /utils/           # Utility functions
|   |-- main.js           # Application entry point
|-- index.html
|-- package.json
|-- tailwind.config.js
|-- vite.config.js
```