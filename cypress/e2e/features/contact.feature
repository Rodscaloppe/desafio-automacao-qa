Feature: Fale Conosco

  Scenario: Enviar formulário de contato com sucesso
    Given que eu acesso a página inicial
    When eu clico em "Contact Us"
    And preencho o formulário de contato com dados válidos e envio
    Then eu devo ver a mensagem de sucesso "Success! Your details have been submitted successfully."
