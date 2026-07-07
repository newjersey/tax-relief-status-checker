const fillField = (fieldName: string, value: string): undefined => {
  cy.get(`input[name="${fieldName}"]`).type(value);
};

const mockSSN = "123456789";
const mockZip = "00000";
const mockDate = "7/06/26";
const mockAmount = 377.56;

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
  cy.intercept("POST", "/api/status", {
    statusCode: 200,
    fixture: "v2_api_found_records.json",
  });
  cy.contains("button", `Check Status`).click();

  cy.url().should("include", "/status");
  cy.contains("p", "Your application was received on").should("be.visible");

  cy.contains("p", "SSN/ITIN: ***-**-").should("be.visible");
  cy.contains("p", mockSSN.slice(-4)).should("be.visible");
  cy.contains("p", "Zip Code:").should("be.visible");
  cy.contains("p", mockZip).should("be.visible");
  cy.contains("p", "Tax Year: 2025").should("be.visible");
});

it("should display show payments page heading", () => {
  cy.contains("h1", "You are eligible for benefits").should("be.visible");
  cy.contains("p", "To find out when to expect payment on all programs,").should("be.visible");

  //TODO: Assert that link click opens new tab to "when can I expect payments"
  cy.contains("a", "program payment table").click();
});

it("should display payments page if records has senior freeze payment", () => {
  cy.contains("th", "Program").should("be.visible");
  cy.contains("th", "Payment Status").should("be.visible");
  cy.contains("th", "Amount").should("be.visible");

  cy.contains("td", "Senior Freeze").should("be.visible");
  cy.contains("td", `Check sent on ${mockDate}`).should("be.visible");
  cy.contains("td", `$${mockAmount}`).should("be.visible");
});
