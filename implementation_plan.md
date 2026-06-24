# Criação de um Agente de IA para Reporte Automático de Bugs no Trello

O usuário solicitou a criação de uma IA que varre os relatórios de teste, identifica bugs (falhas) e automaticamente abre um card/task de bug no Trello utilizando a API. Além disso, foi solicitado um cenário demo para testar essa funcionalidade.

## Background Context
Nosso projeto já possui agentes como o `rca_agent.js` (Root Cause Analysis) e `auto_healing_agent.js`. Este novo agente fará o papel do **Bug Reporter**. Quando a pipeline ou os testes falham, não queremos criar tarefas no Trello manualmente com copy/paste dos logs de erro. O agente de IA vai ler o JSON do Cucumber gerado pelo Cypress, encontrar o cenário que falhou, redigir uma descrição rica em Markdown com a causa do problema e enviar via API do Trello.

## Proposed Changes

---

### Scripts Layer (IA & Automação)
#### [NEW] [trello_bug_reporter_agent.js](file:///home/desktoplego/meu-novo-projeto-qa/Projeto-Desafio/scripts/trello_bug_reporter_agent.js)
Este será o cérebro da operação. Ele fará o seguinte fluxo:
1. Carregar o arquivo `cypress/reports/cucumber-json/cucumber-report.json`.
2. Varrer (parsear) as execuções em busca de `status: "failed"`.
3. Injetar a mensagem de erro da falha num modelo LLM (via `@langchain/google-genai`).
4. O LLM estruturará um Título e uma Descrição formatada do Bug (Steps to Reproduce, Stacktrace, Possível Causa).
5. Utilizar o `axios` para fazer um `POST https://api.trello.com/1/cards` passando as variáveis do Trello `key`, `token` e `idList` extraídas do arquivo `.env`.

---

### Configuration Layer
#### [MODIFY] [.env](file:///home/desktoplego/meu-novo-projeto-qa/Projeto-Desafio/.env)
Adicionarei o parâmetro `TRELLO_LIST_ID="id_da_sua_coluna_do_trello"` e garantiremos que as variáveis básicas do Trello estejam configuradas para o Agente consumir.

#### [MODIFY] [package.json](file:///home/desktoplego/meu-novo-projeto-qa/Projeto-Desafio/package.json)
Adicionar o comando de NPM: `"report-bug": "node scripts/trello_bug_reporter_agent.js"`.

---

### Test Layer (Cenário Demo)
#### [NEW] [trello_reporter_demo.feature](file:///home/desktoplego/meu-novo-projeto-qa/Projeto-Desafio/cypress/e2e/demo/trello_reporter_demo.feature)
Criar um cenário focado em disparar uma falha proposital:
```gherkin
Feature: Trello AI Bug Reporter Demo
  Scenario: Gerar falha na página de login para o Trello
    Given que eu navegue para uma página falsa
    When um erro crítico de UI acontece
    Then o teste quebra e o Agente de IA gera um ticket
```
*(Nota: as step definitions serão acopladas num arquivo `demo_steps.js` ou utilizando os mocks de exception já existentes).*

## Open Questions

> [!IMPORTANT]
> **Sobre a criação no Trello:** Para que o Agente de Fato crie a tarefa em um quadro real seu, precisaremos de um `TRELLO_LIST_ID` (ID da coluna do quadro) válido. Deseja que eu coloque um código de List ID fictício/mockado ou você vai fornecer um ID real no seu arquivo `.env` para ver o card aparecendo na vida real? (Se você quiser testar na vida real, precisará preencher as variáveis do `.env` com suas credenciais do Trello).

> [!TIP]
> **Sobre a simulação:** Como alternativa, eu posso configurar o Agente para que, caso a API Key não seja detectada, ele apenas "imprima" o Payload (Título e Descrição do Card) gerados pelo LLM no terminal, como um "Dry-Run". O que acha dessa abordagem para a Demo?

## Verification Plan
### Automated Tests
- Executaremos `npx cypress run --spec cypress/e2e/demo/trello_reporter_demo.feature` (isso forçará um `.json` de falha a ser gerado).
- Executaremos `npm run report-bug` para verificar se o agente lê a falha com sucesso, gera a descrição do problema via LLM e faz a chamada POST correta ao Trello.
