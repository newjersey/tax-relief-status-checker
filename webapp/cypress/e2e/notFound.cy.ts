it("should redirect the user to the landing page", () => {
  cy.visit({ url: "/this-page-does-not-exist", failOnStatusCode: false });
  cy.contains("h1", "Track your 2025 property tax relief application and payment status");
});
