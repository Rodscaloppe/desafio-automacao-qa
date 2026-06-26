import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import LoginPage from '../pages/LoginPage';

// Ação: Injeta credenciais de login a partir dos cenários do Cucumber para forçar falhas
Given('tento logar com o email {string} e senha {string}', (email, password) => {
  LoginPage.login(email, password);
});

// Validação: Garante que a aplicação rejeitou a entrada e exibiu a mensagem de falha na tela de login
Then('devo ver a mensagem de erro {string}', (message) => {
  LoginPage.verifyLoginError(message);
});

// Ação: Tenta burlar o sistema cadastrando um e-mail que já foi injetado previamente no banco
When('tento me cadastrar com um e-mail já existente {string}', (email) => {
  LoginPage.submitSignupStep1('Usuario Teste', email, false);
});

// Validação: Verifica se o sistema blindou o cadastro duplicado e disparou o alerta no formulário
Then('devo ver a mensagem de erro de cadastro {string}', (message) => {
  LoginPage.verifySignupError(message);
});
