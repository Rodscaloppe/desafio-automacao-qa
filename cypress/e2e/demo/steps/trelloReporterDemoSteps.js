const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor');
const LoginPage = require('../../../support/pages/LoginPage');

Given('o usuário acessa a página de login', () => {
  LoginPage.visit();
});

When('o usuário insere email {string} e clica em login', (email) => {
  // Simula ação no formulário de login real
  LoginPage.fillSignupName('Usuario Teste Bug');
  LoginPage.fillSignupEmail(email);
  LoginPage.submitSignupStep1();
});

Then('o sistema deve exibir uma mensagem de boas-vindas', () => {
  // Isso vai falhar pois a assertion irá procurar algo que não existe (forçando a quebra e criação do JSON de falha)
  cy.get('[data-qa="welcome-message"]', { timeout: 1000 }).should('be.visible');
});
