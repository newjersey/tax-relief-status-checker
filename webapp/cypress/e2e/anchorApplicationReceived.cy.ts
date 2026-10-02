import { fillFields, applicationReceivedAssertions } from "./utils";
import { FormCode } from "@/components/types";

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
  applicationReceivedAssertions(FormCode.ANC1);
});
