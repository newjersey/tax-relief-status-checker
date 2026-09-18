import { fillFields, applicationReceivedAssertions } from "./utils";
import { FormCode } from "@/components/types";

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

  applicationReceivedAssertions(FormCode.PAS1);
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

  applicationReceivedAssertions(FormCode.PAS1);
});
