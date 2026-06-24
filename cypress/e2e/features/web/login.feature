Feature: Login e Cadastro

  Scenario: Criar usuário e logar com sucesso
    Given que eu acesso a página inicial
    When eu navego para a página de login/signup
    And crio uma nova conta com dados válidos
    Then eu devo estar logado com sucesso
    And minha conta deve ser deletada no final para limpeza de massa

  Scenario: Cadastro com e-mail já existente
    Given que eu acesso a página inicial
    When eu navego para a página de login/signup
    And tento me cadastrar com um e-mail já existente "teste@teste.com"
    Then devo ver a mensagem de erro de cadastro "Email Address already exist!"

  Scenario: Validar obrigatoriedade dos campos no formulário de cadastro
    Given que eu acesso a página inicial
    When eu navego para a página de login/signup
    And inicio o cadastro com um novo e-mail
    And tento criar a conta sem preencher o campo obrigatório "last_name"
    Then o sistema deve alertar que o campo "last_name" é obrigatório com a mensagem "Please fill out this field."
