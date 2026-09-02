import { formatDate } from "@/app/utils/formatDate";
import payment_sent_transaction from "../fixtures/payment_sent_transaction.json";
import earlier_transaction from "../fixtures/earlier_payment_sent_transaction.json";
import { fillFields, MOCK_SSN, MOCK_ZIP } from "./utils";
import { TaxProgram } from "@/components/types";

enum PaymentType {
  ADJUSTED = "adjusted",
  DIRECT_DEPOSIT = "direct_deposit",
  CHECK = "check",
}

const paymentInfoAssertions = (
  taxProgram: TaxProgram,
  paymentType: PaymentType,
  date: string,
  amount: number,
) => {
  if (paymentType === PaymentType.CHECK) {
    cy.get(".payment-table").within(() => {
      cy.contains("th", "Program").should("be.visible");
      cy.contains("th", "Payment Status").should("be.visible");
      cy.contains("th", "Amount").should("be.visible");

      cy.contains("td", taxProgram).should("be.visible");
      cy.contains("td", `Check issued on ${date}`).should("be.visible");
      cy.contains("td", `$${amount}`).should("be.visible");
    });
  } else if (paymentType === PaymentType.DIRECT_DEPOSIT) {
    cy.get(".payment-table").within(() => {
      cy.contains("th", "Program").should("be.visible");
      cy.contains("th", "Payment Status").should("be.visible");
      cy.contains("th", "Amount").should("be.visible");

      cy.contains("td", taxProgram).should("be.visible");
      cy.contains("td", `Direct deposit made on ${date}`).should("be.visible");
      cy.contains("td", `$${amount}`).should("be.visible");
    });
  } else if (paymentType === PaymentType.ADJUSTED) {
    cy.get(".payment-table").within(() => {
      cy.contains("td", taxProgram).should("be.visible");
      cy.contains("td", `Your benefit amount was adjusted. A check was sent on ${date}`).should(
        "be.visible",
      );
      cy.contains("td", `$${amount}`).should("be.visible");
    });
  }
};

const mockDate = formatDate("7/6/2026 0:00:00");
const mockEarlyDate = formatDate("1/1/2026 0:00:00");
const mockAmount = 377.56;
const mockEarlyAmount = 10;

beforeEach(() => {
  cy.on("window:before:load", (win) => {
    win.gtag = cy.stub().as("gtag");
  });
  cy.visit("/");
  cy.intercept("POST", "/api/autofile", {
    statusCode: 200,
    fixture: "autofile_api_not_planned.json",
  });
  fillFields();
});

it("displays show payments page heading", () => {
  cy.intercept("POST", "/api/status", {
    statusCode: 200,
    fixture: "v2_api_found_records.json",
  });
  cy.contains("button", `Check Status`).click();
  cy.url().should("include", "/payment-info");

  cy.contains("p", "SSN/ITIN: ***-**-").should("be.visible");
  cy.contains("p", MOCK_SSN.slice(-4)).should("be.visible");
  cy.contains("p", "ZIP Code:").should("be.visible");
  cy.contains("p", MOCK_ZIP).should("be.visible");
  cy.contains("p", "Tax Year: 2025").should("be.visible");
  cy.contains("h1", "You are eligible for benefits").should("be.visible");
  cy.contains("p", "To find out when to expect payment").should("be.visible");

  cy.contains("a", "program payment table").click();
  cy.get(`div[id="faq_when_can_i_expect_to_receive_payments"]`).should("be.visible");
  cy.get("@gtag").should(
    "have.been.calledWith",
    "event",
    `faq_when_can_i_expect_to_receive_payments_opened`,
    Cypress.sinon.match.any,
  );
  cy.contains(
    "button",
    "When can I expect to receive payments for Senior Freeze, ANCHOR, and Stay NJ?",
  ).click();
  cy.get(`div[id="faq_when_can_i_expect_to_receive_payments"]`).should("not.be.visible");
});

it("displays payments page if records has senior freeze CHECK", () => {
  cy.intercept("POST", "/api/status", {
    statusCode: 200,
    fixture: "v2_api_found_records.json",
  });
  cy.contains("button", `Check Status`).click();
  cy.url().should("include", "/payment-info");

  paymentInfoAssertions(TaxProgram.PTR, PaymentType.CHECK, mockDate, mockAmount);
});

it("displays payments page if records has senior freeze DIRECT DEPOSIT", () => {
  cy.fixture("v2_api_found_records.json").then((resp) => {
    resp.records[0].ptr[0].payment_details.method = "direct_deposit";
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      body: resp,
    });
  });
  cy.contains("button", `Check Status`).click();
  cy.url().should("include", "/payment-info");
  paymentInfoAssertions(TaxProgram.PTR, PaymentType.DIRECT_DEPOSIT, mockDate, mockAmount);
});

it("displays the first check sent if multiple PTR transactions are payment_sent", () => {
  cy.fixture("v2_api_found_records.json").then((resp) => {
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
  paymentInfoAssertions(TaxProgram.PTR, PaymentType.DIRECT_DEPOSIT, mockEarlyDate, mockEarlyAmount);
});

it("displays first check and update payment for PTR but not for ANCHOR or STAYNJ", () => {
  cy.intercept("POST", "/api/status", {
    statusCode: 200,
    fixture: "update_payment_records.json",
  });
  cy.contains("button", `Check Status`).click();
  cy.url().should("include", "/payment-info");
  paymentInfoAssertions(TaxProgram.PTR, PaymentType.DIRECT_DEPOSIT, "07/16/2026", 125);
  paymentInfoAssertions(TaxProgram.PTR, PaymentType.ADJUSTED, "07/17/2026", 5);

  cy.contains("td", TaxProgram.ANCHOR).should("not.exist");
  cy.contains("td", "Direct deposit issued on 09/06/2026").should("not.exist");
  cy.contains("td", "1750.00").should("not.exist");

  cy.contains("td", TaxProgram.ANCHOR).should("not.exist");
  cy.contains("td", `Your benefit amount was adjusted. A check was sent on 10/6/2026`).should(
    "not.exist",
  );
  cy.contains("td", `377.56`).should("not.exist");
});

it("displays payments page if records has stay NJ CHECK", () => {
  cy.fixture("stay_record").then((resp) => {
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
  );
});

it("displays payments page if records has stay NJ DIRECT DEPOSIT", () => {
  cy.fixture("stay_record").then((resp) => {
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
  );
});

it("displays both payments as regular if records has 2 stay NJ transaction in the same quarter", () => {
  cy.fixture("stay_record").then((resp) => {
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
  );
  paymentInfoAssertions(
    TaxProgram.STAY_NJ,
    PaymentType.CHECK,
    formatDate("1/6/2027 00:00:00"),
    mockAmount,
  );
});
