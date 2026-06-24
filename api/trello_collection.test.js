require('dotenv').config();
const axios = require('axios');

describe('Trello Postman Collection E2E (Jest + Axios)', () => {
  // Configuração das chaves extraídas do .env
  const apiKey = process.env.TRELLO_API_KEY;
  const apiToken = process.env.TRELLO_API_TOKEN;
  const BASE_URL = process.env.TRELLO_BASE_URL || 'https://api.trello.com/1';

  beforeAll(() => {
    if (!apiKey || !apiToken) {
      throw new Error('FATAL: TRELLO_API_KEY e TRELLO_API_TOKEN devem estar configurados no .env para rodar os testes da Postman Collection.');
    }
  });

  const defaultParams = {
    key: apiKey,
    token: apiToken
  };

  // Variáveis de ambiente compartilhadas entre os cenários (simulando pm.environment)
  let boardId;
  let todoListId;
  let cardId;
  const boardName = `My board ${Math.random().toString(36).substring(7)}`;

  // Cenário 1: Criar um quadro (Board)
  it('Cenário 1: Deve criar um novo Board', async () => {
    const response = await axios.post(`${BASE_URL}/boards/`, null, {
      params: {
        ...defaultParams,
        name: boardName,
        defaultLists: 'false'
      }
    });

    // Asserts baseados na aba "Test" do Postman
    expect(response.status).toBe(200);
    expect(response.data.name).toBe(boardName);
    expect(response.data.closed).toBe(false);
    expect(response.data.prefs.permissionLevel).toBe('private');

    // Salvando id do board para os próximos requests
    boardId = response.data.id;
  });

  // Cenário 2: Criar uma lista "TODO"
  it('Cenário 2: Deve criar uma lista "TODO" dentro do Board criado', async () => {
    const response = await axios.post(`${BASE_URL}/lists`, null, {
      params: {
        ...defaultParams,
        name: 'TODO',
        idBoard: boardId
      }
    });

    expect(response.status).toBe(200);
    expect(response.data.name).toBe('TODO');
    expect(response.data.closed).toBe(false);
    expect(response.data.idBoard).toBe(boardId);

    // Salvando id da lista
    todoListId = response.data.id;
  });

  // Cenário 3: Criar um Cartão na lista "TODO"
  it('Cenário 3: Deve criar um cartão "Learn Postman" na lista "TODO"', async () => {
    const response = await axios.post(`${BASE_URL}/cards`, null, {
      params: {
        ...defaultParams,
        name: 'Learn Postman',
        idList: todoListId
      }
    });

    expect(response.status).toBe(200);
    expect(response.data.name).toBe('Learn Postman');
    expect(response.data.closed).toBe(false);
    expect(response.data.idList).toBe(todoListId);
    expect(response.data.idBoard).toBe(boardId);
    
    // Verificando badges iniciais vazios
    expect(response.data.badges.votes).toBe(0);
    expect(response.data.badges.attachmentsByType.trello.card).toBe(0);

    cardId = response.data.id;
  });

  // Cenário 4: Deletar o quadro e garantir que foi excluído (Clean-up)
  it('Cenário 4: Deve deletar o Board e garantir que ele não existe mais (404)', async () => {
    // 1. Deletar o board
    const deleteResponse = await axios.delete(`${BASE_URL}/boards/${boardId}`, {
      params: defaultParams
    });
    expect(deleteResponse.status).toBe(200);

    // 2. Tentar recuperar o board deletado (deve retornar 404)
    try {
      await axios.get(`${BASE_URL}/boards/${boardId}`, {
        params: defaultParams
      });
      // Se não cair no catch, forçamos o erro do teste
      fail('A requisição GET deveria ter falhado com 404');
    } catch (error) {
      expect(error.response).toBeDefined();
      expect(error.response.status).toBe(404);
    }
  });
});
