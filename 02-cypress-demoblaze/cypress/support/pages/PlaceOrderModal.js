class PlaceOrderModal {
  getModal() {
    return cy.get('#orderModal');
  }

  getNameInput() {
    return cy.get('#orderModal #name');
  }

  getCountryInput() {
    return cy.get('#orderModal #country');
  }

  getCityInput() {
    return cy.get('#orderModal #city');
  }

  getCardInput() {
    return cy.get('#orderModal #card');
  }

  getMonthInput() {
    return cy.get('#orderModal #month');
  }

  getYearInput() {
    return cy.get('#orderModal #year');
  }

  getPurchaseButton() {
    return cy.get('button[onclick="purchaseOrder()"]');
  }

  getCloseButton() {
    return cy.get('#orderModal button[data-dismiss="modal"]').contains('Close');
  }

  dismissModal() {
    this.getCloseButton().scrollIntoView().click({ force: true });
  }

  getConfirmationAlert() {
    return cy.get('.sweet-alert.visible', { timeout: 15000 });
  }

  getConfirmOkButton() {
    return cy.get('.sweet-alert.visible .confirm');
  }

  fillOrder(data) {
    if (data.name) this.getNameInput().should('be.visible').clear().type(data.name);
    if (data.country) this.getCountryInput().should('be.visible').clear().type(data.country);
    if (data.city) this.getCityInput().should('be.visible').clear().type(data.city);
    if (data.card) this.getCardInput().should('be.visible').clear().type(data.card);
    if (data.month) this.getMonthInput().should('be.visible').clear().type(data.month);
    if (data.year) this.getYearInput().should('be.visible').clear().type(data.year);
  }

  submitOrder() {
    this.getPurchaseButton().scrollIntoView().click({ force: true });
  }

  confirmPurchase() {
    this.getConfirmOkButton().scrollIntoView().click({ force: true });
  }
}

export default new PlaceOrderModal();
