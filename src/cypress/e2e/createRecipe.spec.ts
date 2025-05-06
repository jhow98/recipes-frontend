/// <reference types="cypress" />
describe('Fluxo Essencial completo: Login -> Criação -> Exclusão de Receita via UI', () => {
  let authToken: string
  const uniqueRecipeName = `Minha Receita de Teste ${Date.now()}`

  before(() => {
    cy.visit('/login')
    cy.get('input#login').type('teste')
    cy.get('input#password').type('111111')
    cy.intercept('POST', '/auth/login').as('loginReq')
    cy.get('form').submit()

    cy.wait('@loginReq').then(interception => {
      authToken = interception.response?.body?.access_token
      cy.window().then(win => {
        win.localStorage.setItem('token', authToken)
      })
    })
  })

  it('permite criar e excluir uma receita com sucesso', () => {
    cy.intercept('POST', '/recipes', req => {
      expect(req.headers['authorization']).to.equal(`Bearer ${authToken}`)
    }).as('createRecipe')

    cy.intercept('GET', '/recipes', req => {
      expect(req.headers['authorization']).to.equal(`Bearer ${authToken}`)
    }).as('getRecipes')

    cy.intercept('DELETE', '/recipes/*', req => {
      expect(req.headers['authorization']).to.equal(`Bearer ${authToken}`)
    }).as('deleteRecipe')

    cy.visit('/receitas/criar')

    cy.get('#name').type(uniqueRecipeName)
    cy.get('#preparation_time_minutes').type('25')
    cy.get('#servings').type('4')
    cy.get('#ingredients').type('Ingrediente 1, Ingrediente 2')
    cy.get('#preparation_method').type('Misture tudo e leve ao forno.')
    cy.get('.recipe-form__select-input').select('Jantar')
    cy.get('.recipe-form__button').click()

    cy.wait('@createRecipe').its('response.statusCode').should('eq', 201)
    cy.visit('/receitas')
    cy.wait('@getRecipes').its('response.statusCode').should('eq', 200)

    cy.contains('tr', uniqueRecipeName).within(() => {
      cy.get('button[title="Excluir"]').click()
    })

    cy.get('.confirm-modal__button--confirm').click()
    cy.wait('@deleteRecipe').its('response.statusCode').should('eq', 204)

    cy.contains('tr', uniqueRecipeName).should('not.exist')
  })
})
