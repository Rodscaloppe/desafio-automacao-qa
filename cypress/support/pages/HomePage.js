class HomePage {
  visit() {
    cy.visit('/');
  }

  visitProducts() {
    cy.visit('/products');
  }

  searchProduct(productName) {
    cy.get('#search_product').type(productName);
    cy.get('#submit_search').click();
  }

  verifyProductVisible(productName) {
    cy.get('.features_items').contains(productName).should('be.visible');
  }

  addProductToCart(productName) {
    cy.get('.features_items').contains(productName).parents('.single-products').find('.add-to-cart').first().click();
    cy.contains('Your product has been added to cart.').should('be.visible');
    cy.contains('Continue Shopping').click();
  }
}

export default new HomePage();
