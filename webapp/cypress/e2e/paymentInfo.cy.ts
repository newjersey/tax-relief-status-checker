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
  cy.url().should("include", "/payment-info");

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
  cy.url().should("include", "/payment-info");

  cy.get(".payment-table").within(() => {
    cy.contains("th", "Program").should("be.visible");
    cy.contains("th", "Payment Status").should("be.visible");
    cy.contains("th", "Amount").should("be.visible");

    cy.contains("td", "Senior Freeze").should("be.visible");
    cy.contains("td", `Check issued on ${mockDate}`).should("be.visible");
    cy.contains("td", `$${mockAmount}`).should("be.visible");
  });
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
  cy.get(".payment-table").within(() => {
    cy.contains("th", "Program").should("be.visible");
    cy.contains("th", "Payment Status").should("be.visible");
    cy.contains("th", "Amount").should("be.visible");

    cy.contains("td", "Senior Freeze").should("be.visible");
    cy.contains("td", `Direct deposit made on ${mockDate}`).should("be.visible");
    cy.contains("td", `$${mockAmount}`).should("be.visible");
  });
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

  cy.url().should("include", "/payment-info");
  cy.get(".payment-table").within(() => {
    cy.contains("th", "Program").should("be.visible");
    cy.contains("th", "Payment Status").should("be.visible");
    cy.contains("th", "Amount").should("be.visible");

    cy.contains("td", "ANCHOR").should("be.visible");
    cy.contains("td", `Check issued on ${mockDate}`).should("be.visible");
    cy.contains("td", `$${mockAmount}`).should("be.visible");
  });
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

  cy.url().should("include", "/payment-info");
  cy.get(".payment-table").within(() => {
    cy.contains("th", "Program").should("be.visible");
    cy.contains("th", "Payment Status").should("be.visible");
    cy.contains("th", "Amount").should("be.visible");

    cy.contains("td", "ANCHOR").should("be.visible");
    cy.contains("td", `Direct deposit made on ${mockDate}`).should("be.visible");
    cy.contains("td", `$${mockAmount}`).should("be.visible");
  });
});

it("displays payments page if records has stay_nj CHECK", () => {
  cy.fixture("v2_api_found_records.json").then((resp) => {
    resp.records[0].ptr[0] = { status: "processing" };
    resp.records[0].stay_nj[0] = payment_sent_transaction;
    resp.records[0].stay_nj[0].payment_details.date = "1/05/2027 0:00:00";
    resp.records[0].stay_nj[0].payment_details.method = "check";

    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      body: resp,
    });
  });
  cy.contains("button", `Check Status`).click();

  cy.url().should("include", "/payment-info");
  cy.contains("th", "Program").should("be.visible");
  cy.contains("th", "Payment Status").should("be.visible");
  cy.contains("th", "Amount").should("be.visible");

  cy.contains("td", "Stay NJ").should("be.visible");
  cy.contains("td", `Check issued on 01/05/2027`).should("be.visible");
  cy.contains("td", `$${mockAmount}`).should("be.visible");
});

it("displays payments page if records has stay_nj DIRECT DEPOSIT", () => {
  cy.fixture("v2_api_found_records.json").then((resp) => {
    resp.records[0].ptr[0] = { status: "processing" };
    resp.records[0].stay_nj[0] = payment_sent_transaction;
    resp.records[0].stay_nj[0].payment_details.date = "1/05/2027 0:00:00";
    resp.records[0].stay_nj[0].payment_details.method = "direct_deposit";

    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      body: resp,
    });
  });
  cy.contains("button", `Check Status`).click();

  cy.url().should("include", "/payment-info");
  cy.contains("th", "Program").should("be.visible");
  cy.contains("th", "Payment Status").should("be.visible");
  cy.contains("th", "Amount").should("be.visible");

  cy.contains("td", "Stay NJ").should("be.visible");
  cy.contains("td", `Direct deposit made on 01/05/2027`).should("be.visible");
  cy.contains("td", `$${mockAmount}`).should("be.visible");
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
  cy.get(".payment-table").within(() => {
    cy.contains("th", "Program").should("be.visible");
    cy.contains("th", "Payment Status").should("be.visible");
    cy.contains("th", "Amount").should("be.visible");

    cy.contains("td", "Senior Freeze").should("be.visible");
    cy.contains("td", `Direct deposit made on ${mockEarlyDate}`).should("be.visible");
    cy.contains("td", `$${mockEarlyAmount}`).should("be.visible");
  });
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

  cy.url().should("include", "/payment-info");
  cy.get(".payment-table").within(() => {
    cy.contains("th", "Program").should("be.visible");
    cy.contains("th", "Payment Status").should("be.visible");
    cy.contains("th", "Amount").should("be.visible");

    cy.contains("td", "ANCHOR").should("be.visible");
    cy.contains("td", `Direct deposit made on ${mockEarlyDate}`).should("be.visible");
    cy.contains("td", `$${mockEarlyAmount}`).should("be.visible");
  });
});

it("displays first check and update payment across every payment category and quarter", () => {
  cy.intercept("POST", "/api/status", {
    statusCode: 200,
    fixture: "update_payment_records.json",
  });
  cy.contains("button", `Check Status`).click();
  cy.url().should("include", "/payment-info");
  cy.get(".payment-table").within(() => {
    cy.contains("th", "Program").should("be.visible");
    cy.contains("th", "Payment Status").should("be.visible");
    cy.contains("th", "Amount").should("be.visible");

    cy.get('td:contains("Senior Freeze")').should("have.length", 2);
    cy.contains("td", `Direct deposit made on 07/16/2026`).should("be.visible");
    cy.contains("td", `$125`).should("be.visible");
    cy.contains("td", `Your benefit amount was adjusted. A check was sent on 07/17/2026`).should(
      "be.visible",
    );
    cy.contains("td", `$5`).should("be.visible");

    cy.get('td:contains("ANCHOR")').should("have.length", 2);
    cy.contains("td", `Direct deposit made on 09/06/2026`).should("be.visible");
    cy.contains("td", `$377.56`).should("be.visible");
    cy.contains("td", `Your benefit amount was adjusted. A check was sent on 10/06/2026`).should(
      "be.visible",
    );
    cy.contains("td", `$1750`).should("be.visible");

    cy.get('td:contains("Stay NJ")').should("have.length", 8);
    cy.contains("td", `Check issued on 01/01/2027`).should("be.visible");
    cy.contains("td", `$111`).should("be.visible");
    cy.contains("td", `Your benefit amount was adjusted. A check was sent on 04/30/2027`).should(
      "be.visible",
    );
    cy.contains("td", `$222`).should("be.visible");
    cy.contains("td", `Check issued on 05/01/2027`).should("be.visible");
    cy.contains("td", `$333`).should("be.visible");
    cy.contains("td", `Your benefit amount was adjusted. A check was sent on 07/31/2027`).should(
      "be.visible",
    );
    cy.contains("td", `$444`).should("be.visible");
    cy.contains("td", `Check issued on 08/01/2027`).should("be.visible");
    cy.contains("td", `$555`).should("be.visible");
    cy.contains("td", `Your benefit amount was adjusted. A check was sent on 10/31/2027`).should(
      "be.visible",
    );
    cy.contains("td", `$666`).should("be.visible");
    cy.contains("td", `Check issued on 11/01/2027`).should("be.visible");
    cy.contains("td", `$777`).should("be.visible");
    cy.contains("td", `Your benefit amount was adjusted. A check was sent on 12/31/2027`).should(
      "be.visible",
    );
    cy.contains("td", `$888`).should("be.visible");
  });
});
