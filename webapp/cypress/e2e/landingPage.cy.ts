import { FaqContent } from "@/components/LandingPageFaq";

const fillField = (fieldName: string, value: string): undefined => {
  cy.get(`input[name="${fieldName}"]`).type(value);
};

const runAccordionTests = (questionText: string, answerID: string): undefined => {
  cy.contains("button", questionText).click();
  cy.get(`div[id="${answerID}"]`).should("be.visible");
};

const mockSSN = "123456789";
const mockZip = "00000";

const fillAndSubmit = () => {
  cy.visit("/");
  fillField("ssn", mockSSN);
  fillField("zipCode", mockZip);
};

it("should allow the user to visit the webpage", () => {
  cy.visit("/");
  cy.window().its("scrollY").should("equal", 0); // The page view should be at the top
});

it("should display an error message when the user tries to submit empty fields", () => {
  cy.visit("/");
  cy.get(`button[type="submit"]`).click();
  const ssnError = cy.get(`span[id="ssnErrorMessage"]`);
  const zipError = cy.get(`span[id="zipCodeErrorMessage"]`);
  ssnError.should("be.visible");
  ssnError.should("contain.text", "This question is required");
  zipError.should("be.visible");
  zipError.should("contain.text", "This question is required");
});

it("should display an error message when the user enters malformatted SSN", () => {
  cy.visit("/");
  fillField("ssn", "1");
  cy.get(`button[type="submit"]`).click();
  const ssnError = cy.get(`span[id="ssnErrorMessage"]`);
  ssnError.should("be.visible");
  ssnError.should("contain.text", "SSN or ITIN number entered must have nine digits");
});

it("should display an error message when the user enters malformatted Zip", () => {
  cy.visit("/");
  fillField("zipCode", "1");
  cy.get(`button[type="submit"]`).click();
  const zipError = cy.get(`span[id="zipCodeErrorMessage"]`);
  zipError.should("be.visible");
  zipError.should("contain.text", "Zip code must have five digits");
});

it("should expand the accordion FAQ when clicked", () => {
  cy.visit("/");
  for (const faq of FaqContent) {
    runAccordionTests(faq.title as string, faq.id);
  }
});

it("should an error message when api returns a 500 error", () => {
  fillAndSubmit();
  cy.intercept("POST", "/api/status", {
    statusCode: 500,
    body: { error: "Status API is not configured." },
  });
  cy.get(`button[type="submit"]`).click();
  cy.contains(
    "p",
    "We are having an issue checking on your application status. Please try again later.",
  ).should("be.visible");
});

it("should display an error message when api returns a 400 error", () => {
  fillAndSubmit();
  cy.intercept("POST", "/api/status", {
    statusCode: 400,
    body: { error: "Invalid request body." },
  });
  cy.get(`button[type="submit"]`).click();
  cy.contains(
    "p",
    "We are having an issue checking on your application status. Please try again later.",
  ).should("be.visible");
});

it("should display api alert if records is empty in a 200 response", () => {
  fillAndSubmit();
  cy.intercept("POST", "/api/status", {
    statusCode: 200,
    body: { records: [] },
  });
  cy.get(`button[type="submit"]`).click();
  cy.contains("h2", "No 2025 application found").should("be.visible");
});

it("should display status page if records has an object in a 200 response", () => {
  fillAndSubmit();
  cy.intercept("POST", "/api/status", {
    statusCode: 200,
    body: { records: [{ return_year: "2025", application_date: "2026-03-19T00:00:00.000Z" }] },
  });
  cy.get(`button[type="submit"]`).click();

  //assert we get to the right page
  cy.url().should("include", "/status");
  cy.contains("p", "Your application was received on").should("be.visible");

  //assert status page has expected info
  cy.contains("p", "SSN/ITIN: ***-**-").should("be.visible");
  cy.contains("p", mockSSN.slice(-4)).should("be.visible");
  cy.contains("p", "Zip Code:").should("be.visible");
  cy.contains("p", mockZip).should("be.visible");
  cy.contains("p", "Tax Year: 2025").should("be.visible");

  //assert logout button takes back to landing page
  cy.contains("Log out").click();
  cy.contains("h1", "This website is checking your 2025 PAS");
});
