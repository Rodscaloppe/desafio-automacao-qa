Feature: Power-Up de Estimativa de Tamanho (Trello)
  Como um usuário do quadro
  Eu quero poder estimar o tamanho das tarefas em camisetas (Small, Medium, Large, Extra Large)
  Para que a equipe consiga mensurar rapidamente o esforço de cada cartão à primeira vista

  Scenario: Validar exibição do botão "Estimate Size" no verso do cartão
    Given que eu possuo o Power-Up de estimativa habilitado no meu Workspace
    When eu abro o verso de um cartão qualquer no Trello
    Then eu devo visualizar o botão "Estimate Size" com o ícone de foguete na seção lateral de Power-Ups

  Scenario: Validar abertura do formulário de estimativa (Popup)
    Given que eu estou com um cartão aberto
    When eu clico no botão "Estimate Size"
    Then o Trello deve abrir um popup intitulado "Estimation"
    And o popup deve conter um formulário com um select listando as opções "Small", "Medium", "Large" e "Extra Large"

  Scenario: Validar persistência da estimativa no contexto do cartão (Salvar Dados)
    Given que eu abri o popup de estimativa de um cartão sem estimativa prévia
    When eu seleciono a opção "Medium 👚" no campo "Estimate"
    And clico no botão primário "Save"
    Then o popup de estimativa deve ser fechado automaticamente
    And os dados de plugin (pluginData) do cartão devem armazenar a estimativa "medium" em escopo "shared"

  Scenario: Validar re-hidratação de dados salvos ao reabrir o popup
    Given que o cartão atual possui a estimativa "large" armazenada no pluginData
    When eu clico no botão "Estimate Size" para reabrir o popup
    Then o campo select do popup já deve vir com a opção "Large 👔" pré-selecionada
