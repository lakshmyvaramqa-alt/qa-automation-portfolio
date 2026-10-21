class ContactModal {
  getModal() {
    return cy.get('#exampleModal');
  }

  getEmailInput() {
    return cy.get('#recipient-email');
  }

  getNameInput() {
    return cy.get('#recipient-name');
  }

  getMessageInput() {
    return cy.get('#message-text');
  }

  getSendMessageButton() {
    return cy.get('button[onclick="send()"]');
  }

  getCloseButton() {
    return cy.get('#exampleModal .btn-secondary').contains('Close');
  }

  fillMessage(email, name, message) {
    if (email) this.getEmailInput().type(email);
    if (name) this.getNameInput().type(name);
    if (message) this.getMessageInput().type(message);
  }

  sendMessage() {
    this.getSendMessageButton().click();
  }
}

export default new ContactModal();
