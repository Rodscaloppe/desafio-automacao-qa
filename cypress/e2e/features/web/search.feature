Feature: Busca de Produtos

  Scenario: Realizar busca de um produto existente
    Given que eu acesso a página de produtos
    When eu realizo a busca pelo produto "Blue Top"
    Then o produto "Blue Top" deve ser exibido nos resultados
