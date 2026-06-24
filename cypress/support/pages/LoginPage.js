import { faker } from '@faker-js/faker';

class LoginPage {
  visit() {
    cy.visit('/login');
  }

  fillSignupFormAndSubmit() {
    const name = faker.name.firstName();
    // Adiciona timestamp para garantir 100% de exclusividade e evitar "Email already exist!"
    const email = `qa_${Date.now()}_${faker.internet.email()}`;

    cy.get('[data-qa="signup-name"]').should('be.visible').type(name);
    cy.get('[data-qa="signup-email"]').should('be.visible').type(email);
    // Usa force: true para evitar interceptação de botões por overlays/anúncios
    cy.get('[data-qa="signup-button"]').should('be.visible').click({ force: true });

    // Ancoragem de falha rápida (Fail Fast): Garante que o sistema não barrou o e-mail
    cy.contains('Email Address already exist!').should('not.exist');
    
    // Ancoragem de roteamento: Garante que avançamos de tela antes de procurar elementos
    cy.url().should('include', '/signup');

    // Complete signup form
    cy.get('[data-qa="password"]').type('Password123!');
    cy.get('[data-qa="first_name"]').type(name);
    cy.get('[data-qa="last_name"]').type(faker.name.lastName());
    cy.get('[data-qa="address"]').type('123 Test St');
    cy.get('[data-qa="country"]').select('United States');
    cy.get('[data-qa="state"]').type('Test State');
    cy.get('[data-qa="city"]').type('Test City');
    cy.get('[data-qa="zipcode"]').type('12345');
    cy.get('[data-qa="mobile_number"]').type('1234567890');

    cy.get('[data-qa="create-account"]').click();
    cy.get('[data-qa="account-created"]').should('be.visible');
    cy.get('[data-qa="continue-button"]').click();
  }

  login(email, password) {
    cy.get('[data-qa="login-email"]').type(email);
    cy.get('[data-qa="login-password"]').type(password);
    cy.get('[data-qa="login-button"]').click();
  }

  verifyLoginError(message) {
    cy.contains(message).should('be.visible');
  }

  submitSignupStep1(name, email, expectSuccess = true) {
    cy.get('[data-qa="signup-name"]').should('be.visible').type(name);
    cy.get('[data-qa="signup-email"]').should('be.visible').type(email);

    // Forçamos o clique caso haja overlays (anúncios) em cima do botão
    cy.get('[data-qa="signup-button"]').should('be.visible').click({ force: true });

    if (expectSuccess) {
      // Ancoragem de falha rápida (Fail Fast): Garante que o sistema não barrou o e-mail
      cy.contains('Email Address already exist!').should('not.exist');

      // Ancoragem de transição: Obrigamos o Cypress a esperar a mudança da rota
      cy.url().should('include', '/signup');
    }
  }

  verifySignupError(message) {
    cy.contains(message).should('be.visible');
  }

  fillPartialSignupForm(emptyFieldName) {
    const name = faker.name.firstName();

    // Preencha o formulário exceto o campo solicitado
    cy.get('[data-qa="password"]').type('Password123!');
    if (emptyFieldName !== 'first_name') cy.get('[data-qa="first_name"]').type(name);
    if (emptyFieldName !== 'last_name') cy.get('[data-qa="last_name"]').type(faker.name.lastName());
    if (emptyFieldName !== 'address') cy.get('[data-qa="address"]').type('123 Test St');

    cy.get('[data-qa="country"]').select('United States');
    cy.get('[data-qa="state"]').type('Test State');
    cy.get('[data-qa="city"]').type('Test City');
    cy.get('[data-qa="zipcode"]').type('12345');
    cy.get('[data-qa="mobile_number"]').type('1234567890');

    cy.get('[data-qa="create-account"]').click();
  }

  verifyFieldValidationMessage(fieldName, expectedMessage) {
    // No HTML5, podemos ler a propriedade validaçãoMessage de uma entrada inválida
    cy.get(`[data-qa="${fieldName}"]`).invoke('prop', 'validationMessage').should('eq', expectedMessage);
  }

  verifyLoggedIn() {
    cy.contains('Logged in as').should('be.visible');
  }

  logout() {
    cy.contains('Logout').click();
  }

  deleteAccount() {
    cy.contains('Delete Account').click();
    cy.get('[data-qa="account-deleted"]').should('be.visible');
    cy.get('[data-qa="continue-button"]').click();
  }
}

export default new LoginPage();
