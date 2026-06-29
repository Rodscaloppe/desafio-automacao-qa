import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 }, // Ramp-up para 5 usuários em 10s
    { duration: '20s', target: 5 }, // Mantém 5 usuários por 20s
    { duration: '10s', target: 0 }, // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% das requisições devem ocorrer abaixo de 2s
    http_req_failed: ['rate<0.01'],    // Menos de 1% de falhas
  },
};

export default function () {
  const BASE_URL = 'https://automationexercise.com';

  group('Feature: API de Login (Performance)', () => {
    group('Scenario: Tentar realizar login e testar carga', () => {
      // Given eu preparo os dados de login
      const payload = {
        email: 'email_teste_carga@teste.com',
        password: 'senha_incorreta'
      };

      // When eu envio uma requisição POST para realizar login
      const res = http.post(`${BASE_URL}/api/verifyLogin`, payload);

      // Then a resposta deve retornar rapidamente e estar disponível
      check(res, {
        'status is 200 (page loads)': (r) => r.status === 200,
        'response time is acceptable': (r) => r.timings.duration < 2000,
      });
    });
  });

  sleep(1);
}
