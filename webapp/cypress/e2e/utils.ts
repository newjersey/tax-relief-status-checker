import { formatDate } from "@/app/utils/formatDate";
import { FormCode } from "@/components/types";

export const fillField = (fieldName: string, value: string): undefined => {
  cy.get(`input[name="${fieldName}"]`).type(value);
};

export const MOCK_SSN = "123456789";
export const MOCK_ZIP = "00000";
export const MOCK_DATE = formatDate("2026-03-19T00:00:00.000Z");

export const fillFields = () => {
  fillField("ssn", MOCK_SSN);
  fillField("zipCode", MOCK_ZIP);
};

export const applicationReceivedAssertions = (form_code: FormCode) => {
  if (form_code === FormCode.PAS1 || form_code === null) {
    cy.url().should("include", "/application-received");
    cy.contains("h1", `Your application was received on ${MOCK_DATE}`).should("be.visible");
  }
  if (form_code === FormCode.ANC1) {
    cy.url().should("include", "/anchor-application-received");
    cy.contains("h1", `We have your 2025 ANCHOR application on file as of ${MOCK_DATE}`).should(
      "be.visible",
    );
  }

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
  cy.contains("h1", "Track your 2025 property tax relief application and payment status");
};
