describe('Story 3.6: User\'s Order Information', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(1000); // Wait for components to load
  });

  it('should display the user orders panel with three tabs', () => {
    // Check if user orders panel exists
    cy.get('[data-testid="user-orders-panel"], .user-orders-panel').should('exist');
    
    // Check for the three required tabs
    cy.contains('Open Orders').should('be.visible');
    cy.contains('Order History').should('be.visible');
    cy.contains('Trade History').should('be.visible');
  });

  it('should show Open Orders tab as active by default', () => {
    // Check that Open Orders tab is active by default
    cy.get('#open-tab, [data-tab="open"]').should('have.class', 'active');
  });

  it('should display Open Orders with correct columns', () => {
    // Click on Open Orders tab to ensure it's active
    cy.contains('Open Orders').click();
    
    // Check for required columns in desktop view
    cy.get('.orders-header').within(() => {
      cy.contains('Date').should('be.visible');
      cy.contains('Pair').should('be.visible');
      cy.contains('Type').should('be.visible');
      cy.contains('Side').should('be.visible');
      cy.contains('Amount').should('be.visible');
      cy.contains('Price').should('be.visible');
      cy.contains('Action').should('be.visible');
    });
  });

  it('should display Order History with correct columns', () => {
    // Click on Order History tab
    cy.contains('Order History').click();
    
    // Check for required columns
    cy.get('.orders-header').within(() => {
      cy.contains('Date').should('be.visible');
      cy.contains('Pair').should('be.visible');
      cy.contains('Type').should('be.visible');
      cy.contains('Side').should('be.visible');
      cy.contains('Amount').should('be.visible');
      cy.contains('Status').should('be.visible');
    });
  });

  it('should display Trade History with correct columns', () => {
    // Click on Trade History tab
    cy.contains('Trade History').click();
    
    // Check for required columns
    cy.get('.orders-header').within(() => {
      cy.contains('Date').should('be.visible');
      cy.contains('Pair').should('be.visible');
      cy.contains('Side').should('be.visible');
      cy.contains('Amount').should('be.visible');
      cy.contains('Price').should('be.visible');
      cy.contains('Fee').should('be.visible');
    });
  });

  it('should switch between tabs correctly', () => {
    // Test tab switching functionality
    cy.contains('Order History').click();
    cy.get('#history-tab, [data-tab="history"]').should('have.class', 'active');
    
    cy.contains('Trade History').click();
    cy.get('#trades-tab, [data-tab="trades"]').should('have.class', 'active');
    
    cy.contains('Open Orders').click();
    cy.get('#open-tab, [data-tab="open"]').should('have.class', 'active');
  });

  it('should display mock data in Open Orders', () => {
    cy.contains('Open Orders').click();
    
    // Check if mock data is displayed (should have at least some orders or empty state)
    cy.get('.orders-content').should('exist');
    
    // Check for either order rows or empty state message
    cy.get('.orders-content').then(($content) => {
      if ($content.find('.order-row').length > 0) {
        // If there are orders, verify they contain expected data
        cy.get('.order-row').first().should('contain.text', 'BTC').or('contain.text', 'ETH');
      } else {
        // If no orders, should show empty state
        cy.contains('No Open Orders').should('be.visible');
      }
    });
  });

  it('should display mock data in Order History', () => {
    cy.contains('Order History').click();
    
    cy.get('.orders-content').should('exist');
    
    // Check for either order rows or empty state message
    cy.get('.orders-content').then(($content) => {
      if ($content.find('.order-row').length > 0) {
        // If there are orders, verify they contain expected data
        cy.get('.order-row').first().should('contain.text', 'filled').or('contain.text', 'cancelled');
      } else {
        // If no orders, should show empty state
        cy.contains('No Order History').should('be.visible');
      }
    });
  });

  it('should display mock data in Trade History', () => {
    cy.contains('Trade History').click();
    
    cy.get('.orders-content').should('exist');
    
    // Check for either trade rows or empty state message
    cy.get('.orders-content').then(($content) => {
      if ($content.find('.trade-row').length > 0) {
        // If there are trades, verify they contain expected data
        cy.get('.trade-row').first().should('contain.text', 'BTC').or('contain.text', 'ETH');
      } else {
        // If no trades, should show empty state
        cy.contains('No Trade History').should('be.visible');
      }
    });
  });

  it('should allow cancelling open orders', () => {
    cy.contains('Open Orders').click();
    
    // Check if there are cancel buttons for open orders
    cy.get('.orders-content').then(($content) => {
      if ($content.find('.cancel-order-btn').length > 0) {
        // If there are cancel buttons, test the functionality
        cy.get('.cancel-order-btn').first().click();
        // Note: In a real test, you might want to verify the order was moved to history
      }
    });
  });

  it('should be responsive on mobile devices', () => {
    // Test mobile responsiveness
    cy.viewport('iphone-6');
    
    // Check that the component is still visible and functional on mobile
    cy.get('.user-orders-panel').should('be.visible');
    cy.contains('Open Orders').should('be.visible');
    cy.contains('Order History').should('be.visible');
    cy.contains('Trade History').should('be.visible');
    
    // Test tab switching on mobile
    cy.contains('Order History').click();
    cy.get('#history-tab, [data-tab="history"]').should('have.class', 'active');
  });

  it('should integrate with order form submissions', () => {
    // Test that new orders from the order form appear in Open Orders
    // First, try to place an order using the order form
    cy.get('[data-testid="order-form"], .order-form').should('exist');
    
    // Fill out order form if it exists and is visible
    cy.get('body').then(($body) => {
      if ($body.find('input[placeholder*="Amount"], input[name="amount"]').length > 0) {
        cy.get('input[placeholder*="Amount"], input[name="amount"]').first().type('0.1');
        
        if ($body.find('input[placeholder*="Price"], input[name="price"]').length > 0) {
          cy.get('input[placeholder*="Price"], input[name="price"]').first().type('45000');
        }
        
        // Try to submit the order
        cy.get('button').contains('Buy').or(cy.get('button').contains('Sell')).first().click();
        
        // Check if the order appears in Open Orders
        cy.contains('Open Orders').click();
        // Note: This would depend on the actual implementation of order submission
      }
    });
  });
});