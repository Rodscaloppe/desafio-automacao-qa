import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import LoginPage from '../pages/LoginPage';

Given('tento logar com o email {string} e senha {string}', (email, password) => {
  LoginPage.login(email, password);
});

Then('devo ver a mensagem de erro {string}', (message) => {
  LoginPage.verifyLoginError(message);
});

When('tento me cadastrar com um e-mail já existente {string}', (email) => {
  LoginPage.submitSignupStep1('Usuario Teste', email);
});

Then('devo ver a mensagem de erro de cadastro {string}', (message) => {
  LoginPage.verifySignupError(message);
});
