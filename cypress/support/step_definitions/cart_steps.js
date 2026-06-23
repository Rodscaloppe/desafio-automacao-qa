import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import HomePage from '../pages/HomePage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import LoginPage from '../pages/LoginPage';

Given('que eu possuo uma conta logada', () => {
  HomePage.visit();
  LoginPage.visit();
  LoginPage.fillSignupFormAndSubmit();
  LoginPage.verifyLoggedIn();
});

When('eu adiciono o produto {string} ao carrinho', (productName) => {
  HomePage.visitProducts();
  HomePage.searchProduct(productName);
  HomePage.addProductToCart(productName);
});

When('navego para a tela de pagamento', () => {
  CartPage.visit();
  CartPage.proceedToCheckout();
});

Then('eu devo validar se os produtos do carrinho estão corretos na tela de checkout', () => {
  CheckoutPage.verifyProductInCheckout('Blue Top');
});

Then('a conta deve ser deletada no final para limpeza de massa', () => {
  LoginPage.deleteAccount();
});
