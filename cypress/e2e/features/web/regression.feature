# language: pt

@regression
Funcionalidade: Jornada de Compra End-to-End (Regressão)
  
  Cenário: Realizar o fluxo completo de cadastro, compra e limpeza da conta
    Dado que a página inicial é carregada com sucesso
    E crio uma conta nova com nome "User QA", email randômico e dados completos
    Quando eu adiciono o produto "Blue Top" ao carrinho
    E eu adiciono o produto "Men Tshirt" ao carrinho
    E eu navego para a tela de carrinho
    E eu removo o produto "Men Tshirt" do carrinho
    E eu procedo para o checkout
    Então o endereço de entrega e cobrança devem estar corretos
    E eu insiro o comentário "Teste E2E QA" e finalizo o pedido
    E preencho dados falsos de cartão de crédito e confirmo o pagamento
    Então o pedido deve ser colocado com sucesso
    E a conta criada deve ser deletada para garantir a limpeza dos dados
