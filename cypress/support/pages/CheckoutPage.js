class CheckoutPage {
  verifyProductInCheckout(productName) {
    cy.get('#cart_info').contains(productName).should('be.visible');
  }
  //Um método para preencher o textarea de comentário no final da compra e já disparar o clique em "Payment" para finalizar a ordem.
  //
  fillCommentAndPlaceOrder(commentText) {
    cy.get('textarea[name="message"]').type(commentText);
    cy.get('a[href="/payment"]').click();
  }

  // Para checar se o endereço de entrega e cobrança que aparecem na tela batem com o que foi cadastrado pelo usuário.
  verifyDeliveryAddress(expectedName, expectedCity) {
    cy.get('#address_delivery').should('contain', expectedName);
    cy.get('#address_delivery').should('contain', expectedCity);
  }
  //Um método para checar se o endereço de cobrança exibido na tela é o mesmo que o usuário cadastrou.  
  verifyBillingAddress(expectedName, expectedCity) {
    cy.get('#address_invoice').should('contain', expectedName);
    cy.get('#address_invoice').should('contain', expectedCity);
  }
}

export default new CheckoutPage();
