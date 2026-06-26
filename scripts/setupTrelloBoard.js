require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const apiKey = process.env.TRELLO_API_KEY;
const apiToken = process.env.TRELLO_API_TOKEN;
const BASE_URL = process.env.TRELLO_BASE_URL || 'https://api.trello.com/1';

const envFilePath = path.join(__dirname, '..', '.env');

/**
 * Cria um quadro (Board) no Trello.
 */
async function createBoard(boardName) {
  console.log(`🏗️  Criando um novo Board "${boardName}"...`);
  const response = await axios.post(`${BASE_URL}/boards/`, null, {
    params: {
      key: apiKey,
      token: apiToken,
      name: boardName,
      defaultLists: 'false'
    }
  });
  console.log(`✅ Board criado com sucesso! ID: ${response.data.id}`);
  return response.data.id;
}

/**
 * Cria uma Lista dentro de um Quadro específico.
 */
async function createList(listName, boardId) {
  console.log(`🏗️  Criando a lista (coluna) "${listName}"...`);
  const response = await axios.post(`${BASE_URL}/lists`, null, {
    params: {
      key: apiKey,
      token: apiToken,
      name: listName,
      idBoard: boardId
    }
  });
  console.log(`✅ Lista criada com sucesso! ID Real: ${response.data.id}`);
  return response.data.id;
}

/**
 * Atualiza a chave TRELLO_LIST_ID no arquivo .env local.
 */
function updateEnvFile(listId) {
  console.log('🔄 Atualizando o arquivo .env automaticamente...');
  let envContent = fs.readFileSync(envFilePath, 'utf8');
  
  const regex = /TRELLO_LIST_ID=["']?[a-zA-Z0-9_]*["']?/;
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `TRELLO_LIST_ID=${listId}`);
  } else {
    envContent += `\nTRELLO_LIST_ID=${listId}`;
  }

  fs.writeFileSync(envFilePath, envContent, 'utf8');
  console.log('🎉 SUCESSO! Seu .env foi atualizado e o Trello Bug Reporter Agent já está pronto para criar cards reais!');
}

async function setupTrello() {
  if (!apiKey || !apiToken) {
    console.error('❌ ERRO: Você precisa colocar suas chaves reais (TRELLO_API_KEY e TRELLO_API_TOKEN) no .env primeiro!');
    process.exit(1);
  }

  try {
    const boardId = await createBoard('QA - Bug Tracking');
    const listId = await createList('Bugs Identificados', boardId);
    updateEnvFile(listId);
  } catch (error) {
    console.error('❌ Falha ao configurar o Trello:');
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

setupTrello();
