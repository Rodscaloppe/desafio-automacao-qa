import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import PaymentPage from '../pages/PaymentPage';
import { faker } from '@faker-js/faker';

let registeredName = '';

Given('que a página inicial é carregada com sucesso', () => {
  HomePage.visit();
  cy.get('body').should('be.visible');
});

Given('crio uma conta nova com nome {string}, email randômico e dados completos', (baseName) => {
  LoginPage.visit();
  
  registeredName = baseName;
  const email = faker.internet.email();
  
  LoginPage.submitSignupStep1(registeredName, email);
  
  // Preencher formulário restante de cadastro (mesma lógica do LoginPage.js)
  cy.get('[data-qa="password"]').type('Password123!');
  cy.get('[data-qa="first_name"]').type(registeredName);
  cy.get('[data-qa="last_name"]').type(faker.name.lastName());
  cy.get('[data-qa="address"]').type('123 QA St');
  cy.get('[data-qa="country"]').select('United States');
  cy.get('[data-qa="state"]').type('São Paulo');
  cy.get('[data-qa="city"]').type('Campinas');
  cy.get('[data-qa="zipcode"]').type('13000');
  cy.get('[data-qa="mobile_number"]').type('19999999999');
  
  cy.get('[data-qa="create-account"]').click();
  cy.get('[data-qa="account-created"]').should('be.visible');
  cy.get('[data-qa="continue-button"]').click();
  
  LoginPage.verifyLoggedIn();
});

When('eu navego para a tela de carrinho', () => {
  CartPage.visit();
});

When('eu removo o produto {string} do carrinho', (productName) => {
  CartPage.removeProduct(productName);
  // Validar se foi removido
  cy.contains('tr', productName).should('not.exist');
});

When('eu procedo para o checkout', () => {
  CartPage.proceedToCheckout();
});

Then('o endereço de entrega e cobrança devem estar corretos', () => {
  CheckoutPage.verifyDeliveryAddress(registeredName, 'Campinas');
  CheckoutPage.verifyBillingAddress(registeredName, 'Campinas');
});

Then('eu insiro o comentário {string} e finalizo o pedido', (comment) => {
  CheckoutPage.fillCommentAndPlaceOrder(comment);
});

Then('preencho dados falsos de cartão de crédito e confirmo o pagamento', () => {
  PaymentPage.fillCreditCardDetails(
    registeredName,
    faker.finance.creditCardNumber('visa'),
    faker.finance.creditCardCVV(),
    '12',
    '2030'
  );
  PaymentPage.confirmPayment();
});

Then('o pedido deve ser colocado com sucesso', () => {
  PaymentPage.verifyOrderPlacedMessage();
});

Then('a conta criada deve ser deletada para garantir a limpeza dos dados', () => {
  LoginPage.deleteAccount();
});
