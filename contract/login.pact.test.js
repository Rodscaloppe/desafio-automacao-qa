const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const axios = require('axios');

const provider = new PactV3({
  consumer: 'AutomationExerciseFrontend',
  provider: 'AutomationExerciseAPI',
});

describe('Feature: Contrato da API de Login', () => {
  it('Scenario: Validar a requisição e a resposta esperada para login válido', () => {
    // Given the login API provider
    const EXPECTED_BODY = {
      message: MatchersV3.string('User exists!'),
    };

    provider
      .given('Usuário de teste existente')
      .uponReceiving('Uma requisição POST para login')
      .withRequest({
        method: 'POST',
        path: '/api/verifyLogin',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'email=email_teste%40teste.com&password=senha_valida'
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: EXPECTED_BODY,
      });

    // When & Then
    return provider.executeTest(async (mockserver) => {
      const response = await axios.post(`${mockserver.url}/api/verifyLogin`, 
        'email=email_teste%40teste.com&password=senha_valida', 
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      
      expect(response.status).toEqual(200);
      expect(response.data.message).toEqual('User exists!');
    });
  });
});
