import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import LoginPage from '../pages/LoginPage';

Given('que eu acesso a página inicial', () => {
  cy.visit('/');
});

When('eu navego para a página de login\\/signup', () => {
  LoginPage.visit();
});

When('crio uma nova conta com dados válidos', () => {
  LoginPage.fillSignupFormAndSubmit();
});

Then('eu devo estar logado com sucesso', () => {
  LoginPage.verifyLoggedIn();
});

Then('minha conta deve ser deletada no final para limpeza de massa', () => {
  LoginPage.deleteAccount();
});
