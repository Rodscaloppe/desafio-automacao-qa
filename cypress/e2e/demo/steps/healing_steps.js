const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor');

Given('que estou na página inicial do site', () => {
  cy.visit('https://automationexercise.com/');
});

When('eu clico no botão mágico de cadastro', () => {
  cy.get('.botao-magico-de-login-quebrado', { timeout: 1000 }).click();
});

Then('a página de login deve abrir', () => {
  cy.get('.login-form').should('be.visible');
});
