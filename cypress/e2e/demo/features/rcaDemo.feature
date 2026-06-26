Feature: Simulação de Erro para RCA

  Scenario: Tentar carregar produtos com a API fora do ar (Erro 500)
    Given que a API de produtos está instável e retornará Erro 500
    When eu acesso a página de produtos
    Then devo conseguir visualizar a lista de produtos na tela
