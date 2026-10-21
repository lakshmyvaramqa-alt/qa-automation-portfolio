import homePage from '../../support/pages/HomePage';

describe('Network Interception and Mocking Suite', () => {
  it('NET-01 - Spy on entries network call and validate response schema', () => {
    cy.intercept('GET', '**/entries').as('entriesSpy');
    homePage.visit();

    cy.wait('@entriesSpy').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.have.property('Items');
      expect(interception.response.body.Items).to.be.an('array');
      expect(interception.response.body.Items.length).to.be.greaterThan(0);
    });

    homePage.getProductCards().should('have.length.greaterThan', 0);
  });

  it('NET-02 - Stub empty catalog response [] and verify UI shows 0 products', () => {
    cy.intercept('GET', '**/entries', {
      statusCode: 200,
      body: { Items: [] },
    }).as('emptyEntries');

    homePage.visit();
    cy.wait('@emptyEntries');

    // UI should display 0 product cards
    cy.get('#tbodyid .card').should('have.length', 0);
  });

  it('NET-03 - Stub 500 Internal Server Error and verify application resilience', () => {
    cy.intercept('GET', '**/entries', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('errorEntries');

    homePage.visit();
    cy.wait('@errorEntries');

    // App header and navbar remain functional
    cy.get('#nava').should('be.visible');
    cy.get('#tbodyid .card').should('not.exist');
  });

  it('NET-04 - Stub slow network response with delayed response and verify eventual rendering', () => {
    cy.intercept('GET', '**/entries', (req) => {
      req.on('response', (res) => {
        // Artificially delay response by 1500ms to simulate slow 3G
        res.setDelay(1500);
      });
    }).as('delayedEntries');

    homePage.visit();
    cy.wait('@delayedEntries');

    homePage.getProductCards().should('have.length.greaterThan', 0);
  });
});
