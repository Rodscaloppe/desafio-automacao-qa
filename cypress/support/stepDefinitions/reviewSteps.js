import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import ProductPage from '../pages/ProductPage';
import { faker } from '@faker-js/faker';

// Ação: Seleciona e visita os detalhes do primeiro item da vitrine
When('eu clico no primeiro produto listado', () => {
  ProductPage.visitFirstProduct();
});

// Ação: Constrói uma review utilizando nome e email fictícios com auxílio do Faker
When('preencho o formulário de avaliação com nome, email e comentário', () => {
  const name = faker.name.firstName();
  const email = faker.internet.email();
  const review = faker.lorem.paragraph();
  
  ProductPage.fillReviewForm(name, email, review);
});

// Ação: (Placeholder lógico) A submissão já foi contemplada no Page Object anterior
When('envio a avaliação', () => {
  // O clique já acontece dentro do fillReviewForm, podemos manter vazio ou refatorar o PageObject
});

// Validação: Garante que o feedback visual do frontend sinaliza a inserção da review no banco
Then('eu devo ver a mensagem de confirmação de avaliação {string}', (message) => {
  ProductPage.verifyReviewSuccessMessage(message);
});
