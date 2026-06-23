class ContactPage {
  visit() {
    cy.visit('/contact_us');
  }

  fillContactForm(name, email, subject, message) {
    cy.get('[data-qa="name"]').type(name);
    cy.get('[data-qa="email"]').type(email);
    cy.get('[data-qa="subject"]').type(subject);
    cy.get('[data-qa="message"]').type(message);
    
    // Anexar um arquivo vazio ou pular anexo, o site não exige
    // cy.get('[name="upload_file"]').attachFile('example.json'); 
    
    cy.get('[data-qa="submit-button"]').click();
  }

  verifySuccessMessage(message) {
    cy.get('.status.alert-success').should('contain', message).and('be.visible');
  }
}

export default new ContactPage();
