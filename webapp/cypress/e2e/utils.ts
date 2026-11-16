import { formatDate } from "@/app/utils/formatDate";
import { CurrentYear } from "@/components/TaxReliefDataProvider";
import { FormCode, TaxProgram } from "@/components/types";

export const fillField = (fieldName: string, value: string): undefined => {
  cy.get(`input[name="${fieldName}"]`).type(value);
};

export const MOCK_SSN = "123456789";
export const MOCK_ZIP = "00000";
export const MOCK_DATE = formatDate("2026-03-19T00:00:00.000Z");
export const MOCK_AMOUNT = 377.56;
export const MOBILE_NAV_MAX_WIDTH = 1023.75;

export enum PaymentType {
  ADJUSTED = "adjusted",
  DIRECT_DEPOSIT = "direct_deposit",
  CHECK = "check",
}

export const fillFields = () => {
  fillField("ssn", MOCK_SSN);
  fillField("zipCode", MOCK_ZIP);
};

export const paymentInfoAssertions = (
  taxProgram: TaxProgram,
  paymentType: PaymentType,
  date: string,
  amount: number,
  currentYear: CurrentYear,
) => {
  if (currentYear === CurrentYear.YEAR2024) {
    cy.contains("h1", "You are eligible for benefits for the 2024 Tax Year").should("be.visible");
  }
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

export const FAQAssertions = (form_code: FormCode) => {
  if (form_code === FormCode.ANC1) {
    cy.get(`div[id="faq_when_can_i_expect_to_receive_payments_pas1"]`).should("not.exist");
  } else if (form_code === FormCode.PAS1) {
    cy.contains("p", "Even though PAS-1 combines all three programs").should("be.visible");
    cy.contains(
      "button",
      "When can I expect to receive payments for Senior Freeze, ANCHOR, and Stay NJ?",
    ).should("be.visible");
  }
  cy.contains(
    "button",
    "A check amount is different than what I expected. Who can I contact?",
  ).should("be.visible");
  cy.contains("button", "I have not received my check in the mail. What should I do next?").should(
    "be.visible",
  );
};

export const applicationReceivedAssertions = (form_code: FormCode, currentYear: CurrentYear) => {
  if (currentYear === CurrentYear.YEAR2024) {
    cy.url().should("include", "/application-received");
    cy.contains(
      "h1",
      `We have your application on file as of ${MOCK_DATE} for the 2024 Tax Year`,
    ).should("be.visible");
    cy.contains("p", "Your 2024 application is being processed.");
  } else if (form_code === FormCode.PAS1 || form_code === null) {
    cy.url().should("include", "/application-received");
    cy.contains(
      "h1",
      `We received your PAS-1 application on ${MOCK_DATE} for the 2025 Tax Year`,
    ).should("be.visible");
  } else if (form_code === FormCode.ANC1) {
    cy.url().should("include", "/anchor-application-received");
    cy.contains(
      "h1",
      `We have your ANCHOR application on file as of ${MOCK_DATE} for the 2025 Tax Year`,
    ).should("be.visible");
  }

  cy.contains("p", "SSN/ITIN: ***-**-").should("be.visible");
  cy.contains("p", MOCK_SSN.slice(-4)).should("be.visible");
  cy.contains("p", "ZIP Code:").should("be.visible");
  cy.contains("p", MOCK_ZIP).should("be.visible");

  cy.get("@gtag").should(
    "have.been.calledWith",
    "event",
    "api_200_record_found",
    Cypress.sinon.match.any,
  );
};

export const moreInformationNeededAssertions = (currentYear: CurrentYear) => {
  cy.url().should("include", "/more-information-needed");
  cy.contains(
    "h1",
    `Your application was received on ${MOCK_DATE} for the ${currentYear} Tax Year`,
  ).should("be.visible");

  cy.contains("p", "SSN/ITIN: ***-**-").should("be.visible");
  cy.contains("p", MOCK_SSN.slice(-4)).should("be.visible");
  cy.contains("p", "ZIP Code:").should("be.visible");
  cy.contains("p", MOCK_ZIP).should("be.visible");

  cy.get("@gtag").should(
    "have.been.calledWith",
    "event",
    "api_200_record_found",
    Cypress.sinon.match.any,
  );
};

export const switchTaxYears = (currentYear: CurrentYear) => {
  if (currentYear === CurrentYear.YEAR2025) {
    cy.window().then((win) => {
      if (win.innerWidth < MOBILE_NAV_MAX_WIDTH) {
        cy.get(".usa-menu-btn").click();
      }
    });
    cy.contains("button", `Prior Tax Years`).click();
    cy.contains("a", "2024").click();
    cy.get(".usa-nav__close").click();
  }
  if (currentYear === CurrentYear.YEAR2024) {
    cy.window().then((win) => {
      if (win.innerWidth < MOBILE_NAV_MAX_WIDTH) {
        cy.get(".usa-menu-btn").click();
      }
    });
    cy.contains("span", "2025").click();
    cy.get(".usa-nav__close").click();
  }
};

export const singleYearHeaderAssertions = (currentYear: CurrentYear) => {
  if (currentYear === CurrentYear.YEAR2025) {
    cy.window().then((win) => {
      if (win.innerWidth < MOBILE_NAV_MAX_WIDTH) {
        cy.get(".usa-menu-btn").click();
      }
    });
    cy.contains("a", "2025").should("be.visible");
    cy.contains("button", `Prior Tax Years`).should("not.exist");
    cy.contains("a", "2024").should("not.exist");
    cy.get(".usa-nav__close").click();
  }
  if (currentYear === CurrentYear.YEAR2024) {
    cy.window().then((win) => {
      if (win.innerWidth < MOBILE_NAV_MAX_WIDTH) {
        cy.get(".usa-menu-btn").click();
      }
    });
    cy.contains("a", "2024").should("be.visible");
    cy.contains("a", "2025").should("not.exist");
    cy.contains("button", `Prior Tax Years`).should("not.exist");
    cy.get(".usa-nav__close").click();
  }
};

export const logoutAssertions = () => {
  cy.window().then((win) => {
    if (win.innerWidth < 1024) {
      cy.get(".usa-menu-btn").click();
    }
  });

  cy.contains("a", "Log out").click();
  cy.contains("h1", "Track your 2025 property tax relief application and payment status");
};

export const paymentInfoRecord = {
  return_year: "2025",
  application_date: "2026-03-19T00:00:00.000Z",
  form_code: "PAS-1",
  anchor: [
    {
      status: "payment_sent",
      payment_details: {
        amount: 377.56,
        date: "7/6/2026 0:00:00",
        method: "check",
        check_number: "922775385",
      },
    },
  ],
  ptr: [],
  stay_nj: [],
};

export const applicationFoundRecord = {
  return_year: "2025",
  application_date: "2026-03-19T00:00:00.000Z",
  form_code: "PAS-1",
  anchor: [],
  ptr: [],
  stay_nj: [],
};

export const moreInfoNeededRecord = {
  return_year: "2025",
  application_date: "2026-03-19T00:00:00.000Z",
  form_code: "PAS-1",
  anchor: [
    {
      status: "issue_flagged",
      review_category: "MOD",
    },
  ],
  ptr: [
    {
      status: "issue_flagged",
      review_category: "SVR",
    },
  ],
  stay_nj: [],
};
