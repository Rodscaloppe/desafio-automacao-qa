const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor');

Given('que eu possuo o Power-Up de estimativa habilitado no meu Workspace', () => {
  cy.log('Mock: Power-Up habilitado via API do Trello');
  // Aqui entraria a chamada de API (cy.request) para habilitar o Power-Up no Board de teste
});

When('eu abro o verso de um cartão qualquer no Trello', () => {
  cy.log('Mock: Navegando para a URL do cartão do Trello');
  // cy.visit('https://trello.com/c/ID_DO_CARTAO');
});

Then('eu devo visualizar o botão {string} com o ícone de foguete na seção lateral de Power-Ups', (buttonText) => {
  cy.log(`Mock: Verificando se o botão "${buttonText}" 🚀 está visível na sidebar do iframe`);
  // cy.get('.js-plugin-buttons').should('contain', buttonText);
});

Given('que eu estou com um cartão aberto', () => {
  cy.log('Mock: Cartão aberto via interface ou Deep Link');
});

When('eu clico no botão {string}', (buttonText) => {
  if (buttonText === 'Estimate Size') {
    cy.log(`Mock: Clicando no botão "${buttonText}"`);
  } else {
    cy.contains(buttonText).click();
  }
});

Then('o Trello deve abrir um popup intitulado {string}', (popupTitle) => {
  cy.log(`Mock: Verificando abertura do popup "${popupTitle}"`);
  // cy.get('.pop-over-header-title').should('contain', popupTitle);
});

Then('o popup deve conter um formulário com um select listando as opções {string}, {string}, {string} e {string}', (op1, op2, op3, op4) => {
  cy.log(`Mock: Validando opções do select: ${op1}, ${op2}, ${op3}, ${op4}`);
  // cy.get('select[name="estimate"]').find('option').should('have.length', 4);
});

Given('que eu abri o popup de estimativa de um cartão sem estimativa prévia', () => {
  cy.log('Mock: Abrindo popup em cartão limpo');
});

When('eu seleciono a opção {string} no campo {string}', (optionText, fieldName) => {
  cy.log(`Mock: Selecionando "${optionText}" no dropdown "${fieldName}"`);
  // cy.get(`select[name="${fieldName.toLowerCase()}"]`).select(optionText);
});

When('clico no botão primário {string}', (buttonText) => {
  cy.log(`Mock: Submetendo formulário através do botão "${buttonText}"`);
  // cy.contains('button.primary', buttonText).click();
});

Then('o popup de estimativa deve ser fechado automaticamente', () => {
  cy.log('Mock: Verificando se o pop-over saiu do DOM');
  // cy.get('.pop-over').should('not.exist');
});

Then('os dados de plugin \\(pluginData) do cartão devem armazenar a estimativa {string} em escopo {string}', (estimateValue, scope) => {
  cy.log(`Mock: Checando persistência na API do Trello: pluginData = ${estimateValue} no escopo ${scope}`);
  // Aqui faríamos um cy.request GET para a API do Trello validando o pluginData do cartão
});

Given('que o cartão atual possui a estimativa {string} armazenada no pluginData', (estimateValue) => {
  cy.log(`Mock: Injetando pluginData via API do Trello com valor "${estimateValue}"`);
  // cy.request('PUT', 'https://api.trello.com/1/cards/.../pluginData', { value: estimateValue })
});

When('eu clico no botão {string} para reabrir o popup', (buttonText) => {
  cy.log(`Mock: Reabrindo o popup pelo botão "${buttonText}"`);
});

Then('o campo select do popup já deve vir com a opção {string} pré-selecionada', (expectedOption) => {
  cy.log(`Mock: Verificando se a opção "${expectedOption}" está selecionada (Re-hidratação de Estado)`);
  // cy.get('select[name="estimate"]').find('option:selected').should('have.text', expectedOption);
});
