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

When('inicio o cadastro com um novo e-mail', () => {
  const { faker } = require('@faker-js/faker');
  const name = faker.name.firstName();
  const email = faker.internet.email();
  LoginPage.submitSignupStep1(name, email);
});

When('tento criar a conta sem preencher o campo obrigatório {string}', (fieldName) => {
  LoginPage.fillPartialSignupForm(fieldName);
});

Then('o sistema deve alertar que o campo {string} é obrigatório com a mensagem {string}', (fieldName, message) => {
  LoginPage.verifyFieldValidationMessage(fieldName, message);
});
