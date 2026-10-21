class HomePage {
  visit() {
    cy.visit('/');
  }

  getCategoryPhones() {
    return cy.contains('.list-group-item', 'Phones');
  }

  getCategoryLaptops() {
    return cy.contains('.list-group-item', 'Laptops');
  }

  getCategoryMonitors() {
    return cy.contains('.list-group-item', 'Monitors');
  }

  getProductCards() {
    return cy.get('#tbodyid .card');
  }

  getProductTitles() {
    return cy.get('#tbodyid .card-title a');
  }

  getProductPrices() {
    return cy.get('#tbodyid h5');
  }

  getNextButton() {
    return cy.get('#next2');
  }

  getPrevButton() {
    return cy.get('#prev2');
  }

  selectCategory(categoryName) {
    cy.contains('.list-group-item', categoryName).click();
  }

  clickProduct(productName) {
    cy.contains('#tbodyid .card-title a', productName).click();
  }
}

export default new HomePage();
