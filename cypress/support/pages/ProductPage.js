class ProductPage {
  visitFirstProduct() {
    cy.visit('/product_details/1');
  }
  //Um método para preencher o formulário de avaliação com nome, e-mail e review, e submeter o formulário. 
  fillReviewForm(name, email, review) {
    cy.get('#name').type(name);
    cy.get('#email').type(email);
    cy.get('#review').type(review);
    cy.get('#button-review').click();
  }
  //Um método para verificar se a mensagem de sucesso de avaliação aparece na tela.   
  verifyReviewSuccessMessage(message) {
    cy.get('#review-section').contains(message).should('be.visible');
  }
}

export default new ProductPage();
