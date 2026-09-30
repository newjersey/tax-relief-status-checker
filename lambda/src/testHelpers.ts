export const buildMockRow = (overrides = {}) => ({
  DLN_NUM: "00000001",
  SOCIAL_SECURITY_NUMBER_IDN: "123456789",
  ZIP_ADR: "12345",
  RETURN_YEAR_DTE: "2025",
  RNY_APPLIED_DTE: new Date("10/31/2025 00:00:00"),
  TRANS_TOTAL_NUM: 1,
  TRANS_1_CDE: "RF",
  TRANS_STATUS_1_CDE: "APC",
  REVIEW_CATEGORY_1_CDE: "MDZ",
  CHECK_1_DTE: new Date("12/11/2025 00:00:00"),
  CHECK_1_AMT: 1750,
  CHECK_1_NUM: "922775385",
  TRANS_1_TAX_CDE: "13",
  FORM_CDE: "PAS1W",
  ...overrides,
});

export const buildMockTransactionValidation = (overrides = {}) => ({
  TRANS_CDE: "RF",
  TRANS_STATUS_CDE: "APC",
  TRANS_TAX_CDE: "13",
  CHECK_DTE: new Date("12/11/2025 00:00:00"),
  CHECK_AMT: 1750,
  CHECK_NUM: "922775385",
  ...overrides,
});

export const validAnchorTransaction = {
  TRANS_1_CDE: "RF",
  TRANS_STATUS_1_CDE: "APC",
  REVIEW_CATEGORY_1_CDE: "MDZ",
  CHECK_1_DTE: new Date("12/11/2025 00:00:00"),
  CHECK_1_AMT: 1750,
  CHECK_1_NUM: "111111111",
  TRANS_1_TAX_CDE: "13",
};

export const invalidPTRTransactionNoDTE = {
  TRANS_2_CDE: "RF",
  TRANS_STATUS_2_CDE: "APC",
  REVIEW_CATEGORY_2_CDE: "MDZ",
  CHECK_2_DTE: null,
  CHECK_2_AMT: 1750,
  CHECK_2_NUM: "222222222",
  TRANS_2_TAX_CDE: "49",
};

export const invalidStayTransactionNoAMT = {
  TRANS_3_CDE: "RF",
  TRANS_STATUS_3_CDE: "APC",
  REVIEW_CATEGORY_3_CDE: "MDZ",
  CHECK_3_DTE: new Date("12/11/2025 00:00:00"),
  CHECK_3_AMT: null,
  CHECK_3_NUM: "333333333",
  TRANS_3_TAX_CDE: "41",
};

export const validStayTransaction = {
  TRANS_4_CDE: "RF",
  TRANS_STATUS_4_CDE: "APC",
  REVIEW_CATEGORY_4_CDE: "MDZ",
  CHECK_4_DTE: new Date("12/11/2025 00:00:00"),
  CHECK_4_AMT: 1750,
  CHECK_4_NUM: "444444444",
  TRANS_4_TAX_CDE: "41",
};
