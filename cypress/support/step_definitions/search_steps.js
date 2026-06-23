import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import HomePage from '../pages/HomePage';

Given('que eu acesso a página de produtos', () => {
  HomePage.visitProducts();
});

When('eu realizo a busca pelo produto {string}', (productName) => {
  HomePage.searchProduct(productName);
});

Then('o produto {string} deve ser exibido nos resultados', (productName) => {
  HomePage.verifyProductVisible(productName);
});
