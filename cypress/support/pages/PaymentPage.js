class PaymentPage {
  // Preenche os detalhes do cartão de crédito no formulário de pagamento
  fillCreditCardDetails(nameOnCard, cardNumber, cvc, expMonth, expYear) {
    cy.get('[data-qa="name-on-card"]').type(nameOnCard);
    cy.get('[data-qa="card-number"]').type(cardNumber);
    cy.get('[data-qa="cvc"]').type(cvc);
    cy.get('[data-qa="expiry-month"]').type(expMonth);
    cy.get('[data-qa="expiry-year"]').type(expYear);
  }
    // Confirma o pagamento submetendo o formulário
  confirmPayment() {
    cy.get('[data-qa="pay-button"]').click();
  }
    // Verifica se a mensagem de sucesso do pedido foi exibida e avança
  verifyOrderPlacedMessage() {
    cy.get('[data-qa="order-placed"]').should('be.visible');
    cy.get('[data-qa="continue-button"]').click();
  }
}

export default new PaymentPage();
