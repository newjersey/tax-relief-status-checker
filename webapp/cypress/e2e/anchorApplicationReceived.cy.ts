import { fillFields, MOCK_SSN, MOCK_ZIP, MOCK_DATE } from "./utils";

const applicationReceivedAssertions = () => {
  cy.url().should("include", "/anchor-application-received");
  cy.contains("h1", `We have your 2025 ANCHOR application on file as of ${MOCK_DATE}`).should(
    "be.visible",
  );
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
  cy.contains("p", "Your 2025 ANCHOR application is being processed.").should("be.visible");

  cy.contains("a", "Log out").click();
  cy.contains("h1", "Track your 2025 property tax relief application and payment status");
};

beforeEach(() => {
  cy.on("window:before:load", (win) => {
    win.gtag = cy.stub().as("gtag");
  });
  cy.visit("/");
});

it("should anchor-application-received page if records has an object in a 200 response, no transactions", () => {
  fillFields();

  cy.fixture("anc1_no_trans_records.json").then((resp) => {
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      body: resp,
    });
  });
  cy.contains("button", `Check Status`).click();
  applicationReceivedAssertions();
});
