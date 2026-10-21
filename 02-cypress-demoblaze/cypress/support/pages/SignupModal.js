class SignupModal {
  getModal() {
    return cy.get('#signInModal');
  }

  getUsernameInput() {
    return cy.get('#sign-username');
  }

  getPasswordInput() {
    return cy.get('#sign-password');
  }

  getSignupButton() {
    return cy.get('button[onclick="register()"]');
  }

  getCloseButton() {
    return cy.get('#signInModal .btn-secondary').contains('Close');
  }

  fillCredentials(username, password) {
    if (username) this.getUsernameInput().clear().type(username);
    if (password) this.getPasswordInput().clear().type(password);
  }

  submit() {
    this.getSignupButton().click();
  }
}

export default new SignupModal();
