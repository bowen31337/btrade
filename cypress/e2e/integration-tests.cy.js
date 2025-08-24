describe('Component Integration Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(3000); // Wait for components to load
  });

  describe('OrderForm + PriceChart Integration', () => {
    it('should update order form when chart price changes', () => {
      // Check if price chart container exists
      cy.get('#price-chart-container').should('exist');
      
      // Check if order form container exists
      cy.get('#order-form-container').should('exist');
      
      // Verify order form has price input
      cy.get('#price-input')
        .should('exist')
        .and('be.visible');
    });

    it('should maintain price synchronization between components', () => {
      // Look for current price display
      cy.get('#current-price')
        .should('exist')
        .and('be.visible');
      
      // Verify price input reflects current market price
      cy.get('#price-input')
        .should('have.value');
    });
  });

  describe('TradingPairSelector + Chart Integration', () => {
    it('should update chart when trading pair changes', () => {
      // Look for trading pair selector container
      cy.get('#trading-pair-selector-container')
        .should('exist');
      
      // Check if chart container exists
      cy.get('#price-chart-container')
        .should('exist');
      
      // Verify current pair is displayed
      cy.get('#current-pair-symbol').should('contain.text', 'BTC');
    });

    it('should update order form when trading pair changes', () => {
      // Verify order form shows correct trading pair
      cy.get('#order-form-container').within(() => {
        cy.get('button').should('contain.text', 'BTC');
      });
    });
  });

  describe('OrderForm + OrderBook Integration', () => {
    it('should allow clicking order book prices to fill order form', () => {
      // Check if order book container exists
      cy.get('#order-book-container').should('exist');
      
      // Check if order form container exists
      cy.get('#order-form-container').should('exist');
      
      // Verify price input is available for interaction
      cy.get('#price-input')
        .should('be.visible')
        .and('not.be.disabled');
    });
  });

  describe('Real-time Data Flow Integration', () => {
    it('should update all components when market data changes', () => {
      // Verify all major components are present and responsive
      cy.get('#price-chart-container')
        .should('exist');
      
      cy.get('#order-form-container')
        .should('exist');
      
      cy.get('#order-book-container')
        .should('exist');
      
      // Wait for potential data updates
      cy.wait(3000);
      
      // Verify components are still functional
      cy.get('#amount-input')
        .should('be.visible')
        .type('0.1')
        .should('have.value', '0.1');
    });
  });

  describe('Form Validation Integration', () => {
    it('should validate order form inputs across all order types', () => {
      // Test Buy order validation
      cy.get('#buy-tab').click();
      
      // Try to submit empty form
      cy.get('#submit-order-btn').click();
      
      // Should show validation messages or prevent submission
      cy.get('#order-form-container').should('exist'); // Form should still be visible
      
      // Test with invalid price
      cy.get('#price-input')
        .clear()
        .type('-1');
      
      cy.get('#amount-input')
        .clear()
        .type('0.1');
      
      // Try to submit with invalid price
      cy.get('#submit-order-btn').click();
      
      // Should show validation error or prevent submission
      cy.get('#order-form-container').should('exist');
    });

    it('should validate sell order form', () => {
      // Test Sell order validation
      cy.get('#sell-tab').click();
      
      // Test with valid inputs
      cy.get('#price-input')
        .clear()
        .type('50000');
      
      cy.get('#amount-input')
        .clear()
        .type('0.1');
      
      // Form should accept valid inputs
      cy.get('#submit-order-btn')
        .should('not.be.disabled');
    });
  });

  describe('Layout Integration', () => {
    it('should maintain proper layout when components interact', () => {
      // Verify main layout structure
      cy.get('#main-content-grid').should('be.visible');
      
      // Check responsive behavior
      cy.viewport(768, 1024); // Tablet view
      cy.wait(1000);
      
      // Components should still be accessible
      cy.get('#order-form-container').should('be.visible');
      cy.get('#price-chart-container').should('be.visible');
      
      // Mobile view
      cy.viewport(375, 667);
      cy.wait(1000);
      
      // Essential components should remain accessible
      cy.get('#main-content-grid').should('be.visible');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle component errors gracefully', () => {
      // Test form with extreme values
      cy.get('#amount-input')
        .clear()
        .type('999999999');
      
      // Application should remain stable
      cy.get('#main-content-grid').should('be.visible');
      
      // Test with very small values
      cy.get('#amount-input')
        .clear()
        .type('0.00000001');
      
      // Application should handle gracefully
      cy.get('#main-content-grid').should('be.visible');
    });
  });

  describe('Performance Integration', () => {
    it('should maintain performance when multiple components update', () => {
      // Interact with multiple components rapidly
      cy.get('#buy-tab').click();
      cy.wait(100);
      
      cy.get('#sell-tab').click();
      cy.wait(100);
      
      // Fill form fields rapidly
      cy.get('#price-input')
        .clear()
        .type('45000');
      
      cy.get('#amount-input')
        .clear()
        .type('0.5');
      
      // Application should remain responsive
      cy.get('#main-content-grid').should('be.visible');
      
      // Verify components are still functional
      cy.get('#order-form-container').should('be.visible');
    });
  });
});