Feature: Simulação de Bug Crítico para Teste do Trello Reporter
  Como QA
  Eu quero simular uma falha inesperada na interface de login
  Para validar se o Agente de IA consegue varrer o erro e criar um Trello Card automaticamente

  Scenario: Inserir credenciais e encontrar falha inesperada no servidor
    Given o usuário acessa a página de login
    When o usuário insere email "falha_critica_bug@teste.com" e clica em login
    Then o sistema deve exibir uma mensagem de boas-vindas
    # O passo acima falhará intencionalmente porque não implementamos a tela de boas vindas para esse mock
