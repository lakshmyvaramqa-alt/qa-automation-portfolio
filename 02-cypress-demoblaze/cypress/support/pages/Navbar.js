class Navbar {
  getHomeLink() {
    return cy.contains('a.nav-link', 'Home');
  }

  getContactLink() {
    return cy.get('[data-target="#exampleModal"]');
  }

  getAboutUsLink() {
    return cy.get('[data-target="#videoModal"]');
  }

  getCartLink() {
    return cy.get('#cartur');
  }

  getLoginLink() {
    return cy.get('#login2');
  }

  getSignupLink() {
    return cy.get('#signin2');
  }

  getUserGreeting() {
    return cy.get('#nameofuser');
  }

  getLogoutLink() {
    return cy.get('#logout2');
  }

  clickHome() {
    this.getHomeLink().click();
  }

  clickContact() {
    this.getContactLink().click();
  }

  clickCart() {
    this.getCartLink().click();
  }

  clickLogin() {
    this.getLoginLink().click();
  }

  clickSignup() {
    this.getSignupLink().click();
  }

  clickLogout() {
    this.getLogoutLink().click();
  }
}

export default new Navbar();
