Feature: Carrinho e Checkout

  Scenario: Incluir produto no carrinho e validar na tela de pagamento
    Given que eu possuo uma conta logada
    When eu adiciono o produto "Blue Top" ao carrinho
    And navego para a tela de pagamento
    Then eu devo validar se os produtos do carrinho estão corretos na tela de checkout
    And a conta deve ser deletada no final para limpeza de massa
