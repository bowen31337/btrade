describe('OrderForm Tab Switching', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.wait(1000) // Allow components to initialize
  })

  describe('Order Type Tab Display', () => {
    it('should display Market and Limit tabs in the order form', () => {
      cy.get('#limit-tab').should('be.visible').and('contain.text', 'Limit')
      cy.get('#market-tab').should('be.visible').and('contain.text', 'Market')
    })

    it('should have Limit tab active by default', () => {
      cy.get('#limit-tab').should('have.class', 'active')
      cy.get('#market-tab').should('not.have.class', 'active')
    })
  })

  describe('Market Tab Selection', () => {
    it('should activate Market tab when clicked', () => {
      cy.get('#market-tab').click()
      cy.get('#market-tab').should('have.class', 'active')
      cy.get('#limit-tab').should('not.have.class', 'active')
    })

    it('should hide price input when Market tab is selected', () => {
      cy.get('#market-tab').click()
      cy.get('#price-input-group').should('have.css', 'display', 'none')
    })

    it('should maintain form functionality when Market tab is active', () => {
      cy.get('#market-tab').click()
      
      // Test amount input still works
      cy.get('#amount-input').clear().type('0.5')
      cy.get('#amount-input').should('have.value', '0.5')
      
      // Test that total input exists (it's readonly so we just check existence)
      cy.get('#total-input').should('exist')
    })
  })

  describe('Limit Tab Selection', () => {
    it('should activate Limit tab when clicked after Market', () => {
      // First switch to Market
      cy.get('#market-tab').click()
      cy.get('#market-tab').should('have.class', 'active')
      
      // Then switch back to Limit
      cy.get('#limit-tab').click()
      cy.get('#limit-tab').should('have.class', 'active')
      cy.get('#market-tab').should('not.have.class', 'active')
    })

    it('should show price input when Limit tab is selected', () => {
      // Start with Market tab (price hidden)
      cy.get('#market-tab').click()
      cy.get('#price-input-group').should('have.css', 'display', 'none')
      
      // Switch to Limit tab (price should show)
      cy.get('#limit-tab').click()
      cy.get('#price-input-group').should('have.css', 'display', 'block')
    })

    it('should enable price specification for limit orders', () => {
      cy.get('#limit-tab').click()
      
      // Test price input is accessible and functional
      cy.get('#price-input').should('be.visible').clear().type('45000')
      cy.get('#price-input').should('have.value', '45000')
      
      // Test total calculation with price
      cy.get('#amount-input').clear().type('0.1')
      cy.get('#total-input').should('contain.value', '4500')
    })
  })

  describe('Tab Switching Behavior', () => {
    it('should persist order type selection during component lifecycle', () => {
      // Switch to Market
      cy.get('#market-tab').click()
      cy.get('#market-tab').should('have.class', 'active')
      
      // Fill some form data
      cy.get('#amount-input').clear().type('0.25')
      
      // Simulate a component update by switching tabs back and forth
      cy.get('#limit-tab').click()
      cy.get('#market-tab').click()
      
      // Market tab should still be active
      cy.get('#market-tab').should('have.class', 'active')
      cy.get('#price-input-group').should('have.css', 'display', 'none')
    })

    it('should work smoothly without affecting other form data', () => {
      // Fill form data
      cy.get('#amount-input').clear().type('0.5')
      
      // Switch between tabs multiple times
      cy.get('#market-tab').click()
      cy.get('#limit-tab').click()
      cy.get('#market-tab').click()
      cy.get('#limit-tab').click()
      
      // Amount should be preserved
      cy.get('#amount-input').should('have.value', '0.5')
      
      // Final state should be correct (Limit active, price visible)
      cy.get('#limit-tab').should('have.class', 'active')
      cy.get('#price-input-group').should('have.css', 'display', 'block')
    })

    it('should provide proper visual feedback for active tab', () => {
      // Test Limit tab active styling
      cy.get('#limit-tab').should('have.class', 'active')
      
      // Switch to Market and test styling
      cy.get('#market-tab').click()
      cy.get('#market-tab').should('have.class', 'active')
      cy.get('#limit-tab').should('not.have.class', 'active')
      
      // Verify visual distinction (active tabs should have different styling)
      cy.get('#market-tab.active').should('exist')
      cy.get('#limit-tab:not(.active)').should('exist')
    })
  })

  describe('Total Calculation Integration', () => {
    it('should calculate total correctly for Market orders', () => {
      cy.get('#market-tab').click()
      
      // Enter amount
      cy.get('#amount-input').clear().type('0.1')
      
      // Wait for calculation and check total is populated
      cy.get('#total-input').should('not.have.value', '')
      cy.get('#total-input').invoke('val').then((val) => {
        expect(parseFloat(val)).to.be.greaterThan(0)
      })
    })

    it('should calculate total correctly for Limit orders', () => {
      cy.get('#limit-tab').click()
      
      // Enter price and amount
      cy.get('#price-input').clear().type('50000')
      cy.get('#amount-input').clear().type('0.1')
      
      // Total should be price * amount = 5000
      cy.get('#total-input').should('contain.value', '5000')
    })

    it('should update total when switching between order types', () => {
      // Set up Limit order
      cy.get('#limit-tab').click()
      cy.get('#price-input').clear().type('50000')
      cy.get('#amount-input').clear().type('0.1')
      
      let limitTotal
      cy.get('#total-input').invoke('val').then((val) => {
        limitTotal = val
      })
      
      // Switch to Market order
      cy.get('#market-tab').click()
      
      // Total should recalculate based on market price
      cy.get('#total-input').invoke('val').should((marketTotal) => {
        // Market total might be different from limit total
        expect(marketTotal).to.match(/^\d+(\.\d+)?$/)
      })
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('should handle rapid tab switching without errors', () => {
      // Rapidly switch between tabs
      for (let i = 0; i < 5; i++) {
        cy.get('#market-tab').click()
        cy.get('#limit-tab').click()
      }
      
      // Should end in stable state
      cy.get('#limit-tab').should('have.class', 'active')
      cy.get('#price-input-group').should('have.css', 'display', 'block')
    })

    it('should maintain accessibility during tab switching', () => {
      // Test keyboard navigation
      cy.get('#limit-tab').focus().should('be.focused')
      cy.get('#limit-tab').type('{enter}')
      cy.get('#limit-tab').should('have.class', 'active')
      
      // Tab to Market tab and activate
      cy.get('#market-tab').focus().should('be.focused')
      cy.get('#market-tab').type('{enter}')
      cy.get('#market-tab').should('have.class', 'active')
    })
  })
})