import { AnchorAutofileCheckFaqContent } from "@/app/anchor-autofile/AnchorAutofileCheckFaqContent";
import { AnchorAutofileDirectDepositFaqContent } from "@/app/anchor-autofile/AnchorAutofileDirectDepositFaqContent";

import { fillFields, MOCK_SSN, MOCK_ZIP } from "./utils";

beforeEach(() => {
  cy.on("window:before:load", (win) => {
    win.gtag = cy.stub().as("gtag");
  });
  cy.visit("/");
  fillFields();
  cy.intercept("POST", "/api/status", {
    statusCode: 200,
    fixture: "v2_api_empty_records.json",
  });
});

it("should route the user to the payment-info page when autofile API and status API return records", () => {
  cy.intercept("POST", "/api/status", {
    statusCode: 200,
    fixture: "v2_api_found_records.json",
  });
  cy.intercept("POST", "/api/autofile", {
    statusCode: 200,
    fixture: "autofile_api_check.json",
  });
  cy.contains("button", `Check Status`).click();
  cy.url().should("include", "/payment-info");
});

it("should route the user to the autofile page when autofile API returns true with CHECK", () => {
  cy.intercept("POST", "/api/autofile", {
    statusCode: 200,
    fixture: "autofile_api_check.json",
  });
  cy.contains("button", `Check Status`).click();
  cy.contains("h1", "A 2025 ANCHOR application will be filed on your behalf.").should("be.visible");
  cy.get("@gtag").should(
    "have.been.calledWith",
    "event",
    "autofile_check",
    Cypress.sinon.match.any,
  );
  cy.contains("p", "SSN/ITIN: ***-**-").should("be.visible");
  cy.contains("p", MOCK_SSN.slice(-4)).should("be.visible");
  cy.contains("p", "ZIP Code:").should("be.visible");
  cy.contains("p", MOCK_ZIP).should("be.visible");
  cy.contains("p", "Tax Year: 2025").should("be.visible");
  cy.contains("p", "Payment Type: Check").should("be.visible");

  for (const faq of AnchorAutofileCheckFaqContent) {
    cy.contains("button", faq.title as string).click();
    cy.get(`div[id="${faq.id}"]`).should("be.visible");
    cy.get("@gtag").should(
      "have.been.calledWith",
      "event",
      `${faq.id}_opened`,
      Cypress.sinon.match.any,
    );
    cy.contains("button", faq.title as string).click();
    cy.get(`div[id="${faq.id}"]`).should("not.be.visible");
  }
});

it("should route the user to the autofile page when autofile API returns true with Direct Deposit", () => {
  cy.intercept("POST", "/api/autofile", {
    statusCode: 200,
    fixture: "autofile_api_direct_deposit.json",
  });
  cy.contains("button", `Check Status`).click();
  cy.contains("h1", "A 2025 ANCHOR application will be filed on your behalf.").should("be.visible");
  cy.get("@gtag").should(
    "have.been.calledWith",
    "event",
    "autofile_direct_deposit",
    Cypress.sinon.match.any,
  );
  cy.contains("p", "SSN/ITIN: ***-**-").should("be.visible");
  cy.contains("p", MOCK_SSN.slice(-4)).should("be.visible");
  cy.contains("p", "ZIP Code:").should("be.visible");
  cy.contains("p", MOCK_ZIP).should("be.visible");
  cy.contains("p", "Tax Year: 2025").should("be.visible");
  cy.contains("p", "Payment Type: Direct Deposit").should("be.visible");
  for (const faq of AnchorAutofileDirectDepositFaqContent) {
    cy.contains("button", faq.title as string).click();
    cy.get(`div[id="${faq.id}"]`).should("be.visible");
    cy.get("@gtag").should(
      "have.been.calledWith",
      "event",
      `${faq.id}_opened`,
      Cypress.sinon.match.any,
    );
    cy.contains("button", faq.title as string).click();
    cy.get(`div[id="${faq.id}"]`).should("not.be.visible");
  }
});
