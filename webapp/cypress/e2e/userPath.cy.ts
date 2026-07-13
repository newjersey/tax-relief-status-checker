import { FaqContent } from "@/components/LandingPageFaq";

const fillField = (fieldName: string, value: string): undefined => {
  cy.get(`input[name="${fieldName}"]`).type(value);
};

const mockSSN = "123456789";
const mockZip = "00000";

const fillFields = () => {
  fillField("ssn", mockSSN);
  fillField("zipCode", mockZip);
};

beforeEach(() => {
  cy.on("window:before:load", (win) => {
    win.gtag = cy.stub().as("gtag");
  });
  cy.visit("/");
});

it("should allow the user to visit the webpage", () => {
  cy.contains("h1", "This website is checking your 2025 PAS");
});

it("should display an error message when the user tries to submit empty fields", () => {
  cy.get(`button[type="submit"]`).click();
  const ssnError = cy.get(`span[id="ssnErrorMessage"]`);
  const zipError = cy.get(`span[id="zipCodeErrorMessage"]`);
  ssnError.should("be.visible");
  ssnError.should("contain.text", "This question is required");
  zipError.should("be.visible");
  zipError.should("contain.text", "This question is required");
});

it("displays SSN error messages properly", () => {
  cy.get(`button[type="submit"]`).click();
  cy.get(`#ssnErrorMessage`).should("be.visible");
  cy.get(`#ssnErrorMessage`).should("contain.text", "This question is required");

  fillField("ssn", "1");
  cy.contains("button", `Check Status`).click();
  cy.get(`#ssnErrorMessage`).should("be.visible");
  cy.get(`#ssnErrorMessage`).should(
    "contain.text",
    "SSN or ITIN number entered must have nine digits",
  );

  fillField("ssn", "23456789");
  cy.get("#ssnErrorMessage").should("not.exist");
});

it("displays Zip Code error messages properly", () => {
  cy.get(`button[type="submit"]`).click();
  cy.get(`#zipCodeErrorMessage`).should("be.visible");
  cy.get(`#zipCodeErrorMessage`).should("contain.text", "This question is required");

  fillField("zipCode", "1");
  cy.contains("button", `Check Status`).click();
  cy.get(`#zipCodeErrorMessage`).should("be.visible");
  cy.get(`#zipCodeErrorMessage`).should("contain.text", "Zip code must have five digits");

  fillField("zipCode", "2345");
  cy.get("#zipCodeErrorMessage").should("not.exist");
});

it("should expand/collapse the accordion FAQ when clicked", () => {
  for (const faq of FaqContent) {
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

it("should display an error message when api returns a 500 error", () => {
  fillFields();
  cy.intercept("POST", "/api/status", {
    statusCode: 500,
    body: { error: "Status API is not configured." },
  });
  cy.contains("button", `Check Status`).click();
  cy.contains(
    "p",
    "We are having an issue checking on your application status. Please try again later.",
  ).should("be.visible");
  cy.get("@gtag").should("have.been.calledWith", "event", "api_error", Cypress.sinon.match.any);
  cy.window().its("scrollY").should("equal", 0); // should scroll to top so error is visible
});

it("should display an error message when api returns a 400 error", () => {
  fillFields();
  cy.intercept("POST", "/api/status", {
    statusCode: 400,
    body: { error: "Invalid request body." },
  });
  cy.contains("button", `Check Status`).click();
  cy.contains(
    "p",
    "We are having an issue checking on your application status. Please try again later.",
  ).should("be.visible");
  cy.get("@gtag").should("have.been.calledWith", "event", "api_error", Cypress.sinon.match.any);
  cy.window().its("scrollY").should("equal", 0); // should scroll to top so error is visible
});

it("should display api alert if records is empty in a 200 response", () => {
  fillFields();
  cy.intercept("POST", "/api/status", {
    statusCode: 200,
    fixture: "v1_api_empty_records.json",
  });
  cy.contains("button", `Check Status`).click();
  cy.contains("h2", "No 2025 application found").should("be.visible");
  cy.get("@gtag").should(
    "have.been.calledWith",
    "event",
    "api_200_record_not_found",
    Cypress.sinon.match.any,
  );
  cy.window().its("scrollY").should("equal", 0); // should scroll to top so error is visible
});

it("should display status page if records has an object in a 200 response", () => {
  fillFields();
  cy.fixture("v2_api_found_records.json").then((resp) => {
    resp.records[0].ptr = [];
    resp.records[0].anchor = [];
    resp.records[0].stay_nj = [];
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      body: resp,
    });
  });

  cy.contains("button", `Check Status`).click();

  cy.url().should("include", "/status");
  cy.contains("p", "Your application was received on").should("be.visible");

  cy.contains("p", "SSN/ITIN: ***-**-").should("be.visible");
  cy.contains("p", mockSSN.slice(-4)).should("be.visible");
  cy.contains("p", "Zip Code:").should("be.visible");
  cy.contains("p", mockZip).should("be.visible");
  cy.contains("p", "Tax Year: 2025").should("be.visible");

  cy.get("@gtag").should(
    "have.been.calledWith",
    "event",
    "api_200_record_found",
    Cypress.sinon.match.any,
  );

  cy.contains("a", "Log out").click();
  cy.contains("h1", "This website is checking your 2025 PAS");
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

  cy.url().should("include", "/status");
  cy.contains("p", "Your application was received on").should("be.visible");

  cy.contains("p", "SSN/ITIN: ***-**-").should("be.visible");
  cy.contains("p", mockSSN.slice(-4)).should("be.visible");
  cy.contains("p", "Zip Code:").should("be.visible");
  cy.contains("p", mockZip).should("be.visible");
  cy.contains("p", "Tax Year: 2025").should("be.visible");

  cy.get("@gtag").should(
    "have.been.calledWith",
    "event",
    "api_200_record_found",
    Cypress.sinon.match.any,
  );

  cy.contains("a", "Log out").click();
  cy.contains("h1", "This website is checking your 2025 PAS");
});

it("should display application found page if records has an object with payments sent, but feature flag is false", () => {
  fillFields();
  cy.fixture("v2_api_found_records.json").then((resp) => {
    resp.records[0].ptr[0] = { status: "processing" };
    cy.intercept("POST", "/api/status", {
      statusCode: 200,
      body: resp,
    });
  });
  cy.contains("button", `Check Status`).click();

  cy.url().should("include", "/status");
  cy.contains("p", "Your application was received on").should("be.visible");

  cy.contains("p", "SSN/ITIN: ***-**-").should("be.visible");
  cy.contains("p", mockSSN.slice(-4)).should("be.visible");
  cy.contains("p", "Zip Code:").should("be.visible");
  cy.contains("p", mockZip).should("be.visible");
  cy.contains("p", "Tax Year: 2025").should("be.visible");

  cy.get("@gtag").should(
    "have.been.calledWith",
    "event",
    "api_200_record_found",
    Cypress.sinon.match.any,
  );

  cy.contains("a", "Log out").click();
  cy.contains("h1", "This website is checking your 2025 PAS");
});
