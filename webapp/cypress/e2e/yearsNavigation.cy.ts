import { FormCode, TaxProgram } from "@/components/types";
import {
  applicationReceivedAssertions,
  fillFields,
  switchTaxYears,
  logoutAssertions,
  singleYearHeaderAssertions,
  paymentInfoRecord,
  paymentInfoAssertions,
  PaymentType,
  MOCK_AMOUNT,
  moreInfoNeededRecord,
  moreInformationNeededAssertions,
} from "./utils";
import { CurrentYear } from "@/components/TaxReliefDataProvider";
import { formatDate } from "@/app/utils/formatDate";

beforeEach(() => {
  cy.on("window:before:load", (win) => {
    win.gtag = cy.stub().as("gtag");
  });
  cy.visit("/");
});

it("should display 2025 application received and switch to 2024 application received on button click", () => {
  fillFields();
  cy.fixture("multi_year_records.json").then((resp) => {
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      body: resp,
    });
  });
  cy.contains("button", `Check Status`).click();

  applicationReceivedAssertions(FormCode.PAS1, CurrentYear.YEAR2025);
  switchTaxYears(CurrentYear.YEAR2025);
  applicationReceivedAssertions(FormCode.PAS1, CurrentYear.YEAR2024);
  logoutAssertions();
});

it("should display 2024 payment info and no years selector", () => {
  fillFields();
  cy.fixture("no_trans_records_2024.json").then((resp) => {
    resp.records[0] = paymentInfoRecord;
    resp.records[0].return_year = "2024";
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      body: resp,
    });
  });
  cy.contains("button", `Check Status`).click();

  paymentInfoAssertions(
    TaxProgram.ANCHOR,
    PaymentType.CHECK,
    formatDate("7/6/2026"),
    MOCK_AMOUNT,
    CurrentYear.YEAR2024,
  );
  singleYearHeaderAssertions(CurrentYear.YEAR2024);
  logoutAssertions();
});

it("should display 2025 more info needed and switch to 2024 payment info", () => {
  fillFields();
  cy.fixture("multi_year_records.json").then((resp) => {
    resp.records[0] = moreInfoNeededRecord;
    resp.records[0].return_year = "2025";

    resp.records[1] = paymentInfoRecord;
    resp.records[1].return_year = "2024";

    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      body: resp,
    });
  });
  cy.contains("button", `Check Status`).click();

  moreInformationNeededAssertions(CurrentYear.YEAR2025);
  switchTaxYears(CurrentYear.YEAR2025);
  paymentInfoAssertions(
    TaxProgram.ANCHOR,
    PaymentType.CHECK,
    formatDate("7/6/2026"),
    MOCK_AMOUNT,
    CurrentYear.YEAR2024,
  );
  logoutAssertions();
});
