import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '30s', target: 10 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], 
  },
};

export default function () {
  const BASE_URL = 'https://automationexercise.com';

  group('Feature: API de Busca (Performance)', () => {
    group('Scenario: Realizar busca por produtos sob carga', () => {
      // Given eu possuo um termo de busca válido
      const payload = {
        search_product: 'Blue Top'
      };

      // When eu realizo a submissão de busca
      const res = http.post(`${BASE_URL}/api/searchProduct`, payload);

      // Then o sistema deve aguentar a carga sem erros
      check(res, {
        'status is 200': (r) => r.status === 200,
      });
    });
  });

  sleep(1);
}
