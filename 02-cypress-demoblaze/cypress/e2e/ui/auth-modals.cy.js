import navbar from '../../support/pages/Navbar';
import signupModal from '../../support/pages/SignupModal';
import loginModal from '../../support/pages/LoginModal';
import contactModal from '../../support/pages/ContactModal';

describe('Authentication and Modals Suite', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('TC18 - Signup with unique new user displays "Sign up successful."', () => {
    const uniqueUser = `qa_user_${Date.now()}`;
    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    cy.intercept('POST', '**/signup').as('signupReq');
    cy.signup(uniqueUser, 'Password123!');
    cy.wait('@signupReq').its('response.statusCode').should('eq', 200);

    cy.wrap(alertStub).should('be.calledWith', 'Sign up successful.');
  });

  it('TC19 - Signup with already existing user displays "This user already exist."', () => {
    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    cy.intercept('POST', '**/signup').as('signupReq');
    // Attempt to register existing user
    cy.signup('test', 'test');
    cy.wait('@signupReq');

    cy.wrap(alertStub).should('be.calledWith', 'This user already exist.');
  });

  it('TC20 - Login with invalid credentials displays alert error message', () => {
    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    navbar.clickLogin();
    loginModal.getModal().should('be.visible');

    cy.intercept('POST', '**/login').as('loginReq');
    loginModal.fillCredentials('non_existent_user_99999', 'WrongPass!');
    loginModal.submit();
    cy.wait('@loginReq');

    cy.wrap(alertStub).should((stub) => {
      expect(stub.getCall(0).args[0]).to.match(/User does not exist|Wrong password/);
    });
  });

  it('TC21 - Login with valid credentials displays username in navbar', () => {
    navbar.clickLogin();
    loginModal.getModal().should('be.visible');

    cy.intercept('POST', '**/login').as('loginReq');
    loginModal.fillCredentials('test', 'test');
    loginModal.submit();
    cy.wait('@loginReq').its('response.statusCode').should('eq', 200);

    navbar.getUserGreeting().should('be.visible').and('contain.text', 'Welcome test');
    navbar.getLogoutLink().should('be.visible');
  });

  it('TC22 - Contact modal: Sending message displays "Thanks for the message!!"', () => {
    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    navbar.clickContact();
    contactModal.getModal().should('be.visible');

    cy.fixture('contact').then((contact) => {
      contactModal.fillMessage(contact.email, contact.name, contact.message);
      contactModal.sendMessage();
      cy.wrap(alertStub).should('be.calledWith', 'Thanks for the message!!');
    });
  });
});
