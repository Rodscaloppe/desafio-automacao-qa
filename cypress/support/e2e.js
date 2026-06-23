import 'cypress-axe'
import './commands'

Cypress.on('uncaught:exception', (err, runnable) => {
  // retornar falso aqui impede que o Cypress 
  // falhe o teste devido a exceções não tratadas na aplicação
  return false
})
