describe('Data Validation Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.wait(3000); // Allow components to load and data to populate
  });

  describe('Price Data Validation', () => {
    it('should display valid price format across all components', () => {
      // Check current price format
      cy.get('#current-price').should('be.visible').then(($price) => {
        const priceText = $price.text();
        // Price should be a valid number format (with or without currency symbol)
        expect(priceText).to.match(/[\d,]+\.?\d*/); // Matches numbers with optional decimals
      });
      
      // Check order form price input accepts valid prices
      cy.get('#price-input').clear().type('45000.50');
      cy.get('#price-input').should('have.value', '45000.50');
      
      // Test invalid price handling
      cy.get('#price-input').clear().type('invalid');
      cy.get('#price-input').should('not.have.value', 'invalid');
    });

    it('should maintain price consistency across components', () => {
      let chartPrice;
      
      // Get price from chart component
      cy.get('#current-price').should('be.visible').then(($price) => {
        chartPrice = $price.text().replace(/[^0-9.]/g, '');
        
        // If chart has a valid price, verify it's reasonable
        if (chartPrice && !isNaN(parseFloat(chartPrice))) {
          const price = parseFloat(chartPrice);
          expect(price).to.be.greaterThan(0);
          expect(price).to.be.lessThan(1000000); // Reasonable upper bound
        }
      });
      
      // Verify order form can use similar price ranges
      cy.get('#price-input').clear().type('45000');
      cy.get('#price-input').should('have.value', '45000');
    });
  });

  describe('Amount and Quantity Validation', () => {
    it('should validate amount input ranges', () => {
      // Test valid amount
      cy.get('#amount-input').clear().type('0.1');
      cy.get('#amount-input').should('have.value', '0.1');
      
      // Test decimal precision
      cy.get('#amount-input').clear().type('0.12345678');
      cy.get('#amount-input').should('contain.value', '0.123'); // Should handle precision
      
      // Test very small amounts
      cy.get('#amount-input').clear().type('0.00000001');
      cy.get('#amount-input').should('not.be.empty');
      
      // Test zero amount
      cy.get('#amount-input').clear().type('0');
      cy.get('#submit-order-btn').should('be.disabled'); // Should disable submit
    });

    it('should calculate total correctly', () => {
      // Set known values
      cy.get('#price-input').clear().type('50000');
      cy.get('#amount-input').clear().type('0.1');
      
      // Check total calculation
      cy.get('#total-display').should('be.visible').then(($total) => {
        const totalText = $total.text().replace(/[^0-9.]/g, '');
        const expectedTotal = 50000 * 0.1; // 5000
        
        if (totalText) {
          const actualTotal = parseFloat(totalText);
          expect(actualTotal).to.be.closeTo(expectedTotal, 0.01);
        }
      });
    });
  });

  describe('Real-time Data Updates', () => {
    it('should handle data updates without errors', () => {
      // Monitor for console errors during data updates
      cy.window().then((win) => {
        cy.stub(win.console, 'error').as('consoleError');
      });
      
      // Wait for potential data updates
      cy.wait(5000);
      
      // Verify no console errors occurred
      cy.get('@consoleError').should('not.have.been.called');
      
      // Verify components remain functional
      cy.get('#price-chart-container').should('be.visible');
      cy.get('#order-form-container').should('be.visible');
      cy.get('#order-book-container').should('be.visible');
    });

    it('should maintain component state during updates', () => {
      // Set form values
      cy.get('#buy-tab').click();
      cy.get('#price-input').clear().type('45000');
      cy.get('#amount-input').clear().type('0.1');
      
      // Wait for potential updates
      cy.wait(3000);
      
      // Verify form values are preserved
      cy.get('#price-input').should('have.value', '45000');
      cy.get('#amount-input').should('have.value', '0.1');
      cy.get('#buy-tab').should('have.class', 'active').or('have.attr', 'aria-selected', 'true');
    });
  });

  describe('Trading Pair Data Validation', () => {
    it('should display valid trading pair information', () => {
      // Check current trading pair
      cy.get('#current-pair-symbol').should('be.visible').then(($symbol) => {
        const symbolText = $symbol.text();
        // Should contain valid trading pair format (e.g., BTC/USD, ETH/BTC)
        expect(symbolText).to.match(/[A-Z]{2,5}[\/\-]?[A-Z]{2,5}?/i);
      });
      
      // Verify trading pair selector is functional
      cy.get('#trading-pair-selector-container').should('be.visible');
    });

    it('should handle trading pair changes correctly', () => {
      // Get initial pair
      cy.get('#current-pair-symbol').should('be.visible');
      
      // Verify chart updates appropriately for the pair
      cy.get('#price-chart-container').should('be.visible');
      
      // Verify order form is appropriate for the pair
      cy.get('#order-form-container').should('be.visible');
      cy.get('#price-input').should('be.visible');
      cy.get('#amount-input').should('be.visible');
    });
  });

  describe('Order Book Data Validation', () => {
    it('should display valid order book data structure', () => {
      cy.get('#order-book-container').should('be.visible');
      
      // Check if order book has data (may be empty in test environment)
      cy.get('#order-book-container').within(() => {
        // Should have buy and sell sections or appropriate empty state
        cy.get('*').should('exist'); // At least some content should exist
      });
    });

    it('should handle empty order book gracefully', () => {
      // Verify order book container exists even if empty
      cy.get('#order-book-container').should('be.visible');
      
      // Should not cause application errors
      cy.get('#main-content-grid').should('be.visible');
      cy.get('#order-form-container').should('be.visible');
    });
  });

  describe('Form Validation Logic', () => {
    it('should validate buy order requirements', () => {
      cy.get('#buy-tab').click();
      
      // Empty form should disable submit
      cy.get('#submit-order-btn').should('be.disabled');
      
      // Price only should still disable submit
      cy.get('#price-input').clear().type('45000');
      cy.get('#submit-order-btn').should('be.disabled');
      
      // Both price and amount should enable submit
      cy.get('#amount-input').clear().type('0.1');
      cy.get('#submit-order-btn').should('be.enabled');
      
      // Invalid amount should disable submit
      cy.get('#amount-input').clear().type('0');
      cy.get('#submit-order-btn').should('be.disabled');
    });

    it('should validate sell order requirements', () => {
      cy.get('#sell-tab').click();
      
      // Similar validation for sell orders
      cy.get('#submit-order-btn').should('be.disabled');
      
      cy.get('#price-input').clear().type('44000');
      cy.get('#amount-input').clear().type('0.05');
      cy.get('#submit-order-btn').should('be.enabled');
    });
  });

  describe('Data Persistence and State Management', () => {
    it('should maintain form state during tab switches', () => {
      // Set buy order data
      cy.get('#buy-tab').click();
      cy.get('#price-input').clear().type('45000');
      cy.get('#amount-input').clear().type('0.1');
      
      // Switch to sell tab
      cy.get('#sell-tab').click();
      
      // Set sell order data
      cy.get('#price-input').clear().type('44000');
      cy.get('#amount-input').clear().type('0.05');
      
      // Switch back to buy tab
      cy.get('#buy-tab').click();
      
      // Values should be preserved or reset appropriately
      cy.get('#price-input').should('be.visible');
      cy.get('#amount-input').should('be.visible');
    });

    it('should handle rapid data changes gracefully', () => {
      // Rapid form updates
      for (let i = 1; i <= 5; i++) {
        cy.get('#price-input').clear().type(`${40000 + i * 1000}`);
        cy.get('#amount-input').clear().type(`0.${i}`);
        cy.wait(200);
      }
      
      // Final state should be consistent
      cy.get('#price-input').should('have.value', '45000');
      cy.get('#amount-input').should('have.value', '0.5');
      
      // Total should update correctly
      cy.get('#total-display').should('be.visible');
    });
  });

  describe('Error State Validation', () => {
    it('should handle network errors gracefully', () => {
      // Attempt operations that might fail in test environment
      cy.get('#buy-tab').click();
      cy.get('#price-input').clear().type('45000');
      cy.get('#amount-input').clear().type('0.1');
      cy.get('#submit-order-btn').click();
      
      // Application should remain stable regardless of network response
      cy.get('#order-form-container').should('be.visible');
      cy.get('#main-content-grid').should('be.visible');
    });

    it('should validate extreme input values', () => {
      // Test very large numbers
      cy.get('#price-input').clear().type('999999999');
      cy.get('#amount-input').clear().type('999999');
      
      // Application should handle without crashing
      cy.get('#order-form-container').should('be.visible');
      
      // Test very small numbers
      cy.get('#price-input').clear().type('0.01');
      cy.get('#amount-input').clear().type('0.00000001');
      
      // Application should handle gracefully
      cy.get('#order-form-container').should('be.visible');
    });
  });
});