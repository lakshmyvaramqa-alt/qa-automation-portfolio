// Custom commands for Demoblaze Cypress framework

/**
 * Custom command to perform user registration via UI
 */
Cypress.Commands.add('signup', (username, password) => {
  cy.get('#signin2').click();
  cy.get('#signInModal').should('be.visible');
  cy.get('#sign-username').clear().type(username);
  cy.get('#sign-password').clear().type(password);
  cy.get('button[onclick="register()"]').click();
});

/**
 * Custom command to perform user login via UI
 */
Cypress.Commands.add('login', (username, password) => {
  cy.get('#login2').click();
  cy.get('#logInModal').should('be.visible');
  cy.get('#loginusername').clear().type(username);
  cy.get('#loginpassword').clear().type(password);
  cy.get('button[onclick="logIn()"]').click();
  cy.get('#nameofuser').should('be.visible').and('contain.text', username);
});

/**
 * Custom command to cache user session via cy.session
 */
Cypress.Commands.add('loginSession', (username, password) => {
  cy.session([username, password], () => {
    cy.visit('/');
    cy.get('#login2').click();
    cy.get('#logInModal').should('be.visible');
    cy.intercept('POST', '**/login').as('sessionLogin');
    cy.intercept('POST', '**/check').as('sessionCheck');
    cy.get('#loginusername').clear().type(username);
    cy.get('#loginpassword').clear().type(password);
    cy.get('button[onclick="logIn()"]').click();
    cy.wait('@sessionLogin').its('response.statusCode').should('eq', 200);
    cy.wait('@sessionCheck');
    cy.get('#nameofuser', { timeout: 15000 }).should('be.visible').and('contain.text', username);
  }, {
    validate() {
      cy.getCookie('tokenp_').should('exist');
    }
  });
});

/**
 * Custom command to add a specific product to the cart
 */
Cypress.Commands.add('addProductToCart', (productName) => {
  cy.intercept('GET', '**/entries').as('getEntries');
  cy.intercept('POST', '**/view').as('getView');
  cy.intercept('POST', '**/addtocart').as('addToCartReq');
  cy.visit('/');
  cy.wait('@getEntries');
  cy.contains('.card-title a', productName).click();
  cy.wait('@getView');
  cy.get('.name').should('have.text', productName);
  cy.contains('a', 'Add to cart').click();
  cy.wait('@addToCartReq').its('response.statusCode').should('eq', 200);
});

/**
 * Custom command to fill the Place Order checkout form
 */
Cypress.Commands.add('fillOrderForm', (orderData) => {
  if (orderData.name) cy.get('#orderModal #name').clear().type(orderData.name);
  if (orderData.country) cy.get('#orderModal #country').clear().type(orderData.country);
  if (orderData.city) cy.get('#orderModal #city').clear().type(orderData.city);
  if (orderData.card) cy.get('#orderModal #card').clear().type(orderData.card);
  if (orderData.month) cy.get('#orderModal #month').clear().type(orderData.month);
  if (orderData.year) cy.get('#orderModal #year').clear().type(orderData.year);
  cy.get('button[onclick="purchaseOrder()"]').click();
});
