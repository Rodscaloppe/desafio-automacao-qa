Feature: Carrinho e Checkout

  Scenario Outline: Incluir produto no carrinho e validar na tela de pagamento
    Given que eu possuo uma conta logada
    When eu adiciono o produto "<produto>" ao carrinho
    And navego para a tela de pagamento
    Then eu devo validar se o produto "<produto>" está correto na tela de checkout
    And a conta deve ser deletada no final para limpeza de massa

    Examples:
      | produto  |
      | Blue Top |
