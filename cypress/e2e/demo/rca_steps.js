import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import HomePage from '../../support/pages/HomePage';

Given('que a API de produtos está instável e retornará Erro 500', () => {
  cy.intercept('GET', '**/api/productsList', {
    statusCode: 500,
    body: { error: 'Internal Server Error', message: 'Token missing or invalid' }
  }).as('productsFail');
});

When('eu acesso a página de produtos', () => {
  HomePage.visitProducts();
});

Then('devo conseguir visualizar a lista de produtos na tela', () => {
  // Simulando que o erro 500 faria a lista quebrar e não renderizar:
  cy.get('.api-error-message').should('not.exist');
  
  // Forçando falha: o Cypress não vai achar essa classe inexistente
  cy.get('.produto-magico-que-nao-existe', { timeout: 1000 }).should('be.visible');
});
