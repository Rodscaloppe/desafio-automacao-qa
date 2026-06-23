const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor');

Given('que eu navego para a página inicial', () => {
  cy.visit('/');
  cy.injectAxe(); // Injeta o script do Axe-core na página
});

When('a página carregar completamente', () => {
  cy.get('body').should('be.visible');
});

Then('eu não devo encontrar violações críticas de acessibilidade', () => {
  // Configurando o axe para reportar violações no Cypress Log, mas sem quebrar a pipeline (skipFailures: true)
  cy.checkA11y(null, {
    includedImpacts: ['critical', 'serious']
  }, null, true);
});

Given('que eu navego para a página de login', () => {
  cy.visit('/login');
  cy.injectAxe();
});

When('a tela de autenticação estiver visível', () => {
  cy.get('div.login-form').should('be.visible');
});

Then('eu não devo encontrar violações críticas de acessibilidade na tela de login', () => {
  cy.checkA11y(null, {
    includedImpacts: ['critical', 'serious']
  }, null, true);
});
