import { formatDate } from "@/app/utils/formatDate";
import payment_sent_transaction from "../fixtures/payment_sent_transaction.json";
import earlier_transaction from "../fixtures/earlier_payment_sent_transaction.json";
import { fillFields, MOCK_SSN, MOCK_ZIP } from "./utils";
import { TaxProgram } from "@/components/types";
import { FormCode } from "@/components/types";
import { paymentInfoAssertions, FAQAssertions, PaymentType } from "./utils";
import { CurrentYear } from "@/components/TaxReliefDataProvider";

const mockDate = formatDate("7/6/2026 0:00:00");
const mockEarlyDate = formatDate("1/1/2026 0:00:00");
const mockAmount = 377.56;
const mockEarlyAmount = 10;

beforeEach(() => {
  cy.on("window:before:load", (win) => {
    win.gtag = cy.stub().as("gtag");
  });
  cy.visit("/");
  fillFields();
});

it("displays show payments page heading", () => {
  cy.intercept("POST", "/api/status", {
    statusCode: 200,
    fixture: "pas1_found_records.json",
  });
  cy.contains("button", `Check Status`).click();
  cy.url().should("include", "/payment-info");

  cy.contains("p", "SSN/ITIN: ***-**-").should("be.visible");
  cy.contains("p", MOCK_SSN.slice(-4)).should("be.visible");
  cy.contains("p", "ZIP Code:").should("be.visible");
  cy.contains("p", MOCK_ZIP).should("be.visible");
  cy.contains("h1", "You are eligible for benefits").should("be.visible");
});

describe("when form_code is PAS-1", () => {
  it("displays PAS-1 payments page if records has senior freeze CHECK", () => {
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      fixture: "pas1_found_records.json",
    });
    cy.contains("button", `Check Status`).click();
    cy.url().should("include", "/payment-info");

    paymentInfoAssertions(
      TaxProgram.PTR,
      PaymentType.CHECK,
      mockDate,
      mockAmount,
      CurrentYear.YEAR2025,
    );
    FAQAssertions(FormCode.PAS1);
  });

  it("displays PAS-1 payments page if records has senior freeze DIRECT DEPOSIT", () => {
    cy.fixture("pas1_found_records.json").then((resp) => {
      resp.records[0].ptr[0].payment_details.method = "direct_deposit";
      cy.intercept("POST", "/api/status", {
        statusCode: 200,
        body: resp,
      });
    });
    cy.contains("button", `Check Status`).click();
    cy.url().should("include", "/payment-info");
    paymentInfoAssertions(
      TaxProgram.PTR,
      PaymentType.DIRECT_DEPOSIT,
      mockDate,
      mockAmount,
      CurrentYear.YEAR2025,
    );
    FAQAssertions(FormCode.PAS1);
  });

  it("displays the first check sent if multiple PTR transactions are payment_sent", () => {
    cy.fixture("pas1_found_records.json").then((resp) => {
      resp.records[0].ptr[0] = payment_sent_transaction;
      resp.records[0].ptr[0].payment_details.date = "7/6/2026 0:00:00";
      resp.records[0].ptr[0] = earlier_transaction;
      cy.intercept("POST", "/api/status", {
        statusCode: 200,
        body: resp,
      });
    });
    cy.contains("button", `Check Status`).click();
    cy.url().should("include", "/payment-info");
    paymentInfoAssertions(
      TaxProgram.PTR,
      PaymentType.DIRECT_DEPOSIT,
      mockEarlyDate,
      mockEarlyAmount,
      CurrentYear.YEAR2025,
    );
    FAQAssertions(FormCode.PAS1);
  });
  it("displays first check and update payment for PTR and ANCHOR and all regular payments for STAYNJ", () => {
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      fixture: "pas1_update_payment_records.json",
    });
    cy.contains("button", `Check Status`).click();
    cy.url().should("include", "/payment-info");
    paymentInfoAssertions(
      TaxProgram.PTR,
      PaymentType.DIRECT_DEPOSIT,
      "07/16/2026",
      125,
      CurrentYear.YEAR2025,
    );
    paymentInfoAssertions(
      TaxProgram.PTR,
      PaymentType.ADJUSTED,
      "07/17/2026",
      5,
      CurrentYear.YEAR2025,
    );
    paymentInfoAssertions(
      TaxProgram.ANCHOR,
      PaymentType.DIRECT_DEPOSIT,
      "09/06/2026",
      1750.0,
      CurrentYear.YEAR2025,
    );
    paymentInfoAssertions(
      TaxProgram.ANCHOR,
      PaymentType.ADJUSTED,
      "10/06/2026",
      377.56,
      CurrentYear.YEAR2025,
    );
    paymentInfoAssertions(
      TaxProgram.STAY_NJ,
      PaymentType.CHECK,
      "01/01/2027",
      111,
      CurrentYear.YEAR2025,
    );
    paymentInfoAssertions(
      TaxProgram.STAY_NJ,
      PaymentType.CHECK,
      "04/30/2027",
      222,
      CurrentYear.YEAR2025,
    );

    FAQAssertions(FormCode.PAS1);
  });

  it("displays PAS-1 payments page if records has stay NJ CHECK", () => {
    cy.fixture("pas1_stay_record").then((resp) => {
      resp.records[0].stay_nj[1] = null;
      cy.intercept("POST", "/api/status", {
        statusCode: 200,
        body: resp,
      });
    });
    cy.contains("button", `Check Status`).click();
    cy.url().should("include", "/payment-info");
    paymentInfoAssertions(
      TaxProgram.STAY_NJ,
      PaymentType.CHECK,
      formatDate("1/2/2027 00:00:00"),
      mockAmount,
      CurrentYear.YEAR2025,
    );
    FAQAssertions(FormCode.PAS1);
  });

  it("displays PAS-1 payments page if records has stay NJ DIRECT DEPOSIT", () => {
    cy.fixture("pas1_stay_record").then((resp) => {
      resp.records[0].stay_nj[0].payment_details.method = PaymentType.DIRECT_DEPOSIT;
      resp.records[0].stay_nj[1] = null;
      cy.intercept("POST", "/api/status", {
        statusCode: 200,
        body: resp,
      });
    });
    cy.contains("button", `Check Status`).click();
    cy.url().should("include", "/payment-info");
    paymentInfoAssertions(
      TaxProgram.STAY_NJ,
      PaymentType.DIRECT_DEPOSIT,
      formatDate("1/2/2027 00:00:00"),
      mockAmount,
      CurrentYear.YEAR2025,
    );
    FAQAssertions(FormCode.PAS1);
  });

  it("displays both payments as regular if records has 2 stay NJ transaction in the same quarter", () => {
    cy.fixture("pas1_stay_record").then((resp) => {
      resp.records[0].stay_nj[0].payment_details.method = PaymentType.DIRECT_DEPOSIT;
      cy.intercept("POST", "/api/status", {
        statusCode: 200,
        body: resp,
      });
    });
    cy.contains("button", `Check Status`).click();
    cy.url().should("include", "/payment-info");
    paymentInfoAssertions(
      TaxProgram.STAY_NJ,
      PaymentType.DIRECT_DEPOSIT,
      formatDate("1/2/2027 00:00:00"),
      mockAmount,
      CurrentYear.YEAR2025,
    );
    paymentInfoAssertions(
      TaxProgram.STAY_NJ,
      PaymentType.CHECK,
      formatDate("1/6/2027 00:00:00"),
      mockAmount,
      CurrentYear.YEAR2025,
    );
    FAQAssertions(FormCode.PAS1);
  });
});

describe("when form_code is ANC-1", () => {
  it("displays ANC-1 payments page if records only has anchor CHECK", () => {
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      fixture: "anc1_found_records.json",
    });
    cy.contains("button", `Check Status`).click();
    cy.url().should("include", "/payment-info");

    paymentInfoAssertions(
      TaxProgram.ANCHOR,
      PaymentType.CHECK,
      mockDate,
      mockAmount,
      CurrentYear.YEAR2025,
    );
    FAQAssertions(FormCode.ANC1);
  });

  it("displays ANC-1 payments page if records only has anchor DIRECT DEPOSIT", () => {
    cy.fixture("anc1_found_records.json").then((resp) => {
      resp.records[0].anchor[0].payment_details.method = "direct_deposit";
      cy.intercept("POST", "/api/status", {
        statusCode: 200,
        body: resp,
      });
    });
    cy.contains("button", `Check Status`).click();
    cy.url().should("include", "/payment-info");

    paymentInfoAssertions(
      TaxProgram.ANCHOR,
      PaymentType.DIRECT_DEPOSIT,
      mockDate,
      mockAmount,
      CurrentYear.YEAR2025,
    );
    FAQAssertions(FormCode.ANC1);
  });

  it("displays PAS-1 payments page if records has anchor and ptr payments", () => {
    cy.fixture("anc1_found_records.json").then((resp) => {
      resp.records[0].ptr[0] = earlier_transaction;
      cy.intercept("POST", "/api/status", {
        statusCode: 200,
        body: resp,
      });
    });
    cy.contains("button", `Check Status`).click();
    cy.url().should("include", "/payment-info");

    paymentInfoAssertions(
      TaxProgram.ANCHOR,
      PaymentType.CHECK,
      mockDate,
      mockAmount,
      CurrentYear.YEAR2025,
    );
    paymentInfoAssertions(
      TaxProgram.PTR,
      PaymentType.DIRECT_DEPOSIT,
      "01/01/2026",
      10.0,
      CurrentYear.YEAR2025,
    );

    FAQAssertions(FormCode.PAS1);
  });

  it("displays PAS-1 payments page if records has anchor and stay payments", () => {
    cy.fixture("anc1_found_records.json").then((resp) => {
      resp.records[0].stay_nj[0] = earlier_transaction;
      cy.intercept("POST", "/api/status", {
        statusCode: 200,
        body: resp,
      });
    });
    cy.contains("button", `Check Status`).click();
    cy.url().should("include", "/payment-info");

    paymentInfoAssertions(
      TaxProgram.ANCHOR,
      PaymentType.CHECK,
      mockDate,
      mockAmount,
      CurrentYear.YEAR2025,
    );
    paymentInfoAssertions(
      TaxProgram.STAY_NJ,
      PaymentType.DIRECT_DEPOSIT,
      "01/01/2026",
      10.0,
      CurrentYear.YEAR2025,
    );

    FAQAssertions(FormCode.PAS1);
  });

  describe("when form_code is NULL", () => {
    it("displays PAS-1 payments page if records has payments", () => {
      cy.fixture("anc1_found_records.json").then((resp) => {
        resp.records[0].stay_nj[0] = earlier_transaction;
        resp.records[0].form_code = null;
        cy.intercept("POST", "/api/status", {
          statusCode: 200,
          body: resp,
        });
      });
      cy.contains("button", `Check Status`).click();
      cy.url().should("include", "/payment-info");

      paymentInfoAssertions(
        TaxProgram.ANCHOR,
        PaymentType.CHECK,
        mockDate,
        mockAmount,
        CurrentYear.YEAR2025,
      );
      paymentInfoAssertions(
        TaxProgram.STAY_NJ,
        PaymentType.DIRECT_DEPOSIT,
        "01/01/2026",
        10.0,
        CurrentYear.YEAR2025,
      );

      FAQAssertions(FormCode.PAS1);
    });
  });
});
