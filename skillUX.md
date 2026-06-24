# Skill UX: Análise de Causa Raiz e Resiliência em Automação (UX/QA)

## 🕵️ A Verdadeira Causa Raiz (Análise da Evidência)

Anteriormente teorizamos que o clássico erro de *timeout* (estouro de 10.000ms procurando o campo `[data-qa="password"]`) poderia ter sido causado por anúncios (Ads Overlay) ou lentidão na API. 

Porém, **analisando a evidência visual (Screenshot) anexada ao relatório de erro do Cypress**, a verdadeira Causa Raiz foi revelada:

O Cypress preencheu o formulário de "New User Signup!" e clicou no botão "Signup". No entanto, o sistema rejeitou o cadastro e exibiu a mensagem de erro em vermelho:
> **"Email Address already exist!"**

### Por que o Timeout aconteceu?
1. O e-mail gerado (no print: `tess84@yahoo.com`) já existia no banco de dados da aplicação. Isso pode acontecer se um teste anterior falhou antes de executar o passo de "limpeza de massa" (`deleteAccount()`), ou por uma rara colisão randômica do Faker.
2. Como o e-mail já existia, o frontend barrou a transição de tela.
3. O Cypress, de forma "cega", executou o passo seguinte do código: procurar o campo `[data-qa="password"]`.
4. O Cypress esperou por 10 longos segundos na tela errada (Login), sem entender que a aplicação havia travado numa mensagem de erro de negócio.

---

## 🛠️ Como Melhorar a Arquitetura (A Perspectiva UX/QA)

Esse comportamento expõe um problema crônico em automações E2E: testes que falham por motivos técnicos genéricos (*Timeout*) mascaram problemas reais de negócio ou de massa de dados. O desenvolvedor perde horas tentando entender porque a página não carregou, quando na verdade o erro era um e-mail duplicado.

Para blindar nossa automação (`LoginPage.js`), não devemos apenas forçar cliques e checar a URL. Devemos criar **Âncoras de Previsibilidade**.

### Solução Proposta no Page Object

Nós já havíamos incluído a checagem de rota (`cy.url().should('include', '/signup')`). Isso força o erro a ser de rota ("expected url to include /signup") ao invés de um timeout de elemento. Mas podemos ser ainda mais cirúrgicos.

Se quisermos evitar que o teste fique parado 10 segundos esperando uma tela que nunca virá (ganhando tempo de execução na pipeline), podemos instruir o Cypress a validar imediatamente a **ausência** de mensagens de erro no formulário que acabou de submeter:

```javascript
  submitSignupStep1(name, email) {
    cy.get('[data-qa="signup-name"]').should('be.visible').type(name);
    cy.get('[data-qa="signup-email"]').should('be.visible').type(email);
    
    // Submete o formulário
    cy.get('[data-qa="signup-button"]').should('be.visible').click({ force: true });
    
    // UX/QA Melhoria de Resiliência:
    // Garante na mesma hora que o sistema NÃO exibiu o alerta de e-mail duplicado.
    // Se o alerta existir, o teste quebra instantaneamente informando exatamente a regra de negócio violada.
    cy.contains('Email Address already exist!').should('not.exist');
    
    // Ancoragem de transição: Obrigamos o Cypress a esperar a mudança da rota
    cy.url().should('include', '/signup');
  }
```

### Resumo do Benefício
Com essa melhoria:
1. **Feedback Instantâneo:** Se o banco estiver sujo, o teste não vai esperar 10 segundos para falhar. Ele vai quebrar em milissegundos apontando `Expected not to find text "Email Address already exist!"`.
2. **Relatório Claro:** O RCA (Root Cause Analysis) humano e de IA saberá instantaneamente que o problema é "Limpeza de Banco de Dados" e não "Lentidão de Tela" ou "Timeout de DOM".
3. **Economia de Recursos:** Redução de tempo ocioso nos *Runners* de Integração Contínua (CI).
