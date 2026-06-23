Feature: Cenários de Exceção

  Scenario: Login com credenciais inválidas
    Given que eu acesso a página inicial
    When eu navego para a página de login/signup
    And tento logar com o email "email_invalido@teste.com" e senha "senha_errada"
    Then devo ver a mensagem de erro "Your email or password is incorrect!"
