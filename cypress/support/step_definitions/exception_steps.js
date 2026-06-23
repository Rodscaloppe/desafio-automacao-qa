import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import LoginPage from '../pages/LoginPage';

Given('tento logar com o email {string} e senha {string}', (email, password) => {
  LoginPage.login(email, password);
});

Then('devo ver a mensagem de erro {string}', (message) => {
  LoginPage.verifyLoginError(message);
});
