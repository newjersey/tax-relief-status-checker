const fillField = (fieldName: string, value: string): undefined => {
  cy.get(`input[name="${fieldName}"]`).type(value);
};

it("should allow the user to visit the webpage", () => {
  cy.visit("/");
  cy.window().its("scrollY").should("equal", 0); // The page view should be at the top
});

it("should display an error message when the user tries to submit empty fields", () => {
  cy.visit("/");
  cy.get(`button[type="submit"]`).click();
  const ssnError = cy.get(`span[id="ssnErrorMessage"]`);
  const zipError = cy.get(`span[id="zipCodeErrorMessage"]`);
  ssnError.should("be.visible");
  ssnError.should("contain.text", "This question is required");
  zipError.should("be.visible");
  zipError.should("contain.text", "This question is required");
});
