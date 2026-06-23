# Desafio de Automação QA - Cypress + K6 + Pact + GitHub Actions

Este projeto contém a automação de ponta a ponta (E2E) para o site [Automation Exercise](https://www.automationexercise.com/login), além de contemplar as camadas de **Testes de Performance** e **Testes de Contrato**, geridos através de um pipeline CI/CD na nuvem.

O framework utiliza **BDD (Behavior-Driven Development)** em todas as suas camadas de testes para manter legibilidade e conexão direta com as regras de negócio.

## 🛠 Tecnologias Utilizadas

- **Cypress + Cucumber/Gherkin**: Para os testes de Front-End (E2E).
- **k6**: Para testes de Performance e Stress na API.
- **Pact + Jest**: Para garantir o Contrato (Consumer-Driven Contract Testing) das integrações.
- **GitHub Actions**: Pipeline automatizada (CI/CD).
- **Faker.js**: Massa de dados dinâmicas.

## 🏗 Arquitetura do Projeto

```
├── .github/workflows/  # Pipeline do GitHub Actions (qa_pipeline.yml)
├── contract/           # Testes de Contrato da API (Pact + Jest)
├── cypress/            # Testes E2E (BDD com Cucumber e Page Objects)
├── performance/        # Scripts K6 de Performance focados na API
├── cypress.config.js   # Configuração do Cypress
└── package.json        # Dependências e scripts de execução
```

## 🚀 Instalação do Ambiente Local

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. No terminal, execute o comando abaixo para instalar as dependências de E2E e Contrato:

```bash
npm install
```

3. Para executar o **K6** localmente, você precisa ter a [CLI do k6 instalada](https://k6.io/docs/get-started/installation/) em sua máquina.

## 🏃 Execução dos Testes

### Testes E2E (Cypress BDD)
```bash
# Executa de forma interativa (abre navegador)
npm run cy:open

# Executa de forma headless (background)
npm run cy:run
```

### Testes de Contrato (Pact)
Os testes de contrato utilizam o Jest e sobem um mock server do Pact dinamicamente para simular a resposta da API e validar se o contrato definido em código respeita a tipagem esperada.
```bash
npm run test:contract
```

### Testes de Performance (k6)
No terminal, basta invocar a CLI do K6 apontando para o script desejado.
```bash
k6 run performance/login_perf.js
k6 run performance/search_perf.js
```

## ⚙️ CI/CD - GitHub Actions

O arquivo `qa_pipeline.yml` orquestra a execução automatizada. Sempre que houver um `push` ou `pull_request` nas branches principais, o GitHub Actions disparará os 3 jobs paralelamente:
1. **Contract Tests**: Testa a integridade dos contratos.
2. **Performance Tests**: Isola a carga e verifica os tempos de resposta.
3. **E2E Tests**: Valida os fluxos completos em background no navegador da pipeline.

## 🔗 Enviando ao Repositório Remoto

Execute os comandos abaixo para "subir" esse framework para sua conta do GitHub. Os Actions rodarão automaticamente!

```bash
git remote add origin <URL_DO_SEU_GITHUB>
git push -u origin master
```
