class CartPage {
  visit() {
    cy.visit('/cart.html');
  }

  getCartItems() {
    return cy.get('#tbodyid tr');
  }

  getItemTitles() {
    return cy.get('#tbodyid tr td:nth-child(2)');
  }

  getItemPrices() {
    return cy.get('#tbodyid tr td:nth-child(3)');
  }

  getTotalPrice() {
    return cy.get('#totalp');
  }

  getPlaceOrderButton() {
    return cy.get('button[data-target="#orderModal"]');
  }

  deleteItem(index = 0) {
    cy.get('#tbodyid tr td a:contains("Delete")').eq(index).click();
  }

  clickPlaceOrder() {
    this.getPlaceOrderButton().click();
    cy.window().should((win) => {
      if (win.$) {
        const bsModal = win.$('#orderModal').data('bs.modal');
        expect(bsModal && bsModal._isTransitioning === false).to.be.true;
      }
    });
  }
}

export default new CartPage();
