class LoginModal {
  getModal() {
    return cy.get('#logInModal');
  }

  getUsernameInput() {
    return cy.get('#loginusername');
  }

  getPasswordInput() {
    return cy.get('#loginpassword');
  }

  getLoginButton() {
    return cy.get('button[onclick="logIn()"]');
  }

  getCloseButton() {
    return cy.get('#logInModal .btn-secondary').contains('Close');
  }

  fillCredentials(username, password) {
    if (username) this.getUsernameInput().clear().type(username);
    if (password) this.getPasswordInput().clear().type(password);
  }

  submit() {
    this.getLoginButton().click();
  }
}

export default new LoginModal();
