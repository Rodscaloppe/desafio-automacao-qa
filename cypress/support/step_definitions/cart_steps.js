import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import HomePage from '../pages/HomePage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import LoginPage from '../pages/LoginPage';

// Pré-condição: Executa um fluxo completo de cadastro para garantir uma sessão logada limpa
Given('que eu possuo uma conta logada', () => {
  HomePage.visit();
  LoginPage.visit();
  LoginPage.fillSignupFormAndSubmit();
  LoginPage.verifyLoggedIn();
});

// Ação: Busca um produto e insere ele no carrinho virtual
When('eu adiciono o produto {string} ao carrinho', (productName) => {
  HomePage.visitProducts();
  HomePage.searchProduct(productName);
  HomePage.addProductToCart(productName);
});

// Ação: Transita da visão de carrinho para a visão de Checkout
When('navego para a tela de pagamento', () => {
  CartPage.visit();
  CartPage.proceedToCheckout();
});

// Validação: Garante que o produto selecionado foi transportado corretamente para a página de checkout
Then('eu devo validar se os produtos do carrinho estão corretos na tela de checkout', () => {
  CheckoutPage.verifyProductInCheckout('Blue Top');
});

// Pós-condição: Apaga a conta recém criada para evitar poluição do banco de dados (Clean State)
Then('a conta deve ser deletada no final para limpeza de massa', () => {
  LoginPage.deleteAccount();
});
