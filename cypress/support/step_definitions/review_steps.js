import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import ProductPage from '../pages/ProductPage';
import { faker } from '@faker-js/faker';

When('eu clico no primeiro produto listado', () => {
  ProductPage.visitFirstProduct();
});

When('preencho o formulário de avaliação com nome, email e comentário', () => {
  const name = faker.name.firstName();
  const email = faker.internet.email();
  const review = faker.lorem.paragraph();
  
  ProductPage.fillReviewForm(name, email, review);
});

When('envio a avaliação', () => {
  // O clique já acontece dentro do fillReviewForm, podemos manter vazio ou refatorar o PageObject
});

Then('eu devo ver a mensagem de confirmação de avaliação {string}', (message) => {
  ProductPage.verifyReviewSuccessMessage(message);
});
