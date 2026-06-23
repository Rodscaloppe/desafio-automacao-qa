import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import ContactPage from '../pages/ContactPage';
import HomePage from '../pages/HomePage';
import { faker } from '@faker-js/faker';

When('eu clico em "Contact Us"', () => {
  cy.contains('Contact us').click();
});

When('preencho o formulário de contato com dados válidos e envio', () => {
  const name = faker.name.firstName();
  const email = faker.internet.email();
  const subject = faker.lorem.sentence();
  const message = faker.lorem.paragraph();
  
  ContactPage.fillContactForm(name, email, subject, message);
});

Then('eu devo ver a mensagem de sucesso {string}', (message) => {
  ContactPage.verifySuccessMessage(message);
});
