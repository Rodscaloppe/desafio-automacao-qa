const fs = require('fs');
const { execSync } = require('child_process');
const { ChatOllama } = require('@langchain/ollama');
const { PromptTemplate } = require('@langchain/core/prompts');

async function runRCA() {
  console.log('🤖 Iniciando Agente de RCA (Root Cause Analysis)...\n');
  console.log('⚡ Conectando ao Ollama (Local LLM)...\n');

  // Passo 1: Carregar o Relatório de Testes
  // O Agente lê o JSON gerado pelo Cypress para entender o que aconteceu na última execução.
  const reportPath = 'cypress/reports/cucumber-json/cucumber-report.json';
  if (!fs.existsSync(reportPath)) {
    console.error(`❌ ERRO: Relatório não encontrado em ${reportPath}. Rode os testes primeiro.`);
    process.exit(1);
  }

  const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  let failedStep = null;
  let failedScenario = null;
  let errorMessage = null;

  // Passo 2: Extrair a Falha
  // O script varre o JSON em busca do primeiro cenário e passo (step) que falharam, capturando a mensagem de erro.
  outerLoop:
  for (const feature of reportData) {
    for (const element of feature.elements || []) {
      for (const step of element.steps || []) {
        if (step.result && step.result.status === 'failed') {
          failedScenario = element.name;
          failedStep = step.name;
          errorMessage = step.result.error_message;
          break outerLoop;
        }
      }
    }
  }

  if (!failedStep) {
    console.log('✅ Nenhum teste falho encontrado no relatório. Tudo certo!');
    return;
  }

  console.log(`🔎 Falha detectada no cenário: "${failedScenario}"`);
  console.log(`🔎 Passo falho: "${failedStep}"`);

  // Passo 3: Histórico do Git
  // Para tentar descobrir a causa raiz, o Agente busca os últimos commits. 
  // Se alguém alterou um arquivo recentemente, pode ter sido a causa da quebra!
  let gitChanges = '';
  try {
    gitChanges = execSync('git log -2 --stat').toString();
  } catch (err) {
    gitChanges = 'Não foi possível obter o histórico do git.';
  }

  // Passo 4: Inicializar o LangChain e a Inteligência Artificial (Llama3)
  // Conecta com o Ollama rodando localmente na máquina, garantindo que nenhum dado sensível vaze para a internet.
  console.log('\n🧠 Analisando os dados com LangChain + Ollama (llama3)...\n');
  
  try {
    // Apontando para o Ollama rodando localmente na porta padrão
    const model = new ChatOllama({
      baseUrl: 'http://localhost:11434', // Default value
      model: 'llama3', // Modelo padrão configurado
      temperature: 0.2,
    });

    const promptTemplate = PromptTemplate.fromTemplate(`
Você é um Engenheiro de Qualidade Sênior e Detetive de Falhas (RCA Agent).
Sua missão é ler os dados de uma falha de teste Cypress e entregar uma explicação clara, concisa e focada na raiz do problema, no formato de uma notificação para o Slack.

DADOS DA FALHA:
Cenário: {scenario}
Passo (Step): {step}
Mensagem de Erro do Cypress: {errorMessage}

Últimas alterações no repositório (Git Log):
{gitChanges}

REGRAS DA MENSAGEM (Sua resposta deve seguir essa estrutura e ser escrita em Português):
🚨 *ALERTA DE FALHA DE TESTE* 🚨
*Cenário:* [Nome do cenário]
*Qual foi o problema:* [Explique de forma técnica mas compreensível, sem código muito longo, baseando-se no erro]
*Causa Raiz provável:* [Use os dados do erro ou das mudanças do git para teorizar por que isso aconteceu]
*Recomendação de correção:* [Uma recomendação direta para o desenvolvedor ou QA]
`);
    
    // Passo 5: Invocar o Modelo
    // Junta o Prompt com o Llama3 e envia as variáveis dinâmicas (erro, cenário, histórico do git).
    
    const chain = promptTemplate.pipe(model);
    
    const response = await chain.invoke({
      scenario: failedScenario,
      step: failedStep,
      errorMessage: errorMessage,
      gitChanges: gitChanges
    });

    console.log('================ RESUMO DA CAUSA RAIZ ================');
    console.log(response.content);
    console.log('======================================================');
  } catch (error) {
    console.error('❌ Erro ao invocar o Ollama:', error.message);
    console.log('\n💡 DICA: Verifique se o Ollama está rodando e se o modelo "llama3" foi baixado (ollama run llama3).');
  }
}

runRCA();
