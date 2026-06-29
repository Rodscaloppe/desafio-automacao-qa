Feature: Busca de Produtos

  Scenario Outline: Realizar busca de um produto existente
    Given que eu acesso a página de produtos
    When eu realizo a busca pelo produto "<produto>"
    Then o produto "<produto>" deve ser exibido nos resultados

    Examples:
      | produto  |
      | Blue Top |
