# Desafio de Automação QA - Cypress + BDD (Cucumber)

Este projeto contém a automação dos testes de ponta a ponta (E2E) para o site [Automation Exercise](https://www.automationexercise.com/login).
O framework foi construído utilizando **Cypress**, com integração **BDD (Cucumber)**, escrito em **JavaScript**, e baseado na arquitetura **Page Object Model**.

## 🛠 Tecnologias Utilizadas

- **Node.js** (Ambiente de execução)
- **Cypress** (Framework de teste E2E)
- **Cucumber / Gherkin** (Para escrita dos cenários BDD)
- **Esbuild** (Para processamento rápido e eficiente do Cypress com Cucumber)
- **Faker.js** (Para geração de massa de dados dinâmicos, como e-mails e nomes para os testes de login)

## 🏗 Arquitetura do Projeto

A estrutura do projeto segue as melhores práticas para separar a lógica de teste da lógica de interação com as páginas.

```
├── cypress/
│   ├── e2e/
│   │   └── features/           # Arquivos .feature com os cenários BDD em Gherkin
│   ├── support/
│   │   ├── pages/              # Classes de Page Objects (Login, Home, Cart, Checkout)
│   │   ├── step_definitions/   # Implementação dos passos (Given, When, Then) do Gherkin
│   │   ├── commands.js         # Comandos customizados do Cypress
│   │   └── e2e.js              # Configurações de suporte do Cypress
├── cypress.config.js           # Arquivo de configuração do Cypress integrando o esbuild/cucumber
├── package.json                # Dependências e scripts de execução
└── README.md                   # Instruções do projeto
```

## 🚀 Instalação do Ambiente

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.
2. Clone o repositório ou navegue até a pasta do projeto.
3. No terminal, execute o comando abaixo para instalar as dependências:

```bash
npm install
```

## 🏃 Execução dos Testes

### Modo Interativo (Com interface gráfica)
Para abrir a interface do Cypress e visualizar a execução dos testes passo a passo:

```bash
npm run cy:open
```
- Selecione a opção **E2E Testing**.
- Escolha o seu navegador de preferência (Ex: Chrome).
- Clique em qualquer um dos arquivos `.feature` listados para iniciar o teste.

### Modo Headless (Em background)
Para executar todos os testes diretamente no terminal de forma rápida e sem abrir interface:

```bash
npm run cy:run
```

## 📝 Funcionalidades Cobertas (Desafio)

1. **Login e Criação de Usuário**: O framework entra na tela, preenche o cadastro, valida a criação do usuário, realiza o login e, ao final de tudo, deleta a conta para manter a limpeza de massa.
2. **Busca de Produtos**: Realiza a busca de produtos válidos e valida a apresentação dos mesmos.
3. **Inclusão no Carrinho e Pagamento**: Adiciona produtos ao carrinho e navega para o fluxo de checkout garantindo a persistência do produto.
4. **Cenários de Exceção**: Tenta logar com dados inválidos e valida as mensagens de erro retornadas pelo sistema.

## 🔗 Informações Adicionais

Este projeto foi inicializado com repositório Git local e pode ser facilmente "pushado" para um repositório remoto no GitHub ou Bitbucket. 

Para enviar ao seu repositório remoto, basta executar:
```bash
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin master
```
