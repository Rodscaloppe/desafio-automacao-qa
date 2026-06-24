require('dotenv').config();
const axios = require('axios');

describe('API Tests - Auth com clientSdkKey', () => {
  const sdkKey = process.env.CLIENT_SDK_KEY;
  const ECHO_URL = 'https://postman-echo.com';

  // Cenário 1
  it('Deve carregar a chave clientSdkKey corretamente a partir do arquivo .env', () => {
    expect(sdkKey).toBeDefined();
    expect(typeof sdkKey).toBe('string');
    expect(sdkKey.length).toBeGreaterThan(10);
    expect(sdkKey.startsWith('client-')).toBeTruthy();
  });

  // Cenário 2 (Refatorado para Basic OAuth 1.0)
  it('Deve construir o Header OAuth 1.0 utilizando a clientSdkKey como consumer_key', async () => {
    // Trello utiliza OAuth 1.0 (ou Token via Query Params). Aqui simulamos a construção do Header OAuth:
    const oauthHeader = `OAuth oauth_consumer_key="${sdkKey}", oauth_token="dummy_token_123", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${Math.floor(Date.now() / 1000)}"`;

    const response = await axios.get(`${ECHO_URL}/get`, {
      headers: {
        'Authorization': oauthHeader
      }
    });

    expect(response.status).toBe(200);

    // O postman-echo retorna os headers em lowercase
    const receivedAuthHeader = response.data.headers['authorization'];

    // Verifica se a estrutura OAuth chegou corretamente formatada contendo a chave
    expect(receivedAuthHeader).toContain(`oauth_consumer_key="${sdkKey}"`);
    expect(receivedAuthHeader).toContain('oauth_signature_method="HMAC-SHA1"');
  });

  // Cenário 3
  it('Deve transmitir a clientSdkKey como Query Parameter (padrão key/token do Trello)', async () => {
    // O Trello permite autenticação simples passando a chave como 'key' e o token como 'token' na Query String
    const response = await axios.get(`${ECHO_URL}/get`, {
      params: {
        key: sdkKey,
        token: 'dummy_token_123',
        timestamp: Date.now()
      }
    });

    expect(response.status).toBe(200);

    // O postman-echo retorna os query params no objeto "args"
    const receivedQueryParams = response.data.args;

    // Verificamos se o parâmetro 'key' chegou na API com o valor exato da nossa SDK Key
    expect(receivedQueryParams.key).toBe(sdkKey);
    expect(receivedQueryParams.token).toBe('dummy_token_123');
    expect(receivedQueryParams).toHaveProperty('timestamp');
  });
});