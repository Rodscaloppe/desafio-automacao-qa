# language: pt

Funcionalidade: Acessibilidade do Automation Exercise
  Como um usuário da plataforma
  Quero garantir que as páginas sejam acessíveis para todos
  Para que possamos seguir as diretrizes WCAG

  Cenário: Validar acessibilidade na página inicial
    Dado que eu navego para a página inicial
    Quando a página carregar completamente
    Então eu não devo encontrar violações críticas de acessibilidade

  Cenário: Validar acessibilidade na página de login
    Dado que eu navego para a página de login
    Quando a tela de autenticação estiver visível
    Então eu não devo encontrar violações críticas de acessibilidade na tela de login
