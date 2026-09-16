import { formatDate } from "@/app/utils/formatDate";

export const fillField = (fieldName: string, value: string): undefined => {
  cy.get(`input[name="${fieldName}"]`).type(value);
};

export const MOCK_SSN = "123456789";
export const MOCK_ZIP = "00000";
export const MOCK_DATE = formatDate("2026-03-19T00:00:00.000Z");

export const fillFields = () => {
  fillField("ssn", MOCK_SSN);
  fillField("zipCode", MOCK_ZIP);
};
