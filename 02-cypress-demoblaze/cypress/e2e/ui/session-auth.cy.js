import navbar from '../../support/pages/Navbar';

describe('Cached Session Authentication Suite', () => {
  beforeEach(() => {
    // Utilize cy.session to log in and preserve cookies/localStorage across tests
    cy.intercept('POST', '**/check').as('checkToken');
    cy.loginSession('test', 'test');
    cy.visit('/');
    cy.wait('@checkToken');
  });

  it('TC23 - Session persistence: Verify authenticated state is active on homepage', () => {
    navbar.getUserGreeting().should('be.visible').and('contain.text', 'Welcome test');
    navbar.getLogoutLink().should('be.visible');
    navbar.getLoginLink().should('not.be.visible');
  });

  it('TC24 - Session persistence: Navigating to cart maintains authenticated user state', () => {
    cy.intercept('POST', '**/check').as('checkCartToken');
    navbar.clickCart();
    cy.wait('@checkCartToken');
    navbar.getUserGreeting().should('be.visible').and('contain.text', 'Welcome test');
    navbar.getLogoutLink().should('be.visible');
  });

  it('TC25 - Logout functionality: Logging out clears session and restores login button', () => {
    navbar.clickLogout();
    navbar.getLoginLink().should('be.visible');
    navbar.getSignupLink().should('be.visible');
    navbar.getUserGreeting().should('not.be.visible');
  });
});
