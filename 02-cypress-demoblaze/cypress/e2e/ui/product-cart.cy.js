import homePage from '../../support/pages/HomePage';
import productPage from '../../support/pages/ProductPage';
import cartPage from '../../support/pages/CartPage';

describe('Product Details and Cart Suite', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/entries').as('getEntries');
    homePage.visit();
    cy.wait('@getEntries');
  });

  it('TC07 - Should display product details with correct title, price and description', () => {
    cy.intercept('POST', '**/view').as('viewProduct');
    homePage.clickProduct('Samsung galaxy s6');
    cy.wait('@viewProduct').its('response.statusCode').should('eq', 200);

    productPage.getTitle().should('have.text', 'Samsung galaxy s6');
    productPage.getPrice().should('contain.text', '$360');
    productPage.getDescription().should('be.visible').and('not.be.empty');
    productPage.getAddToCartButton().should('be.visible');
  });

  it('TC08 - Should trigger native window:alert "Product added" when clicking Add to cart', () => {
    cy.intercept('POST', '**/view').as('viewProduct');
    homePage.clickProduct('Samsung galaxy s6');
    cy.wait('@viewProduct');

    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    cy.intercept('POST', '**/addtocart').as('addToCart');
    productPage.addToCart();
    cy.wait('@addToCart').then(() => {
      expect(alertStub).to.have.been.calledWith('Product added');
    });
  });

  it('TC09 - Should display added products in the Cart table', () => {
    // Add product using custom command
    cy.intercept('POST', '**/viewcart').as('viewCart');
    cy.addProductToCart('Nokia lumia 1520');

    cartPage.visit();
    cy.wait('@viewCart');

    cartPage.getCartItems().should('have.length.greaterThan', 0);
    cartPage.getItemTitles().should('contain.text', 'Nokia lumia 1520');
  });

  it('TC10 - Should calculate cart total price accurately', () => {
    cy.addProductToCart('Nexus 6');
    cy.intercept('POST', '**/viewcart').as('viewCart');
    cartPage.visit();
    cy.wait('@viewCart');

    cartPage.getCartItems().should('have.length.greaterThan', 0);
    cartPage.getTotalPrice().should('not.be.empty');

    // Sum individual line item prices and compare to displayed total
    let calculatedSum = 0;
    cartPage.getItemPrices().each(($price) => {
      calculatedSum += parseFloat($price.text().trim());
    }).then(() => {
      cartPage.getTotalPrice().invoke('text').then((totalText) => {
        expect(parseFloat(totalText.trim())).to.eq(calculatedSum);
      });
    });
  });

  it('TC11 - Should delete a product from the cart and update line items', () => {
    cy.addProductToCart('Nexus 6');
    cy.intercept('POST', '**/viewcart').as('viewCart');
    cartPage.visit();
    cy.wait('@viewCart');

    cartPage.getCartItems().should('have.length.greaterThan', 0);
    cartPage.getCartItems().its('length').then((initialCount) => {
      cy.intercept('POST', '**/deleteitem').as('deleteItem');
      cartPage.deleteItem(0);
      cy.wait('@deleteItem').its('response.statusCode').should('eq', 200);

      // Verify row is removed or count decreased
      if (initialCount > 1) {
        cartPage.getCartItems().should('have.length', initialCount - 1);
      } else {
        cartPage.getCartItems().should('not.exist');
      }
    });
  });

  it('TC12 - Should handle empty cart state gracefully', () => {
    cy.intercept('POST', '**/viewcart').as('viewCart');
    cartPage.visit();
    cy.wait('@viewCart');

    // Clean up remaining items if any
    cy.get('body').then(($body) => {
      if ($body.find('#tbodyid tr').length > 0) {
        cy.intercept('POST', '**/deleteitem').as('del');
        cartPage.deleteItem(0);
        cy.wait('@del');
      }
    });

    cartPage.getPlaceOrderButton().should('be.visible');
  });
});
