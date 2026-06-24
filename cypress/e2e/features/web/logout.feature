Feature: Logout de Usuário

  Scenario: Realizar logout da conta com sucesso
    Given que eu acesso a página inicial
    And eu navego para a página de login/signup
    And crio uma nova conta com dados válidos
    When eu clico no botão "Logout"
    Then o sistema deve me redirecionar para a tela de Login
