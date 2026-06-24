class HomePage {
  // Acessa a página principal do site
  visit() {
    cy.visit('/');
  }

  // Navega diretamente para a página de listagem de produtos
  visitProducts() {
    cy.visit('/products');
  }

  // Realiza a busca de um produto específico através da barra de pesquisa
  searchProduct(productName) {
    cy.get('#search_product').type(productName);
    cy.get('#submit_search').click();
  }

  // Valida se um produto específico está visível na lista de resultados
  verifyProductVisible(productName) {
    cy.get('.features_items').contains(productName).should('be.visible');
  }

  // Localiza o produto na listagem e clica no botão "Add to cart" associado a ele
  addProductToCart(productName) {
    cy.get('.features_items').contains(productName).parents('.single-products').find('.add-to-cart').first().click();
    cy.contains('Your product has been added to cart.').should('be.visible');
    cy.contains('Continue Shopping').click();
  }

  // Preenche e submete o formulário de assinatura da newsletter no rodapé
  subscribeNewsletter(email) {
    cy.get('#susbscribe_email').type(email);
    cy.get('#subscribe').click();
  }

  // Verifica se a mensagem de sucesso da newsletter foi renderizada
  verifyNewsletterSuccess(message) {
    cy.get('#success-subscribe').should('contain', message).and('be.visible');
  }
}

export default new HomePage();
