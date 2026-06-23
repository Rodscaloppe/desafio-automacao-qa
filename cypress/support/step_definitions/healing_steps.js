const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor');

Given('que estou na página inicial do site', () => {
  cy.visit('https://automationexercise.com/');
});

When('eu clico no botão mágico de cadastro', () => {
  // Esse seletor está errado de propósito para forçar a quebra do teste.
  // O correto seria a[href="/login"]
  cy.get('li>a[href*="login"]', { timeout: 1000 }).click();
});

Then('a página de login deve abrir', () => {
  cy.get('.login-form').should('be.visible');
});
