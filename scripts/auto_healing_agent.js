const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const cheerio = require('cheerio');
const { ChatOllama } = require('@langchain/ollama');
const { PromptTemplate } = require('@langchain/core/prompts');
const { StateGraph, START, END, Annotation } = require('@langchain/langgraph');
//Um script para auto-curar seletores que falharam no teste.  
console.log('🤖 Inicializando o Agente de Auto-Healing (LangGraph + Llama3)...\n');

// 1. Definição do Estado do Grafo
const HealingState = Annotation.Root({
  failedStep: Annotation(),
  errorMessage: Annotation(),
  oldSelector: Annotation(),
  domSnippet: Annotation(),
  newSelector: Annotation(),
  status: Annotation()
});

// 2. Nós do Grafo
// Função 1: Analisa o relatório JSON gerado pelo Cypress na última falha. 
// O objetivo é descobrir exatamente qual foi o seletor CSS antigo que causou a quebra do teste.
function extractFailureInfo(state) {
  console.log('➤ [Node] Analisando o relatório de falhas...');
  const reportPath = 'cypress/reports/cucumber-json/cucumber-report.json';
  if (!fs.existsSync(reportPath)) {
    return { status: 'ERROR', errorMessage: 'Relatório não encontrado.' };
  }
  //Um método para extrair informações do relatório de falhas.
  const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  let failedStep = null;
  let errorMessage = null;
  //  
  for (const feature of reportData) {
    for (const element of feature.elements || []) {
      for (const step of element.steps || []) {
        if (step.result && step.result.status === 'failed') {
          failedStep = step.name;
          errorMessage = step.result.error_message;
          break;
        }
      }
    }
  }

  if (!failedStep) {
    return { status: 'NO_FAILURE' };
  }
  //  
  // Ex: "Expected to find element: `.old-class`, but never found it."
  const selectorMatch = errorMessage.match(/Expected to find element: \`?\'?([^',`]+)\`?\'?/);
  let oldSelector = selectorMatch ? selectorMatch[1].replace(/\\"/g, '"') : null;

  if (!oldSelector) {
    // Tentar outro formato comum do Cypress
    const altMatch = errorMessage.match(/cy\.get\(\)\` failed because this element is detached.*?((?:\.|\#|\[)[^ ]+)/);
    if (altMatch) oldSelector = altMatch[1];
  }
  //  
  return { failedStep, errorMessage, oldSelector, status: 'FAILED_STEP_FOUND' };
}
// Função 2: Conecta na aplicação e baixa a estrutura HTML atual (DOM) da página.
// Limpa o excesso de lixo (como scripts e svg) para que o LLM não estoure o limite de tokens na leitura.
async function extractDOM(state) {
  if (state.status !== 'FAILED_STEP_FOUND' || !state.oldSelector) {
    console.log('➤ [Node] Não foi possível encontrar um seletor no erro para curar.');
    return { status: 'CANT_HEAL' };
  }
  //  
  console.log('➤ [Node] Buscando a árvore do DOM da aplicação alvo...');
  try {
    const response = await fetch('https://automationexercise.com/');
    const html = await response.text();
    const $ = cheerio.load(html);

    // Limpar tags inúteis para poupar tokens do LLM
    $('script, style, svg, path, link, meta, noscript').remove();

    // Pegar apenas o body ou uma parte razoável
    let domSnippet = $('body').html();
    if (domSnippet && domSnippet.length > 15000) {
      // Truncar de forma rústica se for gigante
      domSnippet = domSnippet.substring(0, 15000) + '...';
    }
    //    
    return { domSnippet };
  } catch (error) {
    console.log('❌ Erro ao buscar DOM:', error.message);
    return { status: 'ERROR' };
  }
}
// Função 3: Injeta o contexto da falha (seletor velho, passo do teste e o DOM limpo)
// dentro de um prompt dinâmico enviado para a Inteligência Artificial local (Llama3 via Ollama).
// O modelo raciocina sobre o HTML e deduz qual deve ser o novo seletor correto.
async function deduceNewSelector(state) {
  if (state.status !== 'FAILED_STEP_FOUND') return state;
  //  
  console.log(`➤ [Node] Invocando Llama3 para curar o seletor '${state.oldSelector}'...`);
  //    
  const model = new ChatOllama({
    baseUrl: 'http://localhost:11434',
    model: 'llama3',
    temperature: 0.1,
  });
  // Um prompt para o LLM sugerir o novo seletor    
  const prompt = PromptTemplate.fromTemplate(`
Você é um bot focado exclusivamente em consertar seletores CSS e XPath de testes E2E.
O teste falhou porque o seletor antigo "{oldSelector}" não existe mais no DOM.

Este é o passo do teste que falhou: "{step}"

Aqui está o código HTML minificado da página no momento do erro:
{dom}

Com base no passo do teste e no HTML acima, qual é o novo seletor CSS exato e único que deve ser usado para encontrar esse elemento?
(Dica: Procure por links ou botões relacionados a 'Login' ou 'Signup' baseados no nome do passo).
Responda APENAS com a string do novo seletor CSS, sem aspas, sem explicação, sem markdown. Apenas o seletor cru.
Seletor:`);

  const chain = prompt.pipe(model);
  const result = await chain.invoke({
    oldSelector: state.oldSelector,
    step: state.failedStep,
    dom: state.domSnippet
  });

  const newSelector = result.content.trim().replace(/^`|`$/g, '').replace(/^"|"$/g, '').trim();
  console.log(`✨ Llama3 sugeriu o novo seletor: ${newSelector}`);

  return { newSelector };
}

// Função 4: Pega a resposta gerada pela IA e atua como um desenvolvedor robô:
// Ele varre a pasta local do seu projeto, encontra onde o seletor antigo foi escrito
// e reescreve fisicamente o seu arquivo .js, substituindo pelo novo seletor consertado.
function healTestCode(state) {
  if (!state.newSelector || state.status !== 'FAILED_STEP_FOUND') return state;

  console.log('➤ [Node] Aplicando o curativo no código fonte...');
  const stepsDir = path.join(__dirname, '..', 'cypress', 'support', 'step_definitions');
  const files = fs.readdirSync(stepsDir);

  let healed = false;

  for (const file of files) {
    if (!file.endsWith('.js')) continue;

    const filePath = path.join(stepsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Se o arquivo contém o seletor antigo
    if (content.includes(state.oldSelector)) {
      // Fazer o replace globalmente no arquivo
      content = content.replaceAll(state.oldSelector, state.newSelector);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`💉 Arquivo curado: ${file}`);
      healed = true;
    }
  }

  return { status: healed ? 'HEALED' : 'HEAL_FAILED' };
}

// Função 5: Dispara o Cypress no terminal (background) rodando seus testes novamente.
// Isso serve para garantir que a "cura" feita pela IA resolveu a quebra e deixou a pipeline verde.
function runCypress(state) {
  if (state.status !== 'HEALED') {
    console.log('❌ Cura falhou ou não foi necessária.');
    return state;
  }

  console.log('➤ [Node] Re-executando o Cypress para validar a cura...');
  try {
    execSync('npm run cy:run -- --spec cypress/e2e/demo/healing_demo.feature --config specPattern="cypress/e2e/demo/**/*.feature"', { stdio: 'inherit' });
    console.log('✅ TESTE CURADO COM SUCESSO! A pipeline está verde novamente!');
    return { status: 'SUCCESS' };
  } catch (e) {
    console.log('❌ O novo seletor também falhou na re-execução.');
    return { status: 'RE_RUN_FAILED' };
  }
}

// 3. Configurando o Grafo
const builder = new StateGraph(HealingState)
  .addNode('extractFailureInfo', extractFailureInfo)
  .addNode('extractDOM', extractDOM)
  .addNode('deduceNewSelector', deduceNewSelector)
  .addNode('healTestCode', healTestCode)
  .addNode('runCypress', runCypress)

  .addEdge(START, 'extractFailureInfo')
  .addEdge('extractFailureInfo', 'extractDOM')
  .addEdge('extractDOM', 'deduceNewSelector')
  .addEdge('deduceNewSelector', 'healTestCode')
  .addEdge('healTestCode', 'runCypress')
  .addEdge('runCypress', END);

const graph = builder.compile();

async function startAutoHealing() {
  const initialState = {
    failedStep: null,
    errorMessage: null,
    oldSelector: null,
    domSnippet: null,
    newSelector: null,
    status: 'START'
  };

  const result = await graph.invoke(initialState);
  console.log('\n🏁 Fim do fluxo de Auto-Healing.');
}

startAutoHealing();
