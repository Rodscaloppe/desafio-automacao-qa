const axios = require('axios');

describe('Trello API - Actions Endpoint', () => {
  const TRELLO_ACTION_ID = '592f11060f95a3d3d46a987a';
  const BASE_URL = `https://api.trello.com/1/actions`;

  let response;

  // Realizamos uma requisição limpa antes de todos os testes para otimizar velocidade
  // e reusar o payload em cenários estáticos, simulando um cache de leitura.
  beforeAll(async () => {
    try {
      response = await axios.get(`${BASE_URL}/${TRELLO_ACTION_ID}`);
    } catch (error) {
      console.error('Falha ao buscar dados na API antes dos testes.');
    }
  });

  // Cenário 1 (Obrigatório)
  it('Deve retornar Status Code 200 e conter o name correto na estrutura list', () => {
    expect(response.status).toBe(200);
    
    const listName = response.data?.data?.list?.name;
    expect(listName).toBeDefined();
    
    console.log(`\n========================================`);
    console.log(`[SUCESSO] Valor encontrado no campo 'name': ${listName}`);
    console.log(`========================================\n`);
  });

  // Cenário 2
  it('Deve conter as propriedades obrigatórias de Schema (Contract/Schema Validation)', () => {
    expect(response.data).toHaveProperty('id', TRELLO_ACTION_ID);
    expect(response.data).toHaveProperty('type');
    expect(response.data).toHaveProperty('date');
    expect(response.data).toHaveProperty('data');
    expect(response.data.data).toHaveProperty('board');
    expect(response.data.data).toHaveProperty('card');
  });

  // Cenário 3
  it('Deve garantir a imutabilidade dos valores históricos (Board e Type)', () => {
    expect(response.data.type).toBe('updateCard');
    expect(response.data.data.board.name).toBe('Life Goals');
  });

  // Cenário 4 (Negativo)
  it('Deve retornar erro 404 (Not Found) ao consultar um Action ID inexistente mas de formato válido', async () => {
    try {
      // 24 caracteres hexadecimais para simular um ID válido que não existe
      await axios.get(`${BASE_URL}/592f11060f95a3d3d46a9999`);
      // Se não cair no catch, falhamos o teste de propósito
      expect(true).toBe(false);
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  // Cenário 5 (Performance)
  it('A requisição principal deve responder em menos de 1000ms', async () => {
    const start = Date.now();
    await axios.get(`${BASE_URL}/${TRELLO_ACTION_ID}`);
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(1000);
  });

  // Cenário 6 (Negativo - Formato Inválido)
  it('Deve retornar erro 400 (Bad Request) ao consultar um Action ID com formato inválido', async () => {
    try {
      // Passando um ID que foge ao padrão hexadecimal de 24 caracteres do MongoDB/Trello
      await axios.get(`${BASE_URL}/id_invalido_123`);
      expect(true).toBe(false);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toContain('invalid id');
    }
  });

  // Cenário 7 (Verificação de Relacionamento Aninhado)
  it('Deve conter as propriedades do usuário criador (memberCreator) com formato correto', () => {
    const member = response.data.memberCreator;
    
    expect(member).toBeDefined();
    expect(member).toHaveProperty('id');
    expect(member).toHaveProperty('username');
    expect(member).toHaveProperty('fullName');
    
    // Garantir que os campos vitais não são nulos ou vazios
    expect(member.id.length).toBeGreaterThan(0);
    expect(member.username).not.toBeNull();
  });
});
