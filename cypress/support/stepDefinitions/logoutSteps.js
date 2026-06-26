import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import LoginPage from '../pages/LoginPage';

When('eu clico no botão "Logout"', () => {
  LoginPage.logout();
});

Then('o sistema deve me redirecionar para a tela de Login', () => {
  cy.url().should('include', '/login');
  cy.contains('Login to your account').should('be.visible');
});
