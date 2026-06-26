import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import ContactPage from '../pages/ContactPage';
import HomePage from '../pages/HomePage';
import { faker } from '@faker-js/faker';

// Ação: Navega para a área de contato clicando no menu superior
When('eu clico em "Contact Us"', () => {
  cy.contains('Contact us').click();
});

// Ação: Gera massa de dados dinamicamente com o Faker e preenche a página de suporte
When('preencho o formulário de contato com dados válidos e envio', () => {
  const name = faker.name.firstName();
  const email = faker.internet.email();
  const subject = faker.lorem.sentence();
  const message = faker.lorem.paragraph();
  
  ContactPage.fillContactForm(name, email, subject, message);
});

// Validação: Garante que a mensagem de confirmação do envio do ticket de suporte foi recebida
Then('eu devo ver a mensagem de sucesso {string}', (message) => {
  ContactPage.verifySuccessMessage(message);
});
