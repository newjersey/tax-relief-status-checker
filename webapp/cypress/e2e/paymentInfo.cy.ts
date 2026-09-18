import { formatDate } from "@/app/utils/formatDate";
import payment_sent_transaction from "../fixtures/payment_sent_transaction.json";
import earlier_transaction from "../fixtures/earlier_payment_sent_transaction.json";
import { fillFields, MOCK_SSN, MOCK_ZIP } from "./utils";
import { TaxProgram } from "@/components/types";
import { FormCode } from "@/components/types";
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

const FAQAssertions = (form_code: FormCode) => {
  if (form_code === FormCode.ANC1) {
    cy.get(`div[id="faq_when_can_i_expect_to_receive_payments_pas1"]`).should("not.exist");

    cy.get(`div[id="faq_check_amount_different_than_expected_anc1"]`).should("not.be.visible");
    cy.contains(
      "button",
      "A check amount is different than what I expected. Who can I contact?",
    ).click();
    cy.get("@gtag").should(
      "have.been.calledWith",
      "event",
      `faq_check_amount_different_than_expected_anc1_opened`,
      Cypress.sinon.match.any,
    );
    cy.get(`div[id="faq_check_amount_different_than_expected_anc1"]`).should("be.visible");

    cy.get(`div[id="faq_have_not_received_check_next_steps_anc1"]`).should("not.be.visible");
    cy.contains(
      "button",
      "I have not received my check in the mail. What should I do next?",
    ).click();
    cy.get("@gtag").should(
      "have.been.calledWith",
      "event",
      `faq_have_not_received_check_next_steps_anc1_opened`,
      Cypress.sinon.match.any,
    );
    cy.get(`div[id="faq_have_not_received_check_next_steps_anc1"]`).should("be.visible");
  } else if (form_code === FormCode.PAS1) {
    cy.contains("p", "To find out when to expect payment").should("be.visible");
    cy.contains("a", "program payment table").click();
    cy.get(`div[id="faq_when_can_i_expect_to_receive_payments_pas1"]`).should("be.visible");
    cy.get("@gtag").should(
      "have.been.calledWith",
      "event",
      `faq_when_can_i_expect_to_receive_payments_pas1_opened`,
      Cypress.sinon.match.any,
    );
    cy.contains(
      "button",
      "When can I expect to receive payments for Senior Freeze, ANCHOR, and Stay NJ?",
    ).click();
    cy.get(`div[id="faq_when_can_i_expect_to_receive_payments_pas1"]`).should("not.be.visible");

    cy.get(`div[id="faq_check_amount_different_than_expected_pas1"]`).should("not.be.visible");
    cy.contains(
      "button",
      "A check amount is different than what I expected. Who can I contact?",
    ).click();
    cy.get("@gtag").should(
      "have.been.calledWith",
      "event",
      `faq_check_amount_different_than_expected_pas1_opened`,
      Cypress.sinon.match.any,
    );
    cy.get(`div[id="faq_check_amount_different_than_expected_pas1"]`).should("be.visible");

    cy.get(`div[id="faq_have_not_received_check_next_steps_pas1"]`).should("not.be.visible");
    cy.contains(
      "button",
      "I have not received my check in the mail. What should I do next?",
    ).click();
    cy.get("@gtag").should(
      "have.been.calledWith",
      "event",
      `faq_have_not_received_check_next_steps_pas1_opened`,
      Cypress.sinon.match.any,
    );
    cy.get(`div[id="faq_have_not_received_check_next_steps_pas1"]`).should("be.visible");
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
});
describe("when form_code is PAS-1", () => {
  it("displays PAS-1 payments page if records has senior freeze CHECK", () => {
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      fixture: "v2_api_found_records.json",
    });
    cy.contains("button", `Check Status`).click();
    cy.url().should("include", "/payment-info");

    paymentInfoAssertions(TaxProgram.PTR, PaymentType.CHECK, mockDate, mockAmount);
    FAQAssertions(FormCode.PAS1);
  });

  it("displays PAS-1 payments page if records has senior freeze DIRECT DEPOSIT", () => {
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
    FAQAssertions(FormCode.PAS1);
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
    paymentInfoAssertions(
      TaxProgram.PTR,
      PaymentType.DIRECT_DEPOSIT,
      mockEarlyDate,
      mockEarlyAmount,
    );
    FAQAssertions(FormCode.PAS1);
  });
  it("displays first check and update payment for PTR and ANCHOR and all regular payments for STAYNJ", () => {
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      fixture: "update_payment_records.json",
    });
    cy.contains("button", `Check Status`).click();
    cy.url().should("include", "/payment-info");
    paymentInfoAssertions(TaxProgram.PTR, PaymentType.DIRECT_DEPOSIT, "07/16/2026", 125);
    paymentInfoAssertions(TaxProgram.PTR, PaymentType.ADJUSTED, "07/17/2026", 5);
    paymentInfoAssertions(TaxProgram.ANCHOR, PaymentType.DIRECT_DEPOSIT, "09/06/2026", 1750.0);
    paymentInfoAssertions(TaxProgram.ANCHOR, PaymentType.ADJUSTED, "10/06/2026", 377.56);
    paymentInfoAssertions(TaxProgram.STAY_NJ, PaymentType.CHECK, "01/01/2027", 111);
    paymentInfoAssertions(TaxProgram.STAY_NJ, PaymentType.CHECK, "04/30/2027", 222);

    FAQAssertions(FormCode.PAS1);
  });

  it("displays PAS-1 payments page if records has stay NJ CHECK", () => {
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
    FAQAssertions(FormCode.PAS1);
  });

  it("displays PAS-1 payments page if records has stay NJ DIRECT DEPOSIT", () => {
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
    FAQAssertions(FormCode.PAS1);
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

    paymentInfoAssertions(TaxProgram.ANCHOR, PaymentType.CHECK, mockDate, mockAmount);
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

    paymentInfoAssertions(TaxProgram.ANCHOR, PaymentType.DIRECT_DEPOSIT, mockDate, mockAmount);
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

    paymentInfoAssertions(TaxProgram.ANCHOR, PaymentType.CHECK, mockDate, mockAmount);
    paymentInfoAssertions(TaxProgram.PTR, PaymentType.DIRECT_DEPOSIT, "01/01/2026", 10.0);

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

    paymentInfoAssertions(TaxProgram.ANCHOR, PaymentType.CHECK, mockDate, mockAmount);
    paymentInfoAssertions(TaxProgram.STAY_NJ, PaymentType.DIRECT_DEPOSIT, "01/01/2026", 10.0);

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

      paymentInfoAssertions(TaxProgram.ANCHOR, PaymentType.CHECK, mockDate, mockAmount);
      paymentInfoAssertions(TaxProgram.STAY_NJ, PaymentType.DIRECT_DEPOSIT, "01/01/2026", 10.0);

      FAQAssertions(FormCode.PAS1);
    });
  });
});
