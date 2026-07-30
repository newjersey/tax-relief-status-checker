import { fillFields, MOCK_SSN, MOCK_ZIP } from "./utils";

const applicationReceivedAssertions = () => {
  cy.url().should("include", "/application-received");
  cy.contains("p", "Your application was received on").should("be.visible");

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

  cy.contains(
    "p",
    "Your application is being reviewed for three property tax relief programs",
  ).should("be.visible");
  cy.contains("p.usa-process-list__heading", "Senior Freeze").should("be.visible");
  cy.contains("p.usa-process-list__heading", "ANCHOR").should("be.visible");
  cy.contains("p.usa-process-list__heading", "Stay NJ").should("be.visible");

  cy.contains("a", "Log out").click();
  cy.contains("h1", "This website is checking your 2025 PAS");
};

beforeEach(() => {
  cy.on("window:before:load", (win) => {
    win.gtag = cy.stub().as("gtag");
  });
  cy.visit("/");
  fillFields();
});

it("should display status page if records has an object in a 200 response, no transactions", () => {
  fillFields();
  cy.fixture("v2_api_no_trans_records.json").then((resp) => {
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      body: resp,
    });
  });

  cy.contains("button", `Check Status`).click();

  applicationReceivedAssertions();
});

it("should display application found page if records has an object, but no transactions are payment_sent", () => {
  fillFields();
  cy.fixture("v2_api_found_records.json").then((resp) => {
    resp.records[0].ptr[0] = { status: "processing" };
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      body: resp,
    });
  });
  cy.contains("button", `Check Status`).click();

  applicationReceivedAssertions();
});
