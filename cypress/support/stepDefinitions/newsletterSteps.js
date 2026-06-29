import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import HomePage from '../pages/HomePage';
import { faker } from '@faker-js/faker';

When('eu rolo até o rodapé e insiro meu email na newsletter', () => {
  const email = faker.internet.email();
  cy.get('#susbscribe_email').type(email);
});

When('clico no botão de inscrição', () => {
  cy.get('#subscribe').click();
});

Then('eu devo ver a mensagem de confirmação da newsletter {string}', (message) => {
  HomePage.verifyNewsletterSuccess(message);
});
