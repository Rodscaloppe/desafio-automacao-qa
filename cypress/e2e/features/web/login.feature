Feature: Login e Cadastro

  Scenario: Criar usuário e logar com sucesso
    Given que eu acesso a página inicial
    When eu navego para a página de login/signup
    And crio uma nova conta com dados válidos
    Then eu devo estar logado com sucesso
    And minha conta deve ser deletada no final para limpeza de massa

  Scenario Outline: Cadastro com e-mail já existente
    Given que eu acesso a página inicial
    When eu navego para a página de login/signup
    And tento me cadastrar com um e-mail já existente "<email>"
    Then devo ver a mensagem de erro de cadastro "<mensagem_erro>"

    Examples:
      | email           | mensagem_erro                |
      | teste@teste.com | Email Address already exist! |

  Scenario Outline: Validar obrigatoriedade dos campos no formulário de cadastro
    Given que eu acesso a página inicial
    When eu navego para a página de login/signup
    And inicio o cadastro com um novo e-mail
    And tento criar a conta sem preencher o campo obrigatório "<campo>"
    Then o sistema deve alertar que o campo "<campo>" é obrigatório com a mensagem "<mensagem_alerta>"

    Examples:
      | campo     | mensagem_alerta             |
      | last_name | Please fill out this field. |
