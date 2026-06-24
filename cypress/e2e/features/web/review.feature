Feature: Adicionar Avaliação a Produto

  Scenario: Avaliar um produto com sucesso
    Given que eu acesso a página inicial
    When eu clico no primeiro produto listado
    And preencho o formulário de avaliação com nome, email e comentário
    And envio a avaliação
    Then eu devo ver a mensagem de confirmação de avaliação "Thank you for your review."
