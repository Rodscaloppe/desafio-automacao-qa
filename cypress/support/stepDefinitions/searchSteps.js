import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import HomePage from '../pages/HomePage';

// Pré-condição: Garante o acesso à página que contém a listagem completa de produtos
Given('que eu acesso a página de produtos', () => {
  HomePage.visitProducts();
});

// Ação: Utiliza o componente da barra de busca injetando um termo específico
When('eu realizo a busca pelo produto {string}', (productName) => {
  HomePage.searchProduct(productName);
});

// Validação: Garante que o motor de busca filtrou a vitrine e exibiu o item desejado
Then('o produto {string} deve ser exibido nos resultados', (productName) => {
  HomePage.verifyProductVisible(productName);
});
