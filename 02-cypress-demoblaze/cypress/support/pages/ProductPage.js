class ProductPage {
  getTitle() {
    return cy.get('.name');
  }

  getPrice() {
    return cy.get('.price-container');
  }

  getDescription() {
    return cy.get('#more-information');
  }

  getAddToCartButton() {
    return cy.contains('a', 'Add to cart');
  }

  addToCart() {
    this.getAddToCartButton().click();
  }
}

export default new ProductPage();
