import 'cypress-mochawesome-reporter/register';
import './commands';

// Prevent uncaught exceptions originating from Demoblaze app from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
