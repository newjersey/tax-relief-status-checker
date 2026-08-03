import { fillFields, MOCK_SSN, MOCK_ZIP } from "./utils";

const moreInformationNeededAssertions = () => {
  cy.url().should("include", "/more-information-needed");
  cy.contains("h1", "Your application was received on").should("be.visible");

  cy.contains("p", "SSN/ITIN: ***-**-").should("be.visible");
  cy.contains("p", MOCK_SSN.slice(-4)).should("be.visible");
  cy.contains("p", "ZIP Code:").should("be.visible");
  cy.contains("p", MOCK_ZIP).should("be.visible");
  cy.contains("p", "Tax Year: 2025").should("be.visible");

  cy.get("@gtag").should(
    "have.been.calledWith",
    "event",
    "api_200_record_found",
    Cypress.sinon.match.any,
  );

  cy.contains("a", "Log out").click();
  cy.contains("h1", "This website is checking your 2025 PAS");
};

beforeEach(() => {
  cy.on("window:before:load", (win) => {
    win.gtag = cy.stub().as("gtag");
  });
  cy.visit("/");
});

it("should display issue flagged warning - upload tax bill", () => {
  fillFields();
  cy.fixture("v2_api_issue_flagged_upload_bill.json").then((resp) => {
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      body: resp,
    });
  });
  cy.contains("button", `Check Status`).click();

  cy.contains(
    "p",
    "We need additional information to continue processing your application. Please send us a copy of your final property tax bill by using one of the following:",
  ).should("be.visible");
  moreInformationNeededAssertions();
});

it("should display issue flagged warning - contact taxation", () => {
  fillFields();
  cy.fixture("v2_api_issue_flagged_contact_taxation.json").then((resp) => {
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      body: resp,
    });
  });
  cy.contains("button", `Check Status`).click();

  cy.contains(
    "p",
    "We need additional information to continue processing your application. Please contact the Division by using one of the following:",
  ).should("be.visible");
  moreInformationNeededAssertions();
});
