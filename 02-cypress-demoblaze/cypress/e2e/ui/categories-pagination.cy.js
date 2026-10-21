import homePage from '../../support/pages/HomePage';

describe('Categories and Pagination Suite', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/entries').as('getEntries');
    homePage.visit();
    cy.wait('@getEntries');
  });

  it('TC01 - Should display initial catalog with products on homepage', () => {
    homePage.getProductCards().should('have.length.greaterThan', 0);
    homePage.getProductTitles().first().should('be.visible').and('not.be.empty');
  });

  it('TC02 - Should filter products by Phones category', () => {
    cy.intercept('POST', '**/bycat').as('byCat');
    homePage.selectCategory('Phones');
    cy.wait('@byCat').its('response.statusCode').should('eq', 200);

    homePage.getProductCards().should('have.length.greaterThan', 0);
    homePage.getProductTitles().each(($el) => {
      const title = $el.text().toLowerCase();
      // Verify phone titles
      expect(title).to.satisfy((t) =>
        t.includes('samsung') || t.includes('nokia') || t.includes('nexus') ||
        t.includes('iphone') || t.includes('sony') || t.includes('htc')
      );
    });
  });

  it('TC03 - Should filter products by Laptops category', () => {
    cy.intercept('POST', '**/bycat').as('byCatLaptops');
    homePage.selectCategory('Laptops');
    cy.wait('@byCatLaptops').its('response.statusCode').should('eq', 200);

    homePage.getProductCards().should('have.length.greaterThan', 0);
    homePage.getProductTitles().first().should('be.visible');
  });

  it('TC04 - Should filter products by Monitors category', () => {
    cy.intercept('POST', '**/bycat').as('byCatMonitors');
    homePage.selectCategory('Monitors');
    cy.wait('@byCatMonitors').its('response.statusCode').should('eq', 200);

    homePage.getProductCards().should('have.length.greaterThan', 0);
    homePage.getProductTitles().each(($el) => {
      const title = $el.text().toLowerCase();
      expect(title).to.satisfy((t) => t.includes('apple') || t.includes('asus'));
    });
  });

  it('TC05 - Should navigate to Next page using pagination button', () => {
    cy.intercept('POST', '**/pagination').as('paginationNext');
    homePage.getNextButton().should('be.visible').click();
    cy.wait('@paginationNext').its('response.statusCode').should('eq', 200);

    homePage.getProductCards().should('have.length.greaterThan', 0);
    homePage.getPrevButton().should('be.visible');
  });

  it('TC06 - Should navigate back to Previous page using pagination button', () => {
    cy.intercept('POST', '**/pagination').as('paginationNext');
    homePage.getNextButton().click();
    cy.wait('@paginationNext');

    cy.intercept('POST', '**/pagination').as('paginationPrev');
    homePage.getPrevButton().click();
    cy.wait('@paginationPrev').its('response.statusCode').should('eq', 200);

    homePage.getProductCards().should('have.length.greaterThan', 0);
  });
});
