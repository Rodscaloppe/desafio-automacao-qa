Feature: Cenários de Exceção

  Scenario Outline: Login com credenciais inválidas
    Given que eu acesso a página inicial
    When eu navego para a página de login/signup
    And tento logar com o email "<email>" e senha "<senha>"
    Then devo ver a mensagem de erro "<mensagem_erro>"

    Examples:
      | email                    | senha        | mensagem_erro                        |
      | email_invalido@teste.com | senha_errada | Your email or password is incorrect! |
