import { CurrentYear } from "@/components/TaxReliefDataProvider";
import { fillFields } from "./utils";
import { moreInformationNeededAssertions, logoutAssertions } from "./utils";

beforeEach(() => {
  cy.on("window:before:load", (win) => {
    win.gtag = cy.stub().as("gtag");
  });
  cy.visit("/");
});

it("should display issue flagged warning - upload tax bill", () => {
  fillFields();
  cy.fixture("pas1_issue_flagged_upload_bill.json").then((resp) => {
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
  moreInformationNeededAssertions(CurrentYear.YEAR2025);
  logoutAssertions();
});

it("should display issue flagged warning - contact taxation", () => {
  fillFields();
  cy.fixture("pas1_issue_flagged_contact_taxation.json").then((resp) => {
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
  moreInformationNeededAssertions(CurrentYear.YEAR2025);
  logoutAssertions();
});
