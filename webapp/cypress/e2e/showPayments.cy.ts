import { formatDate } from "@/app/utils/formatDate";
import payment_sent_transaction from "../fixtures/payment_sent_transaction.json";
import earlier_transaction from "../fixtures/earlier_payment_sent_transaction.json";

const fillField = (fieldName: string, value: string): undefined => {
  cy.get(`input[name="${fieldName}"]`).type(value);
};

const mockSSN = "123456789";
const mockZip = "00000";
const mockDate = formatDate("7/6/2026 0:00:00");
const mockEarlyDate = formatDate("1/1/2026 0:00:00");
const mockAmount = 377.56;
const mockEarlyAmount = 10;

const fillFields = () => {
  fillField("ssn", mockSSN);
  fillField("zipCode", mockZip);
};

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
  cy.url().should("include", "/payment");

  cy.contains("p", "SSN/ITIN: ***-**-").should("be.visible");
  cy.contains("p", mockSSN.slice(-4)).should("be.visible");
  cy.contains("p", "Zip Code:").should("be.visible");
  cy.contains("p", mockZip).should("be.visible");
  cy.contains("p", "Tax Year: 2025").should("be.visible");
  cy.contains("h1", "You are eligible for benefits").should("be.visible");
  cy.contains("p", "To find out when to expect payment on all programs,").should("be.visible");

  cy.contains("a", "program payment table").click();
  cy.get(`div[id="faq_when_can_i_expect_to_receive_payments"]`).should("be.visible");
  cy.get("@gtag").should(
    "have.been.calledWith",
    "event",
    `faq_when_can_i_expect_to_receive_payments_opened`,
    Cypress.sinon.match.any,
  );
  cy.contains("button", "When can I expect to receive payments?").click();
  cy.get(`div[id="faq_when_can_i_expect_to_receive_payments"]`).should("not.be.visible");
});

it("displays payments page if records has senior freeze CHECK", () => {
  cy.intercept("POST", "/api/status", {
    statusCode: 200,
    fixture: "v2_api_found_records.json",
  });
  cy.contains("button", `Check Status`).click();
  cy.url().should("include", "/payment");

  cy.contains("th", "Program").should("be.visible");
  cy.contains("th", "Payment Status").should("be.visible");
  cy.contains("th", "Amount").should("be.visible");

  cy.contains("td", "Senior Freeze").should("be.visible");
  cy.contains("td", `Check issued on ${mockDate}`).should("be.visible");
  cy.contains("td", `$${mockAmount}`).should("be.visible");
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

  cy.url().should("include", "/payment");
  cy.contains("th", "Program").should("be.visible");
  cy.contains("th", "Payment Status").should("be.visible");
  cy.contains("th", "Amount").should("be.visible");

  cy.contains("td", "Senior Freeze").should("be.visible");
  cy.contains("td", `Direct deposit made on ${mockDate}`).should("be.visible");
  cy.contains("td", `$${mockAmount}`).should("be.visible");
});

it("displays payments page if records has anchor CHECK", () => {
  cy.fixture("v2_api_found_records.json").then((resp) => {
    resp.records[0].ptr[0] = { status: "processing" };
    resp.records[0].anchor[0] = payment_sent_transaction;
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      body: resp,
    });
  });
  cy.contains("button", `Check Status`).click();

  cy.url().should("include", "/payment");
  cy.contains("th", "Program").should("be.visible");
  cy.contains("th", "Payment Status").should("be.visible");
  cy.contains("th", "Amount").should("be.visible");

  cy.contains("td", "ANCHOR").should("be.visible");
  cy.contains("td", `Check issued on ${mockDate}`).should("be.visible");
  cy.contains("td", `$${mockAmount}`).should("be.visible");
});

it("displays payments page if records has anchor DIRECT DEPOSIT", () => {
  cy.fixture("v2_api_found_records.json").then((resp) => {
    resp.records[0].ptr[0] = { status: "processing" };
    resp.records[0].anchor[0] = payment_sent_transaction;
    resp.records[0].anchor[0].payment_details.method = "direct_deposit";
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      body: resp,
    });
  });
  cy.contains("button", `Check Status`).click();

  cy.url().should("include", "/payment");
  cy.contains("th", "Program").should("be.visible");
  cy.contains("th", "Payment Status").should("be.visible");
  cy.contains("th", "Amount").should("be.visible");

  cy.contains("td", "ANCHOR").should("be.visible");
  cy.contains("td", `Direct deposit made on ${mockDate}`).should("be.visible");
  cy.contains("td", `$${mockAmount}`).should("be.visible");
});

it("should not display stay_nj CHECK", () => {
  cy.fixture("v2_api_found_records.json").then((resp) => {
    resp.records[0].ptr[0] = { status: "processing" };
    resp.records[0].stay_nj[0] = payment_sent_transaction;
    resp.records[0].stay_nj[0].payment_details.method = "check";

    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      body: resp,
    });
  });
  cy.contains("button", `Check Status`).click();

  cy.url().should("include", "/status");
  cy.contains("p", "Your application was received on").should("be.visible");

  cy.contains("td", "Stay NJ").should("not.exist");
  cy.contains("td", `Check issued on ${mockDate}`).should("not.exist");
  cy.contains("td", `$${mockAmount}`).should("not.exist");
});

it("displays the first check sent if multiple PTR transactions are payment_sent", () => {
  cy.fixture("v2_api_found_records.json").then((resp) => {
    resp.records[0].ptr[0] = payment_sent_transaction;
    resp.records[0].ptr[0] = earlier_transaction;
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      body: resp,
    });
  });
  cy.contains("button", `Check Status`).click();

  cy.url().should("include", "/payment");
  cy.contains("th", "Program").should("be.visible");
  cy.contains("th", "Payment Status").should("be.visible");
  cy.contains("th", "Amount").should("be.visible");

  cy.contains("td", "Senior Freeze").should("be.visible");
  cy.contains("td", `Direct deposit made on ${mockEarlyDate}`).should("be.visible");
  cy.contains("td", `$${mockEarlyAmount}`).should("be.visible");
});

it("displays the first check sent if multiple ANCHOR transactions are payment_sent", () => {
  cy.fixture("v2_api_found_records.json").then((resp) => {
    resp.records[0].ptr[0] = { status: "processing" };
    resp.records[0].anchor[0] = payment_sent_transaction;
    resp.records[0].anchor[0] = earlier_transaction;
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      body: resp,
    });
  });
  cy.contains("button", `Check Status`).click();

  cy.url().should("include", "/payment");
  cy.contains("th", "Program").should("be.visible");
  cy.contains("th", "Payment Status").should("be.visible");
  cy.contains("th", "Amount").should("be.visible");

  cy.contains("td", "ANCHOR").should("be.visible");
  cy.contains("td", `Direct deposit made on ${mockEarlyDate}`).should("be.visible");
  cy.contains("td", `$${mockEarlyAmount}`).should("be.visible");
});

it("displays multiple checks from multiple payment categories", () => {
  cy.fixture("v2_api_found_records.json").then((resp) => {
    resp.records[0].anchor[0] = earlier_transaction;
    resp.records[0].stay_nj[0] = payment_sent_transaction;
    resp.records[0].stay_nj[0].payment_details.method = "check";
    resp.records[0].stay_nj[0].payment_details.amount = 33.33;
    resp.records[0].stay_nj[0].payment_details.date = "03/03/2025";
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      body: resp,
    });
  });
  cy.contains("button", `Check Status`).click();

  cy.url().should("include", "/payment");
  cy.contains("th", "Program").should("be.visible");
  cy.contains("th", "Payment Status").should("be.visible");
  cy.contains("th", "Amount").should("be.visible");

  cy.contains("td", "Senior Freeze").should("be.visible");
  cy.contains("td", `Check issued on ${mockDate}`).should("be.visible");
  cy.contains("td", `$${mockAmount}`).should("be.visible");

  cy.contains("td", "ANCHOR").should("be.visible");
  cy.contains("td", `Direct deposit made on ${mockEarlyDate}`).should("be.visible");
  cy.contains("td", `$${mockEarlyAmount}`).should("be.visible");

  cy.contains("td", "Stay NJ").should("not.exist");
  cy.contains("td", `Check issued on 03/03/2025`).should("not.exist");
  cy.contains("td", `$33.33`).should("not.exist");
});
