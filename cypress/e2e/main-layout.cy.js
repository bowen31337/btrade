describe('Main Layout Test', () => {
  it('should verify the main layout of the BTrade application', () => {
    cy.visit('/');
    
    // Check if the navigation header container is visible
    cy.get('#navigation-header-container').should('be.visible');
    
    // Check for main content grid
    cy.get('#main-content-grid').should('be.visible');
    
    // Check for main layout panels based on actual structure
    cy.get('.col-span-12.sm\\:col-span-2').should('exist'); // Left panel (Trading Pairs)
    cy.get('.col-span-12.sm\\:col-span-7').should('exist'); // Center panel (Chart and Order Form)
    cy.get('.col-span-12.sm\\:col-span-3').should('exist'); // Right panel (Order Book, Market Trades)
    
    // Check for specific container elements
    cy.get('#trading-pair-selector-container').should('be.visible');
    cy.get('#price-chart-container').should('be.visible');
    cy.get('#order-form-container').should('be.visible');
    cy.get('#order-book-container').should('be.visible');
    cy.get('#market-trades-container').should('be.visible');
    cy.get('#user-orders-container').should('be.visible');
  });
});