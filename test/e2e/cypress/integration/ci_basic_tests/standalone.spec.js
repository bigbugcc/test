context('Resting of minimum viable functionality against docker standalone', () => {
  before(() => {
    cy.visit('/');
  });

  after(() => {});

  describe('Manipulating resources as admin', function () {
    beforeEach(() => {
      cy.visit('/');
      cy.auth('frontend', 'admin', 'portainer');
    });

    afterEach(() => {
      // Clean Tokens
      cy.clearUserTokens();
    });

    it('Login and create resources as admin', function () {
      cy.visit('/');
      cy.selectEndpoint('local');
      cy.modifyResources('frontend', 'create');
    });

    it('Login and delete resources as admin', function () {
      cy.visit('/');
      cy.selectEndpoint('local');
      cy.modifyResources('frontend', 'delete');
    });
  });
});
