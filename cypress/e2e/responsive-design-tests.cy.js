describe('Responsive Design Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.wait(3000); // Allow components to load
  });

  describe('Desktop Viewport Tests', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080); // Large desktop
    });

    it('should display all components properly on large desktop', () => {
      // Verify all main components are visible
      cy.get('#main-content-grid').should('be.visible');
      cy.get('#price-chart-container').should('be.visible');
      cy.get('#order-form-container').should('be.visible');
      cy.get('#order-book-container').should('be.visible');
      cy.get('#trading-pair-selector-container').should('be.visible');
      
      // Verify components have adequate spacing
      cy.get('#main-content-grid').should('have.css', 'display', 'grid');
    });

    it('should maintain proper layout proportions on desktop', () => {
      // Check that components don't overlap
      cy.get('#price-chart-container').then(($chart) => {
        cy.get('#order-form-container').then(($form) => {
          const chartRect = $chart[0].getBoundingClientRect();
          const formRect = $form[0].getBoundingClientRect();
          
          // Components should not overlap (allowing for small margins)
          expect(chartRect.right).to.be.lessThan(formRect.left + 10);
        });
      });
    });
  });

  describe('Tablet Viewport Tests', () => {
    beforeEach(() => {
      cy.viewport(768, 1024); // iPad portrait
    });

    it('should adapt layout for tablet screens', () => {
      // Main container should still be visible
      cy.get('#main-content-grid').should('be.visible');
      
      // Key components should remain accessible
      cy.get('#price-chart-container').should('be.visible');
      cy.get('#order-form-container').should('be.visible');
      
      // Form should remain functional
      cy.get('#buy-tab').should('be.visible').click();
      cy.get('#price-input').should('be.visible');
      cy.get('#amount-input').should('be.visible');
    });

    it('should handle tablet landscape orientation', () => {
      cy.viewport(1024, 768); // iPad landscape
      
      // Layout should adapt to landscape
      cy.get('#main-content-grid').should('be.visible');
      cy.get('#price-chart-container').should('be.visible');
      cy.get('#order-form-container').should('be.visible');
      
      // Interactive elements should remain accessible
      cy.get('#buy-tab').click();
      cy.get('#price-input').clear().type('45000');
      cy.get('#amount-input').clear().type('0.1');
      cy.get('#submit-order-btn').should('be.visible');
    });
  });

  describe('Mobile Viewport Tests', () => {
    beforeEach(() => {
      cy.viewport(375, 667); // iPhone SE
    });

    it('should display mobile-optimized layout', () => {
      // Main container should be visible
      cy.get('#main-content-grid').should('be.visible');
      
      // Essential components should be accessible
      cy.get('#order-form-container').should('be.visible');
      
      // Form elements should be touch-friendly
      cy.get('#buy-tab').should('be.visible');
      cy.get('#sell-tab').should('be.visible');
    });

    it('should handle mobile form interactions', () => {
      // Test form usability on mobile
      cy.get('#buy-tab').click();
      
      // Input fields should be accessible
      cy.get('#price-input').should('be.visible').clear().type('45000');
      cy.get('#amount-input').should('be.visible').clear().type('0.1');
      
      // Submit button should be reachable
      cy.get('#submit-order-btn').should('be.visible');
      
      // Tab switching should work
      cy.get('#sell-tab').click();
      cy.get('#sell-tab').should('have.class', 'active').or('have.attr', 'aria-selected', 'true');
    });

    it('should handle small mobile screens', () => {
      cy.viewport(320, 568); // iPhone 5/SE
      
      // Core functionality should remain accessible
      cy.get('#order-form-container').should('be.visible');
      cy.get('#buy-tab').should('be.visible').click();
      
      // Form should be usable even on small screens
      cy.get('#price-input').should('be.visible');
      cy.get('#amount-input').should('be.visible');
    });
  });

  describe('Large Mobile Viewport Tests', () => {
    beforeEach(() => {
      cy.viewport(414, 896); // iPhone 11 Pro Max
    });

    it('should optimize for large mobile screens', () => {
      // Should have better space utilization than small mobile
      cy.get('#main-content-grid').should('be.visible');
      cy.get('#price-chart-container').should('be.visible');
      cy.get('#order-form-container').should('be.visible');
      
      // More components might be visible
      cy.get('#order-book-container').should('be.visible');
    });
  });

  describe('Ultra-wide Desktop Tests', () => {
    beforeEach(() => {
      cy.viewport(2560, 1440); // Ultra-wide monitor
    });

    it('should utilize ultra-wide screen space effectively', () => {
      // All components should be visible with good spacing
      cy.get('#main-content-grid').should('be.visible');
      cy.get('#price-chart-container').should('be.visible');
      cy.get('#order-form-container').should('be.visible');
      cy.get('#order-book-container').should('be.visible');
      cy.get('#trading-pair-selector-container').should('be.visible');
      
      // Layout should not be stretched awkwardly
      cy.get('#main-content-grid').should('have.css', 'max-width').and('not.equal', 'none');
    });
  });

  describe('Responsive Component Behavior', () => {
    it('should maintain functionality across viewport changes', () => {
      // Start with desktop
      cy.viewport(1920, 1080);
      cy.get('#buy-tab').click();
      cy.get('#price-input').clear().type('45000');
      cy.get('#amount-input').clear().type('0.1');
      
      // Switch to tablet
      cy.viewport(768, 1024);
      cy.get('#price-input').should('have.value', '45000');
      cy.get('#amount-input').should('have.value', '0.1');
      
      // Switch to mobile
      cy.viewport(375, 667);
      cy.get('#order-form-container').should('be.visible');
      cy.get('#submit-order-btn').should('be.visible');
    });

    it('should handle rapid viewport changes', () => {
      const viewports = [
        [1920, 1080], // Desktop
        [768, 1024],  // Tablet
        [375, 667],   // Mobile
        [1024, 768],  // Tablet landscape
        [414, 896]    // Large mobile
      ];
      
      viewports.forEach(([width, height]) => {
        cy.viewport(width, height);
        cy.wait(500);
        
        // Core components should remain functional
        cy.get('#main-content-grid').should('be.visible');
        cy.get('#order-form-container').should('be.visible');
      });
    });
  });

  describe('Touch and Interaction Tests', () => {
    beforeEach(() => {
      cy.viewport(375, 667); // Mobile viewport for touch testing
    });

    it('should handle touch interactions properly', () => {
      // Test tap interactions
      cy.get('#buy-tab').click();
      cy.get('#buy-tab').should('have.class', 'active').or('have.attr', 'aria-selected', 'true');
      
      cy.get('#sell-tab').click();
      cy.get('#sell-tab').should('have.class', 'active').or('have.attr', 'aria-selected', 'true');
      
      // Test form interactions
      cy.get('#price-input').click().clear().type('45000');
      cy.get('#amount-input').click().clear().type('0.1');
      
      // Test button interactions
      cy.get('#submit-order-btn').should('be.visible');
    });

    it('should provide adequate touch targets', () => {
      // Buttons should be large enough for touch
      cy.get('#buy-tab').then(($btn) => {
        const rect = $btn[0].getBoundingClientRect();
        // Minimum touch target size should be around 44px
        expect(rect.height).to.be.at.least(30);
        expect(rect.width).to.be.at.least(30);
      });
      
      cy.get('#sell-tab').then(($btn) => {
        const rect = $btn[0].getBoundingClientRect();
        expect(rect.height).to.be.at.least(30);
        expect(rect.width).to.be.at.least(30);
      });
    });
  });

  describe('Content Overflow and Scrolling', () => {
    it('should handle content overflow gracefully on small screens', () => {
      cy.viewport(320, 568); // Very small screen
      
      // Page should not have horizontal scroll
      cy.get('body').then(($body) => {
        expect($body[0].scrollWidth).to.be.at.most($body[0].clientWidth + 5);
      });
      
      // Content should be accessible
      cy.get('#order-form-container').should('be.visible');
    });

    it('should maintain proper scrolling behavior', () => {
      cy.viewport(375, 667);
      
      // Vertical scrolling should work if needed
      cy.scrollTo('bottom');
      cy.get('#order-form-container').should('be.visible');
      
      cy.scrollTo('top');
      cy.get('#main-content-grid').should('be.visible');
    });
  });

  describe('Performance on Different Viewports', () => {
    it('should maintain performance across viewport changes', () => {
      const startTime = Date.now();
      
      // Test multiple viewport changes
      cy.viewport(1920, 1080);
      cy.wait(200);
      cy.viewport(375, 667);
      cy.wait(200);
      cy.viewport(768, 1024);
      cy.wait(200);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete viewport changes reasonably quickly
      expect(duration).to.be.lessThan(5000);
      
      // Final state should be stable
      cy.get('#main-content-grid').should('be.visible');
      cy.get('#order-form-container').should('be.visible');
    });
  });
});