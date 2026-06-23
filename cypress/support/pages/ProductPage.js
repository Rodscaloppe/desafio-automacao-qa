class ProductPage {
  visitFirstProduct() {
    cy.visit('/product_details/1');
  }

  fillReviewForm(name, email, review) {
    cy.get('#name').type(name);
    cy.get('#email').type(email);
    cy.get('#review').type(review);
    cy.get('#button-review').click();
  }

  verifyReviewSuccessMessage(message) {
    cy.get('#review-section').contains(message).should('be.visible');
  }
}

export default new ProductPage();
