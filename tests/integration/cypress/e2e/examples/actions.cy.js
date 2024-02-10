context('Actions', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/commands/actions');
  });
  it('.type() - type into a DOM element', () => {
    // https://on.cypress.io/type
    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.comm');
  });
  it('.type() - type into a DOM elementi2222', () => {
    // https://on.cypress.io/type
    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.comm');
  });
});
