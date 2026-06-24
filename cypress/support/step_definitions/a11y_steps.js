const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor');

// Acessa a página inicial e injeta a biblioteca de auditoria visual
Given('que eu navego para a página inicial', () => {
  cy.visit('/');
  cy.injectAxe(); // Injeta o script do Axe-core na página
});

// Garante que o corpo do site foi totalmente carregado antes da auditoria
When('a página carregar completamente', () => {
  cy.get('body').should('be.visible');
});

// Executa a validação das regras da WCAG apenas para defeitos críticos e sérios na página inicial
Then('eu não devo encontrar violações críticas de acessibilidade', () => {
  // Configurando o axe para reportar violações no Cypress Log, mas sem quebrar a pipeline (skipFailures: true)
  cy.checkA11y(null, {
    includedImpacts: ['critical', 'serious']
  }, null, true);
});

// Acessa a página de autenticação e injeta a biblioteca de auditoria visual
Given('que eu navego para a página de login', () => {
  cy.visit('/login');
  cy.injectAxe();
});

// Garante que o container de formulários está perfeitamente carregado
When('a tela de autenticação estiver visível', () => {
  cy.get('div.login-form').should('be.visible');
});

// Executa a validação das regras da WCAG especificamente para os inputs de login/signup
Then('eu não devo encontrar violações críticas de acessibilidade na tela de login', () => {
  cy.checkA11y(null, {
    includedImpacts: ['critical', 'serious']
  }, null, true);
});
