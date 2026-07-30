export const fillField = (fieldName: string, value: string): undefined => {
  cy.get(`input[name="${fieldName}"]`).type(value);
};

export const MOCK_SSN = "123456789";
export const MOCK_ZIP = "00000";

export const fillFields = () => {
  fillField("ssn", MOCK_SSN);
  fillField("zipCode", MOCK_ZIP);
};
