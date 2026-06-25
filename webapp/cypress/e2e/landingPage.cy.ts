import { Button } from "@trussworks/react-uswds";
import { LandingPageFaq } from "@/components/LandingPageFaq";

const fillField = (fieldName: string, value: string): undefined => {
  cy.get(`input[name="${fieldName}"]`).type(value);
};

const expandAccordion = (answerID: string, questionText: string): undefined => {
  cy.contains("button", questionText).click();
  cy.get(`div[id="${answerID}"]`).should("be.visible");
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

it("should display an error message when the user enters malformatted SSN", () => {
  cy.visit("/");
  fillField("ssn", "1");
  cy.get(`button[type="submit"]`).click();
  const ssnError = cy.get(`span[id="ssnErrorMessage"]`);
  ssnError.should("be.visible");
  ssnError.should("contain.text", "SSN or ITIN number entered must have nine digits");
});

it("should display an error message when the user enters malformatted Zip", () => {
  cy.visit("/");
  fillField("zipCode", "1");
  cy.get(`button[type="submit"]`).click();
  const zipError = cy.get(`span[id="zipCodeErrorMessage"]`);
  zipError.should("be.visible");
  zipError.should("contain.text", "Zip code must have five digits");
});

it("should expand the accordion FAQ when clicked", () => {
  cy.visit("/");
  expandAccordion(
    "faq_when_can_i_expect_my_application_status",
    "When can I expect my application to show up?",
  );
});

it("should fire metrics when in a prod environment", () => {});
