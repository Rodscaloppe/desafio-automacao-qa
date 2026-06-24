# Desafio de Automação QA - Cypress + K6 + Pact + GitHub Actions

Este projeto contém a automação de ponta a ponta (E2E) para o site [Automation Exercise](https://www.automationexercise.com/), além de contemplar as camadas de **Testes de Performance** e **Testes de Contrato**, geridos através de um pipeline CI/CD na nuvem.

O framework utiliza **BDD (Behavior-Driven Development)** em todas as suas camadas de testes para manter legibilidade e conexão direta com as regras de negócio.

## 🛠 Tecnologias Utilizadas

- **Cypress + Cucumber/Gherkin**: Para os testes de Front-End (E2E).
- **Multiple Cucumber HTML Reporter**: Geração de dashboard e evidências visuais.
- **axe-core & cypress-axe**: Para automação de auditorias de acessibilidade (A11y) baseadas nas diretrizes WCAG.
- **LangChain, LangGraph & Ollama**: Inteligência Artificial local para análise de causa raiz (RCA) e **Cura Automática (Self-Healing)** de seletores UI quebrados usando Llama 3.
- **k6**: Para testes de Performance e Stress na API.
- **Pact + Jest**: Para garantir o Contrato (Consumer-Driven Contract Testing) das integrações.
- **GitHub Actions & GitHub Pages**: Pipeline automatizada (CI/CD) e hospedagem de relatórios na nuvem.
- **Faker.js**: Geração de massa de dados dinâmicas.

## 🏗 Arquitetura do Projeto

```text
├── .github/workflows/  # Pipeline do GitHub Actions (Deploy automático)
├── api/                # Testes de API Isolados (Axios + Jest)
├── contract/           # Testes de Contrato da API (Pact + Jest)
├── cypress/            # Testes E2E (BDD com Cucumber e Page Objects)
│   ├── e2e/features/   # Nossos cenários de testes mapeados
│   ├── e2e/demo/       # Testes experimentais e demonstrações para IA
│   ├── reports/        # Relatórios unificados gerados em HTML (Web + API)
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
- ♿ **Acessibilidade (A11y)** (Auditoria automática de contraste, semântica e boas práticas WCAG na página inicial e login)
- 🔄 **Suíte Épica de Regressão (E2E Journey)** (Cenário que cobre a jornada completa de compra, orquestrando o navegador simulando um usuário humano por quase 40 segundos. Engloba o cadastro com Faker, adição de produtos, manipulação de carrinho, validação de checkout, pagamento falso simulado, até exclusão final da conta gerada.)

## 🚀 Instalação do Ambiente Local

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado (versão **20** ou superior recomendada).
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

### Testes de API (Axios + Jest)
Nós estritamente separamos a validação da interface web (Cypress) da validação técnica do backend (Jest) para garantir ultra performance. Os relatórios de API são mesclados no Dashboard final.
```bash
npm run test:api
```

### Testes de Performance (k6)
No terminal, basta invocar a CLI do K6 apontando para o script desejado.
```bash
k6 run performance/login_perf.js
k6 run performance/search_perf.js
```

### Agente RCA (Análise de Falhas com IA)
Caso um teste falhe, você pode acionar nosso Agente Investigador que lê os relatórios e logs do Git e tenta deduzir a Causa Raiz do problema.
Este agente roda **100% localmente** utilizando o Ollama.
1. Instale o [Ollama](https://ollama.com/) em sua máquina.
2. Baixe o modelo executando no terminal: `ollama run llama3`
3. Para rodar a demonstração, primeiro force uma falha e em seguida rode o detetive:
```bash
npm run cy:demo-rca
npm run rca
```
Exemplo de saída do Agente RCA:
```text
Iniciando Agente de RCA (Root Cause Analysis)...

Conectando ao Ollama (Local LLM)...

Falha detectada no cenário: "Login com credenciais inválidas"
Passo falho: "Então devo ver uma mensagem de erro de autenticação"

Analisando os dados com LangChain + Ollama (llama3)...

================ RESUMO DA CAUSA RAIZ ================
 *ALERTA DE FALHA DE TESTE* 
*Cenário:* Tentar carregar produtos com a API fora do ar (Erro 500)
*Qual foi o problema:* O Cypress não conseguiu encontrar o elemento `.produto-magico-que-nao-existe` após 1000ms, indicando que o elemento não está presente na página ou a API não está disponível.
*Causa Raiz provável:* A alteração mais recente no repositório foi a expansão da cobertura de testes com novas características e geração de relatórios HTML para Cucumber. É possível que essa mudança tenha afetado a lógica do teste ou a forma como o Cypress interage com a API.
*Recomendação de correção:* Verificar se as alterações recentes no repositório afetaram a integração da API e realizar testes manuais para garantir que os elementos estejam presentes na página. Além disso, revisar o código do teste Cypress para garantir que ele esteja lidando corretamente com erros de API.
======================================================
```
```

### Agente Auto-Healing (Cura Automática de Seletores)
Nossa arquitetura conta com uma inovação impressionante de "Self-Healing". Caso o Cypress quebre devido a um seletor não encontrado (por exemplo, um dev alterou um atributo HTML de um botão), nosso Agente LangGraph entra em ação:
1. Ele coleta o HTML minificado do momento da falha.
2. Injeta o erro no Llama3 pedindo a localização do novo seletor no DOM.
3. **Edita localmente o código fonte** do seu Step Definition.
4. Roda o Cypress sozinho para re-validar e deixar o teste verde!

Para ativar o modo de cura em um teste falho, basta rodar:
```bash
npm run heal
```

### Agent Skills (Diretrizes para IAs Assistentes)
O repositório contém um diretório especial `[ .agents/skills/qa-engineering/ ]` dedicado a orquestrar como agentes de Inteligência Artificial (como Copilots e Assistentes de Código) devem se comportar ao interagir com o nosso projeto. 
- **O que faz:** Ele injeta a persona de um **Tech Lead de QA** na inteligência artificial, forçando-a a adotar princípios rigorosos de qualidade (como aversão a *flaky tests*, foco em prevenção e cobertura de *edge cases*).
- **Por que:** Quando um dev ou QA utiliza uma IA para gerar novos cenários de testes no repositório, essa *Skill* atua como um "cão de guarda", garantindo que o código gerado respeite automaticamente as nossas padronizações e boas práticas antes de ser sugerido, mantendo a excelência do código.

## CI/CD - GitHub Actions & Relatório Online (Pages)

O arquivo `.github/workflows/qa_pipeline.yml` orquestra a execução automatizada. Sempre que houver um `push` ou `pull_request` nas branches principais, o GitHub Actions:
1. Validará a integridade dos **Contratos (Pact)**.
2. Isolará a carga verificando os tempos de resposta através da **Performance (K6)**.
3. Executará os fluxos de Interface em background **(Cypress BDD)**.

** Relatórios no GitHub Pages**
Logo após a finalização da suíte de testes (passando ou falhando), a *action* configurada no repositório faz a captura da pasta raiz `cypress/reports/` (que agora contém a Landing Page unificada) e a publica dinamicamente em uma *Branch* de hospedagem (`gh-pages`). 
Basta acessar o link público do repositório configurado no *Settings* do seu GitHub para acessar o nosso **Dashboard Central**, onde você poderá navegar livremente entre os relatórios **E2E (Web)** e os de **API**.
