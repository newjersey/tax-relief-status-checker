import { fillFields } from "./utils";

beforeEach(() => {
  cy.on("window:before:load", (win) => {
    win.gtag = cy.stub().as("gtag");
  });
  cy.visit("/");
  fillFields();
  cy.intercept("POST", "/api/status", {
    statusCode: 200,
    fixture: "empty_records.json",
  });
});

it("should route the user to the missingMailer page when missingMailer has API records", () => {
  cy.intercept("POST", "/api/missed-mailer", {
    statusCode: 200,
    fixture: "missed_mailer_found_records.json",
  });
  cy.contains("button", `Check Status`).click();
  cy.url().should("include", "/missed-mailer");
  cy.contains("h3", "We could not file an ANCHOR benefit application on your behalf").should(
    "be.visible",
  );
  cy.contains("p", "You must file the ANCHOR application yourself by November 2, 2026.").should(
    "be.visible",
  );
});
