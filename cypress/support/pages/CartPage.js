class CartPage {
  visit() {
    cy.visit('/view_cart');
  }
  //Um método para clicar no botão "Proceed To Checkout" (Finalizar Compra).    
  proceedToCheckout() {
    cy.get('.check_out').click();
  }
  //Um método para remover um produto específico da lista do carrinho, buscando o nome dele como referência.  
  removeProduct(productName) {
    cy.contains('tr', productName)
      .find('.cart_quantity_delete')
      .click();
  }
  //Um método para verificar se a quantidade de um produto no carrinho está correta.  
  verifyProductQuantity(productName, expectedQuantity) {
    cy.contains('tr', productName)
      .find('.cart_quantity')
      .should('contain', expectedQuantity);
  }
  //Um método para verificar se o carrinho está vazio.  
  verifyCartIsEmpty() {
    cy.get('#empty_cart').should('be.visible');
  }
}

export default new CartPage();
