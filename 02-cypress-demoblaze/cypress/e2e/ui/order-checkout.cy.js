import cartPage from '../../support/pages/CartPage';
import placeOrderModal from '../../support/pages/PlaceOrderModal';

describe('Order Checkout Suite', () => {
  beforeEach(() => {
    // Add product to cart so cart has items for checkout
    cy.addProductToCart('Nexus 6');
    cy.intercept('POST', '**/viewcart').as('viewCart');
    cartPage.visit();
    cy.wait('@viewCart');
    // Ensure item row is rendered and total price is calculated before opening order modal
    cartPage.getCartItems().should('have.length.greaterThan', 0);
    cartPage.getTotalPrice().should('not.be.empty');
    cartPage.clickPlaceOrder();
    placeOrderModal.getModal().should('be.visible');
  });

  it('TC13 - Positive Checkout: Place order with complete details shows confirmation modal', () => {
    cy.fixture('order').then((data) => {
      placeOrderModal.fillOrder(data.validOrder);
      placeOrderModal.submitOrder();

      // Verify SweetAlert confirmation popup
      placeOrderModal.getConfirmationAlert()
        .should('be.visible')
        .and('contain.text', 'Thank you for your purchase!');

      // Verify purchase metadata (Id, Amount, Card Number)
      placeOrderModal.getConfirmationAlert().find('p.lead').invoke('text').then((info) => {
        expect(info).to.include('Id:');
        expect(info).to.include('Amount:');
        expect(info).to.include('Card Number:');
      });
    });
  });

  it('TC14 - Positive Checkout: Confirming purchase dismisses modal and redirects to home', () => {
    cy.fixture('order').then((data) => {
      placeOrderModal.fillOrder(data.validOrder);
      placeOrderModal.submitOrder();

      placeOrderModal.getConfirmationAlert().should('be.visible');
      placeOrderModal.confirmPurchase();

      // Should return to homepage
      cy.url({ timeout: 15000 }).should('include', 'index.html');
    });
  });

  it('TC15 - Negative Checkout: Submitting empty form triggers "Please fill out Name and Creditcard."', () => {
    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    placeOrderModal.submitOrder();

    cy.wrap(alertStub).should('be.calledWith', 'Please fill out Name and Creditcard.');
  });

  it('TC16 - Negative Checkout: Missing credit card triggers validation alert', () => {
    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    placeOrderModal.getNameInput().should('be.visible').clear().type('Jane Doe');
    placeOrderModal.submitOrder();

    cy.wrap(alertStub).should('be.calledWith', 'Please fill out Name and Creditcard.');
  });

  it('TC17 - Modal Dismiss: Closing modal via Close button dismisses without placing order', () => {
    placeOrderModal.dismissModal();
    placeOrderModal.getModal().should('not.be.visible');
  });
});
