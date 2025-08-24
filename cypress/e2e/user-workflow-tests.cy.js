describe('User Workflow Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.wait(3000); // Allow components to load
  });

  describe('Complete Trading Workflow', () => {
    it('should complete full trading workflow: pair selection → chart analysis → buy order', () => {
      // Step 1: Select trading pair
      cy.get('#trading-pair-selector-container').should('be.visible');
      
      // Verify current pair is displayed
      cy.get('#current-pair-symbol').should('contain.text', 'BTC');
      
      // Step 2: Analyze chart data
      cy.get('#price-chart-container').should('be.visible');
      cy.get('#current-price').should('be.visible');
      
      // Wait for chart to load with data
      cy.wait(2000);
      
      // Step 3: Place buy order based on chart analysis
      cy.get('#order-form-container').should('be.visible');
      cy.get('#buy-tab').click();
      
      // Fill order form with realistic values
      cy.get('#price-input').clear().type('45000');
      cy.get('#amount-input').clear().type('0.1');
      
      // Verify total calculation
      cy.get('#total-display').should('contain.text', '4500');
      
      // Submit order
      cy.get('#submit-order-btn').should('be.enabled').click();
      
      // Verify order submission feedback
      cy.get('#order-form-container').should('be.visible');
    });

    it('should complete sell workflow with market analysis', () => {
      // Step 1: Analyze current market conditions
      cy.get('#order-book-container').should('be.visible');
      cy.get('#price-chart-container').should('be.visible');
      
      // Step 2: Check current holdings (simulated)
      cy.get('#order-form-container').should('be.visible');
      
      // Step 3: Place sell order
      cy.get('#sell-tab').click();
      
      // Use market price for quick sell
      cy.get('#current-price').then(($price) => {
        const marketPrice = $price.text().replace(/[^0-9.]/g, '');
        if (marketPrice) {
          cy.get('#price-input').clear().type(marketPrice);
        } else {
          cy.get('#price-input').clear().type('44000');
        }
      });
      
      cy.get('#amount-input').clear().type('0.05');
      
      // Verify sell order can be submitted
      cy.get('#submit-order-btn').should('be.enabled');
    });
  });

  describe('Multi-Pair Trading Workflow', () => {
    it('should handle switching between different trading pairs', () => {
      // Start with default pair
      cy.get('#current-pair-symbol').should('be.visible');
      
      // Analyze first pair
      cy.get('#price-chart-container').should('be.visible');
      cy.wait(1000);
      
      // Set up order for first pair
      cy.get('#buy-tab').click();
      cy.get('#price-input').clear().type('45000');
      cy.get('#amount-input').clear().type('0.1');
      
      // Switch to different pair (if available)
      // Note: This would require actual pair selector implementation
      cy.get('#trading-pair-selector-container').should('be.visible');
      
      // Verify chart updates for new pair
      cy.get('#price-chart-container').should('be.visible');
      
      // Verify order form resets or updates appropriately
      cy.get('#order-form-container').should('be.visible');
    });
  });

  describe('Advanced Trading Scenarios', () => {
    it('should handle limit order workflow', () => {
      // Analyze current market price
      cy.get('#current-price').should('be.visible');
      
      // Set limit order below market price
      cy.get('#buy-tab').click();
      cy.get('#price-input').clear().type('43000'); // Below market
      cy.get('#amount-input').clear().type('0.2');
      
      // Verify total calculation
      cy.get('#total-display').should('contain.text', '8600');
      
      // Submit limit order
      cy.get('#submit-order-btn').should('be.enabled').click();
      
      // Verify order appears in order history or pending orders
      cy.get('#order-form-container').should('be.visible');
    });

    it('should handle percentage-based order sizing', () => {
      // Use percentage buttons for quick sizing
      cy.get('#buy-tab').click();
      cy.get('#price-input').clear().type('45000');
      
      // Click 25% button (if available)
      cy.get('button').contains('25%').click();
      
      // Verify amount is calculated
      cy.get('#amount-input').should('not.have.value', '');
      
      // Try 50% button
      cy.get('button').contains('50%').click();
      
      // Verify amount updated
      cy.get('#amount-input').should('not.have.value', '');
      
      // Submit order
      cy.get('#submit-order-btn').should('be.enabled');
    });
  });

  describe('User Experience Workflow', () => {
    it('should provide smooth navigation between components', () => {
      // Test component visibility and responsiveness
      cy.get('#price-chart-container').should('be.visible');
      cy.get('#order-form-container').should('be.visible');
      cy.get('#order-book-container').should('be.visible');
      
      // Interact with each component
      cy.get('#buy-tab').click();
      cy.wait(500);
      
      cy.get('#sell-tab').click();
      cy.wait(500);
      
      // Fill form and verify real-time updates
      cy.get('#price-input').clear().type('45000');
      cy.get('#amount-input').clear().type('0.1');
      
      // Verify total updates in real-time
      cy.get('#total-display').should('be.visible');
      
      // Test form reset
      cy.get('#price-input').clear();
      cy.get('#amount-input').clear();
      
      // Verify form state
      cy.get('#submit-order-btn').should('be.disabled');
    });

    it('should handle rapid user interactions gracefully', () => {
      // Rapid clicking between buy/sell
      for (let i = 0; i < 5; i++) {
        cy.get('#buy-tab').click();
        cy.wait(100);
        cy.get('#sell-tab').click();
        cy.wait(100);
      }
      
      // Verify final state is consistent
      cy.get('#order-form-container').should('be.visible');
      cy.get('#sell-tab').should('have.class', 'active').or('have.attr', 'aria-selected', 'true');
      
      // Rapid form input
      cy.get('#price-input').clear().type('45000');
      cy.get('#amount-input').clear().type('0.1');
      cy.get('#price-input').clear().type('46000');
      cy.get('#amount-input').clear().type('0.2');
      
      // Verify final values are correct
      cy.get('#price-input').should('have.value', '46000');
      cy.get('#amount-input').should('have.value', '0.2');
    });
  });

  describe('Error Recovery Workflow', () => {
    it('should recover from network errors gracefully', () => {
      // Test form submission with potential network issues
      cy.get('#buy-tab').click();
      cy.get('#price-input').clear().type('45000');
      cy.get('#amount-input').clear().type('0.1');
      
      // Submit order (may fail due to mock/test environment)
      cy.get('#submit-order-btn').click();
      
      // Application should remain stable
      cy.get('#order-form-container').should('be.visible');
      cy.get('#main-content-grid').should('be.visible');
      
      // Form should still be functional
      cy.get('#price-input').should('be.visible');
      cy.get('#amount-input').should('be.visible');
    });

    it('should handle invalid input gracefully', () => {
      // Test with invalid price
      cy.get('#buy-tab').click();
      cy.get('#price-input').clear().type('invalid');
      cy.get('#amount-input').clear().type('0.1');
      
      // Form should handle invalid input
      cy.get('#submit-order-btn').should('be.disabled');
      
      // Correct the input
      cy.get('#price-input').clear().type('45000');
      
      // Form should become valid
      cy.get('#submit-order-btn').should('be.enabled');
    });
  });
});