require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ChatOllama } = require('@langchain/ollama');

// Trello Config
const TRELLO_API_KEY = process.env.TRELLO_API_KEY;
const TRELLO_API_TOKEN = process.env.TRELLO_API_TOKEN;
const TRELLO_LIST_ID = process.env.TRELLO_LIST_ID;
const TRELLO_BASE_URL = process.env.TRELLO_BASE_URL || 'https://api.trello.com/1';

// Setup LLM
const USE_LOCAL_LLM = process.env.USE_LOCAL_LLM === 'true';
let llm;

if (USE_LOCAL_LLM) {
  llm = new ChatOllama({ model: "llama3:latest", temperature: 0.2 });
} else {
  if (!process.env.GEMINI_API_KEY) {
    console.error('ERRO: GEMINI_API_KEY não encontrada no .env');
    process.exit(1);
  }
  llm = new ChatGoogleGenerativeAI({
    modelName: 'gemini-1.5-flash',
    maxOutputTokens: 2048,
    temperature: 0.1,
    apiKey: process.env.GEMINI_API_KEY
  });
}

const reportPath = path.join(__dirname, '..', 'cypress', 'reports', 'cucumber-json', 'cucumber-report.json');

async function analyzeFailedTest(featureName, scenarioName, errorMsg) {
  console.log(`🧠 Acionando IA para estruturar Bug Report: [${scenarioName}]`);

  const prompt = `
Você é um Engenheiro de QA Especialista. Um teste de UI automatizado acabou de falhar.
Eu vou te fornecer a Feature, o Cenário e o Stacktrace/Erro.
Você deve redigir a Descrição do Bug (em Markdown) seguindo os padrões para um Card do Trello.
Não use blocos de código markdown triplos para englobar a resposta toda, responda apenas com o markdown que vai direto no card.

A estrutura deve ser:
**Feature:** [Nome da Feature]
**Cenário:** [Nome do Cenário]
**Descrição:** (Um breve resumo humano do erro)
**Detalhe Técnico (Error):** (O erro que ocorreu, limpo de sujeira se possível)
**Impacto:** (Qual o impacto provável na visão de usuário)

Aqui estão os dados da falha:
Feature: ${featureName}
Scenario: ${scenarioName}
Error: ${errorMsg}
`;

  try {
    const response = await llm.invoke(prompt);
    return response.content;
  } catch (error) {
    console.error("Erro ao chamar o LLM:", error.message);
    return `Falha ao gerar report com IA. Erro original: ${errorMsg}`;
  }
}

async function createTrelloCard(bugTitle, bugDescription) {
  // Dry-Run mode if keys are missing
  if (!TRELLO_API_KEY || !TRELLO_API_TOKEN || !TRELLO_LIST_ID || TRELLO_LIST_ID.includes('exemplo')) {
    console.warn('\n⚠️  MODO DRY-RUN (Credenciais do Trello ou TRELLO_LIST_ID ausentes) ⚠️');
    console.warn('O Card seria criado no Trello com as seguintes propriedades:\n');
    console.log('--- BEGIN CARD ---');
    console.log(`TITULO: [BUG] ${bugTitle}`);
    console.log(`DESCRICAO:\n${bugDescription}`);
    console.log('--- END CARD ---\n');
    return;
  }

  try {
    const url = `${TRELLO_BASE_URL}/cards`;
    console.log('📤 Enviando payload via POST para a API do Trello...');
    const res = await axios.post(url, null, {
      params: {
        key: TRELLO_API_KEY,
        token: TRELLO_API_TOKEN,
        idList: TRELLO_LIST_ID,
        name: `[BUG] ${bugTitle}`,
        desc: bugDescription,
        pos: 'top', // Joga o card de bug para o topo da lista
        idLabels: '' // Se quiser, pode injetar o ID da tag de bug (cor vermelha) aqui
      }
    });

    console.log(`✅ Sucesso! Trello Card criado: ${res.data.url}`);
  } catch (error) {
    console.error('❌ Falha na integração com API do Trello:');
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

async function runBugReporter() {
  console.log('🔎 Trello Bug Reporter Agent Iniciado...');

  if (!fs.existsSync(reportPath)) {
    console.error('❌ Arquivo de relatórios do Cucumber não encontrado.');
    process.exit(1);
  }

  const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  let foundBugs = 0;

  for (const feature of reportData) {
    const featureName = feature.name;

    for (const element of feature.elements) {
      const scenarioName = element.name;
      let scenarioFailed = false;
      let errorMsg = '';

      for (const step of element.steps) {
        if (step.result.status === 'failed') {
          scenarioFailed = true;
          errorMsg = step.result.error_message || 'Erro Desconhecido';
          break; // pega o primeiro erro do cenário
        }
      }

      if (scenarioFailed) {
        foundBugs++;
        console.log(`\n🐞 Bug detectado no cenário: ${scenarioName}`);
        const description = await analyzeFailedTest(featureName, scenarioName, errorMsg);
        
        const shortTitle = scenarioName.length > 50 ? scenarioName.substring(0, 50) + '...' : scenarioName;
        await createTrelloCard(shortTitle, description);
      }
    }
  }

  if (foundBugs === 0) {
    console.log('✨ Excelente! Nenhum bug encontrado no relatório.');
  } else {
    console.log(`\n🚀 Agente processou ${foundBugs} bug(s) com sucesso.`);
  }
}

runBugReporter();
