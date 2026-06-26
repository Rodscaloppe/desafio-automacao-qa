import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import PaymentPage from '../pages/PaymentPage';
import { faker } from '@faker-js/faker';

let registeredName = '';

// Pré-condição: Garante o acesso à home page antes da jornada E2E iniciar
Given('que a página inicial é carregada com sucesso', () => {
  HomePage.visit();
  cy.get('body').should('be.visible');
});

// Ação 1: Geração de conta "on the fly" com dados limpos na esteira usando Faker
Given('crio uma conta nova com nome {string}, email randômico e dados completos', (baseName) => {
  LoginPage.visit();
  
  registeredName = baseName;
  // Adiciona timestamp para garantir 100% de exclusividade e evitar "Email already exist!"
  const email = `qa_${Date.now()}_${faker.internet.email()}`;
  
  LoginPage.submitSignupStep1(registeredName, email);
  LoginPage.completeSignupForm(registeredName, {
    address: '123 QA St',
    state: 'São Paulo',
    city: 'Campinas',
    zipcode: '13000',
    mobileNumber: '19999999999'
  });
  
  LoginPage.verifyLoggedIn();
});

// Ação 2: O usuário transita para o carrinho de compras
When('eu navego para a tela de carrinho', () => {
  CartPage.visit();
});

// Ação 3: Validação da integridade da deleção de itens do carrinho
When('eu removo o produto {string} do carrinho', (productName) => {
  CartPage.removeProduct(productName);
  // Validar se foi removido
  cy.contains('tr', productName).should('not.exist');
});

// Ação 4: Transição para a tela de entrega/checkout
When('eu procedo para o checkout', () => {
  CartPage.proceedToCheckout();
});

// Validação 1: Garantia da persistência dos dados de endereço gerados no passo 1
Then('o endereço de entrega e cobrança devem estar corretos', () => {
  CheckoutPage.verifyDeliveryAddress(registeredName, 'Campinas');
  CheckoutPage.verifyBillingAddress(registeredName, 'Campinas');
});

// Ação 5: Inserção do comentário da entrega
Then('eu insiro o comentário {string} e finalizo o pedido', (comment) => {
  CheckoutPage.fillCommentAndPlaceOrder(comment);
});

// Ação 6: Injeção de cartão de crédito falso válido gerado via Faker
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

// Validação 2: Confirmação do fluxo financeiro
Then('o pedido deve ser colocado com sucesso', () => {
  PaymentPage.verifyOrderPlacedMessage();
});

// Pós-condição: Remoção da massa de dados após o fim da esteira E2E
Then('a conta criada deve ser deletada para garantir a limpeza dos dados', () => {
  LoginPage.deleteAccount();
});
