# Desafio de Automação QA - Cypress + K6 + Pact + GitHub Actions

Este projeto contém a automação de ponta a ponta (E2E) para o site [Automation Exercise](https://www.automationexercise.com/), além de contemplar as camadas de **Testes de Performance** e **Testes de Contrato**, geridos através de um pipeline CI/CD na nuvem.

O framework utiliza **BDD (Behavior-Driven Development)** em todas as suas camadas de testes para manter legibilidade e conexão direta com as regras de negócio.

## 🛠 Tecnologias Utilizadas

- **Cypress + Cucumber/Gherkin**: Para os testes de Front-End (E2E).
- **Multiple Cucumber HTML Reporter**: Geração de dashboard e evidências visuais.
- **k6**: Para testes de Performance e Stress na API.
- **Pact + Jest**: Para garantir o Contrato (Consumer-Driven Contract Testing) das integrações.
- **GitHub Actions & GitHub Pages**: Pipeline automatizada (CI/CD) e hospedagem de relatórios na nuvem.
- **Faker.js**: Geração de massa de dados dinâmicas.

## 🏗 Arquitetura do Projeto

```text
├── .github/workflows/  # Pipeline do GitHub Actions (Deploy automático)
├── contract/           # Testes de Contrato da API (Pact + Jest)
├── cypress/            # Testes E2E (BDD com Cucumber e Page Objects)
│   ├── e2e/features/   # Nossos 10 cenários de testes mapeados
│   ├── reports/html/   # Relatórios gerados em HTML (evidências)
│   └── support/pages/  # Page Object Model (POM)
├── performance/        # Scripts K6 de Performance focados na API
├── cypress.config.js   # Configuração do Cypress (com screenshots ligados)
└── package.json        # Dependências e scripts de execução
```

## 📝 Funcionalidades Cobertas (E2E)

Atualmente possuímos cobertura automatizada nos seguintes cenários e regras de negócio:
- ✅ **Login e Cadastro** (Sucesso na criação de conta; Validação de campos obrigatórios do HTML5; Mensagens de erro para e-mail existente)
- ✅ **Carrinho e Checkout** (Inclusão e persistência do carrinho)
- ✅ **Busca de Produtos** (Fluxo de busca via barra superior)
- ✅ **Exceções e Falhas** (Login com credenciais inválidas)
- ✅ **Fale Conosco** (Envio do formulário de *Contact Us*)
- ✅ **Newsletter** (Validação de inscrição via rodapé)
- ✅ **Avaliações (Reviews)** (Publicação de avaliações nas páginas de produtos)
- ✅ **Logout** (Redirecionamento ao sair do sistema)

## 🚀 Instalação do Ambiente Local

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. No terminal, execute o comando abaixo para instalar as dependências de E2E e Contrato:

```bash
npm install
```

3. Para executar o **K6** localmente, instale a [CLI do k6](https://k6.io/docs/get-started/installation/) em sua máquina.

## 🏃 Execução dos Testes

### Testes E2E (Cypress BDD)
```bash
# Executa de forma interativa (Modo Visual - abre o navegador)
npm run cy:open

# Executa de forma silenciosa (Headless - ideal para o CI)
npm run cy:run

# Executa os testes em Headless e GERA O RELATÓRIO HTML AUTOMATICAMENTE ao final
npm run cy:run:report
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

## ⚙️ CI/CD - GitHub Actions & Relatório Online (Pages)

O arquivo `.github/workflows/qa_pipeline.yml` orquestra a execução automatizada. Sempre que houver um `push` ou `pull_request` nas branches principais, o GitHub Actions:
1. Validará a integridade dos **Contratos (Pact)**.
2. Isolará a carga verificando os tempos de resposta através da **Performance (K6)**.
3. Executará os fluxos de Interface em background **(Cypress BDD)**.

**🚀 Relatórios no GitHub Pages**
Logo após a finalização da suíte de testes (passando ou falhando), a *action* configurada no repositório faz a captura da pasta `cypress/reports/html/`, extrai o Dashboard contendo os passos detalhados e *Screenshots* de erros, e a publica dinamicamente em uma *Branch* de hospedagem (`gh-pages`). 
Basta acessar o link público do repositório configurado no *Settings* do seu GitHub para visualizar as métricas do último teste rodado!
