class CheckoutPage {
  verifyProductInCheckout(productName) {
    cy.get('#cart_info').contains(productName).should('be.visible');
  }
}

export default new CheckoutPage();
