class CartPage {
  visit() {
    cy.visit('/view_cart');
  }

  proceedToCheckout() {
    cy.get('.check_out').click();
  }
}

export default new CartPage();
