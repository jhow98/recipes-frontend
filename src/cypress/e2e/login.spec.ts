/// <reference types="cypress" />
describe('Fluxo de Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('exibe formulário e faz login com sucesso', () => {
    cy.get('input#login').type('teste')
    cy.get('input#password').type('111111')
    cy.intercept('POST', '/auth/login', {
      statusCode: 200,
      body: {
        access_token: 'token',
      },
    }).as('loginReq')
    cy.get('form').submit()
    cy.wait('@loginReq')
    cy.url().should('include', '/receitas', { timeout: 10000 })
  })

  it('exibe mensagem de erro ao tentar logar com credenciais inválidas', () => {
    cy.get('input#login').type('usuario_invalido')
    cy.get('input#password').type('senha_invalida')
    cy.intercept('POST', '/auth/login', {
      statusCode: 401,
      body: {
        message: 'Login ou senha inválidos',
        error: 'Unauthorized',
        statusCode: 401,
      },
    }).as('loginReqFail')
    cy.get('form').submit()
    cy.wait('@loginReqFail')
    cy.contains('Credenciais inválidas.', { timeout: 5000 }).should('be.visible')
    cy.url().should('not.include', '/receitas', { timeout: 5000 })
  })
})
