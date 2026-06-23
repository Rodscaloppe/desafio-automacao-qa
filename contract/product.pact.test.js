const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const axios = require('axios');

const provider = new PactV3({
  consumer: 'AutomationExerciseFrontend',
  provider: 'AutomationExerciseAPI',
});

describe('Feature: Contrato da API de Produtos', () => {
  it('Scenario: Validar a estrutura da resposta da listagem de produtos', () => {
    // Given
    const EXPECTED_BODY = {
      responseCode: MatchersV3.integer(200),
      products: MatchersV3.eachLike({
        id: MatchersV3.integer(1),
        name: MatchersV3.string('Blue Top'),
        price: MatchersV3.string('Rs. 500'),
        brand: MatchersV3.string('Polo'),
      }),
    };

    provider
      .given('Existem produtos cadastrados no sistema')
      .uponReceiving('Uma requisição GET para lista de produtos')
      .withRequest({
        method: 'GET',
        path: '/api/productsList',
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: EXPECTED_BODY,
      });

    // When & Then
    return provider.executeTest(async (mockserver) => {
      const response = await axios.get(`${mockserver.url}/api/productsList`);
      
      expect(response.status).toEqual(200);
      expect(response.data.responseCode).toEqual(200);
      expect(response.data.products[0].name).toEqual('Blue Top');
    });
  });
});
