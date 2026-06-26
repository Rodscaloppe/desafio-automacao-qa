/**
 * Mapeamento dos passos BDD (Glue Code) para os cenários de Login e Cadastro.
 * Este arquivo faz a ponte entre a linguagem de negócio (.feature) e as ações técnicas
 * encapsuladas no padrão Page Objects (LoginPage).
 */
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import LoginPage from '../pages/LoginPage';

/**
 * Pré-condição: Acessa a raiz (home) do site.
 */
Given('que eu acesso a página inicial', () => {
  cy.visit('/');
});

/**
 * Ação: Clica no link do menu superior para navegar até a página de Autenticação.
 */
When('eu navego para a página de login\\/signup', () => {
  LoginPage.visit();
});

/**
 * Ação: Preenche a ficha completa de cadastro com dados dinâmicos utilizando o Page Object.
 */
When('crio uma nova conta com dados válidos', () => {
  LoginPage.fillSignupFormAndSubmit();
});

/**
 * Validação: Verifica elementos visuais que confirmam a autenticação (ex: 'Logged in as').
 */
Then('eu devo estar logado com sucesso', () => {
  LoginPage.verifyLoggedIn();
});

/**
 * Limpeza (Teardown): Remove a conta recém-criada ao final do teste para evitar acúmulo 
 * de lixo (sujeira) no banco de dados de testes.
 */
Then('minha conta deve ser deletada no final para limpeza de massa', () => {
  LoginPage.deleteAccount();
});

/**
 * Ação: Submete apenas o primeiro formulário do fluxo de pré-cadastro (Nome e E-mail).
 * Utiliza o faker.js acoplado a um timestamp para assegurar que o e-mail seja 100% único.
 */
When('inicio o cadastro com um novo e-mail', () => {
  const { faker } = require('@faker-js/faker');
  const name = faker.name.firstName();
  // Timestamp evita colisões e falsos positivos do erro "Email already exist!"
  const email = `qa_${Date.now()}_${faker.internet.email()}`;
  LoginPage.submitSignupStep1(name, email);
});

/**
 * Ação negativa: Tenta realizar o cadastro omitindo intencionalmente um campo 
 * específico para testar as travas de validação do front-end.
 */
When('tento criar a conta sem preencher o campo obrigatório {string}', (fieldName) => {
  LoginPage.fillPartialSignupForm(fieldName);
});

/**
 * Validação de Erro: Garante que o navegador dispare o alerta correto do HTML5 (required) 
 * ou a mensagem do sistema quando um campo essencial é ignorado.
 */
Then('o sistema deve alertar que o campo {string} é obrigatório com a mensagem {string}', (fieldName, message) => {
  LoginPage.verifyFieldValidationMessage(fieldName, message);
});
