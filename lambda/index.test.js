const { handler } = require("./index");

const mockExecute = jest.fn();
const mockClose = jest.fn();

jest.mock("@aws-sdk/client-secrets-manager", () => {
  const mockSend = jest.fn().mockResolvedValue({
    SecretString: JSON.stringify({
      ORACLE_DB_USER: "testuser",
      ORACLE_DB_PASSWORD: "testpass",
    }),
  });

  return {
    SecretsManagerClient: jest.fn(() => ({ send: mockSend })),
    GetSecretValueCommand: jest.fn(),
  };
});

jest.mock("oracledb", () => ({
  getConnection: jest.fn(() =>
    Promise.resolve({
      execute: mockExecute,
      close: mockClose,
    }),
  ),
  OUT_FORMAT_OBJECT: 4001,
}));

const buildMockRow = (overrides = {}) => ({
  SOCIAL_SECURITY_NUMBER_IDN: "123456789",
  ZIP_ADR: "07656",
  OWNER_NME: "JOE DOE",
  STREET_1_ADR: "123 TEST AVE",
  CITY_ADR: "PARK RIDGE",
  STATE_ADR: "NJ",
  RETURN_YEAR_DTE: 2024,
  TRANS_1_CDE: "RF",
  TRANS_STATUS_1_CDE: "APC",
  REVIEW_CATEGORY_1_CDE: "MDZ",
  CHECK_1_DTE: "12/11/2025 00:00:00",
  CHECK_1_AMT: 1750,
  CHECK_1_NUM: 922775385,
  TRANS_1_TAX_CDE: "13",
  TRANS_2_CDE: null,
  TRANS_STATUS_2_CDE: null,
  REVIEW_CATEGORY_2_CDE: null,
  CHECK_2_DTE: null,
  CHECK_2_AMT: null,
  CHECK_2_NUM: null,
  TRANS_2_TAX_CDE: null,
  TRANS_3_CDE: null,
  TRANS_STATUS_3_CDE: null,
  REVIEW_CATEGORY_3_CDE: null,
  CHECK_3_DTE: null,
  CHECK_3_AMT: null,
  CHECK_3_NUM: null,
  TRANS_3_TAX_CDE: null,
  TRANS_4_CDE: null,
  TRANS_STATUS_4_CDE: null,
  REVIEW_CATEGORY_4_CDE: null,
  CHECK_4_DTE: null,
  CHECK_4_AMT: null,
  CHECK_4_NUM: null,
  TRANS_4_TAX_CDE: null,
  TRANS_5_CDE: null,
  TRANS_STATUS_5_CDE: null,
  REVIEW_CATEGORY_5_CDE: null,
  CHECK_5_DTE: null,
  CHECK_5_AMT: null,
  CHECK_5_NUM: null,
  TRANS_5_TAX_CDE: null,
  TRANS_6_CDE: null,
  TRANS_STATUS_6_CDE: null,
  REVIEW_CATEGORY_6_CDE: null,
  CHECK_6_DTE: null,
  CHECK_6_AMT: null,
  CHECK_6_NUM: null,
  TRANS_6_TAX_CDE: null,
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
  process.env.DB_CREDS_SECRET_NAME = "MOCK_SECRET";
  process.env.CONNECT_STRING = "MOCK_CONNECT_STRING";
});

describe("handler input validation", () => {
  it("returns 400 when ssn is missing", async () => {
    const result = await handler({ zip: "07656" });

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toBe("Both ssn and zip are required");
  });

  it("returns 400 when zip is missing", async () => {
    const result = await handler({ ssn: "123456789" });

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toBe("Both ssn and zip are required");
  });

  it("returns 400 for invalid SSN (not 9 digits)", async () => {
    const result = await handler({ ssn: "12345", zip: "07656" });

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toBe("SSN must be 9 digits");
  });

  it("returns 400 for invalid ZIP (not 5 digits)", async () => {
    const result = await handler({ ssn: "123456789", zip: "123" });

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toBe("ZIP must be 5 digits");
  });

  it("accepts SSN with hyphens and strips them", async () => {
    mockExecute.mockResolvedValue({ rows: [] });

    const result = await handler({ ssn: "123-45-6789", zip: "07656" });

    expect(result.statusCode).toBe(200);
  });

  it("handles API Gateway proxy format with stringified body", async () => {
    mockExecute.mockResolvedValue({ rows: [] });

    const result = await handler({
      body: JSON.stringify({ ssn: "123456789", zip: "07656" }),
    });

    expect(result.statusCode).toBe(200);
  });
});

describe("handler with no matching rows", () => {
  it("returns 200 with empty filer object when no rows match", async () => {
    mockExecute.mockResolvedValue({ rows: [] });

    const result = await handler({ ssn: "123456789", zip: "07656" });

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.filer).toEqual({});
  });
});

describe("handler transaction categorization", () => {
  it("categorizes tax code 13 as anchor", async () => {
    const row = buildMockRow({ TRANS_1_TAX_CDE: "13" });
    mockExecute.mockResolvedValue({ rows: [row] });

    const result = await handler({ ssn: "123456789", zip: "07656" });
    const body = JSON.parse(result.body);

    expect(body["2024"].anchor).toHaveLength(1);
    expect(body["2024"].ptr).toHaveLength(0);
    expect(body["2024"].stayNj).toHaveLength(0);
    expect(body["2024"].anchor[0].TransCode).toBe("RF");
    expect(body["2024"].anchor[0].StatusCode).toBe("APC");
    expect(body["2024"].anchor[0].ReviewCategory).toBe("MDZ");
    expect(body["2024"].anchor[0].checkDate).toBe("12/11/2025 00:00:00");
    expect(body["2024"].anchor[0].checkAmount).toBe(1750);
    expect(body["2024"].anchor[0].checkNumber).toBe(922775385);
  });

  it("categorizes tax code 49 as ptr", async () => {
    const row = buildMockRow({ TRANS_1_TAX_CDE: "49" });
    mockExecute.mockResolvedValue({ rows: [row] });

    const result = await handler({ ssn: "123456789", zip: "07656" });
    const body = JSON.parse(result.body);

    expect(body["2024"].ptr).toHaveLength(1);
    expect(body["2024"].anchor).toHaveLength(0);
    expect(body["2024"].stayNj).toHaveLength(0);
    expect(body["2024"].ptr[0].TransCode).toBe("RF");
    expect(body["2024"].ptr[0].StatusCode).toBe("APC");
    expect(body["2024"].ptr[0].ReviewCategory).toBe("MDZ");
    expect(body["2024"].ptr[0].checkDate).toBe("12/11/2025 00:00:00");
    expect(body["2024"].ptr[0].checkAmount).toBe(1750);
    expect(body["2024"].ptr[0].checkNumber).toBe(922775385);
  });

  it("categorizes tax code 41 as stayNj", async () => {
    const row = buildMockRow({ TRANS_1_TAX_CDE: "41" });
    mockExecute.mockResolvedValue({ rows: [row] });

    const result = await handler({ ssn: "123456789", zip: "07656" });
    const body = JSON.parse(result.body);

    expect(body["2024"].stayNj).toHaveLength(1);
    expect(body["2024"].anchor).toHaveLength(0);
    expect(body["2024"].ptr).toHaveLength(0);
    expect(body["2024"].stayNj[0].TransCode).toBe("RF");
    expect(body["2024"].stayNj[0].StatusCode).toBe("APC");
    expect(body["2024"].stayNj[0].ReviewCategory).toBe("MDZ");
    expect(body["2024"].stayNj[0].checkDate).toBe("12/11/2025 00:00:00");
    expect(body["2024"].stayNj[0].checkAmount).toBe(1750);
    expect(body["2024"].stayNj[0].checkNumber).toBe(922775385);
  });

  it("skips transactions with unrecognized tax codes", async () => {
    const row = buildMockRow({ TRANS_1_TAX_CDE: "99" });
    mockExecute.mockResolvedValue({ rows: [row] });

    const result = await handler({ ssn: "123456789", zip: "07656" });
    const body = JSON.parse(result.body);

    expect(body["2024"].anchor).toHaveLength(0);
    expect(body["2024"].ptr).toHaveLength(0);
    expect(body["2024"].stayNj).toHaveLength(0);
  });

  it("handles multiple transactions in a single row", async () => {
    const row = buildMockRow({
      TRANS_1_TAX_CDE: "13",
      TRANS_2_CDE: "RF",
      TRANS_STATUS_2_CDE: "APC",
      REVIEW_CATEGORY_2_CDE: "",
      CHECK_2_DTE: "01/15/2025 00:00:00",
      CHECK_2_AMT: 500,
      CHECK_2_NUM: 111222333,
      TRANS_2_TAX_CDE: "49",
    });
    mockExecute.mockResolvedValue({ rows: [row] });

    const result = await handler({ ssn: "123456789", zip: "07656" });
    const body = JSON.parse(result.body);

    expect(body["2024"].anchor).toHaveLength(1);
    expect(body["2024"].ptr).toHaveLength(1);
    expect(body["2024"].ptr[0].checkAmount).toBe(500);
  });
});

describe("handler year grouping", () => {
  it("groups transactions by RETURN_YEAR_DTE", async () => {
    const row2024 = buildMockRow({ RETURN_YEAR_DTE: 2024, TRANS_1_TAX_CDE: "13" });
    const row2025 = buildMockRow({ RETURN_YEAR_DTE: 2025, TRANS_1_TAX_CDE: "49" });
    mockExecute.mockResolvedValue({ rows: [row2024, row2025] });

    const result = await handler({ ssn: "123456789", zip: "07656" });
    const body = JSON.parse(result.body);

    expect(body["2024"].anchor).toHaveLength(1);
    expect(body["2024"].ptr).toHaveLength(0);
    expect(body["2024"].stayNj).toHaveLength(0);

    expect(body["2025"].ptr).toHaveLength(1);
    expect(body["2025"].anchor).toHaveLength(0);
    expect(body["2025"].stayNj).toHaveLength(0);
  });

  it("combines transactions from multiple rows of the same year", async () => {
    const row1 = buildMockRow({ RETURN_YEAR_DTE: 2024, TRANS_1_TAX_CDE: "13" });
    const row2 = buildMockRow({ RETURN_YEAR_DTE: 2024, TRANS_1_TAX_CDE: "49" });
    mockExecute.mockResolvedValue({ rows: [row1, row2] });

    const result = await handler({ ssn: "123456789", zip: "07656" });
    const body = JSON.parse(result.body);

    expect(body["2024"].anchor).toHaveLength(1);
    expect(body["2024"].ptr).toHaveLength(1);
    expect(body["2024"].stayNj).toHaveLength(0);
  });
});

describe("handler filer fields", () => {
  it("returns filer from the first matching row", async () => {
    const row = buildMockRow();
    mockExecute.mockResolvedValue({ rows: [row] });

    const result = await handler({ ssn: "123456789", zip: "07656" });
    const body = JSON.parse(result.body);

    expect(body.filer).toEqual({
      name: "JOE DOE",
      streetAddress: "123 TEST AVE",
      city: "PARK RIDGE",
      state: "NJ",
      zip: "07656",
    });
  });
});

describe("handler error handling", () => {
  it("returns 500 when database query fails", async () => {
    mockExecute.mockRejectedValue(new Error("ORA-12541: TNS:no listener"));

    const result = await handler({ ssn: "123456789", zip: "07656" });

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe("Internal server error");
  });

  it("closes the database connection even on error", async () => {
    mockExecute.mockRejectedValue(new Error("query failed"));

    await handler({ ssn: "123456789", zip: "07656" });

    expect(mockClose).toHaveBeenCalled();
  });
});
