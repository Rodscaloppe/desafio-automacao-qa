Feature: Inscrição na Newsletter

  Scenario Outline: Inscrever-se na newsletter pela página inicial
    Given que eu acesso a página inicial
    When eu rolo até o rodapé e insiro meu email na newsletter
    And clico no botão de inscrição
    Then eu devo ver a mensagem de confirmação da newsletter "<mensagem_confirmacao>"

    Examples:
      | mensagem_confirmacao                   |
      | You have been successfully subscribed! |
