import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Then('o sistema deve me redirecionar para a tela de Login', () => {
  cy.url().should('include', '/login');
  cy.contains('Login to your account').should('be.visible');
});

