Feature: Login e Cadastro

  Scenario: Criar usuário e logar com sucesso
    Given que eu acesso a página inicial
    When eu navego para a página de login/signup
    And crio uma nova conta com dados válidos
    Then eu devo estar logado com sucesso
    And minha conta deve ser deletada no final para limpeza de massa
