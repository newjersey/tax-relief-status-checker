import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { buildMockRow } from "./helpers.ts";
import { handler, validateInput } from "./index.ts";

const secretsMock = mockClient(SecretsManagerClient);
const mockExecute = vi.fn();
const mockClose = vi.fn();

vi.mock("oracledb", () => ({
  default: {
    getConnection: vi.fn(() =>
      Promise.resolve({
        execute: mockExecute,
        close: mockClose,
      }),
    ),
    OUT_FORMAT_OBJECT: 4001,
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  secretsMock.reset();
  process.env.DB_CREDS_SECRET_NAME = "MOCK_SECRET";
  process.env.CONNECT_STRING = "MOCK_CONNECT_STRING";

  secretsMock.on(GetSecretValueCommand).resolves({
    SecretString: JSON.stringify({
      ORACLE_DB_USER: "testuser",
      ORACLE_DB_PASSWORD: "testpass",
    }),
  });
});

describe("handler input validation", () => {
  it("returns 400 when ssn is missing", async () => {
    const result = validateInput({ zip: "07656" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Both ssn and zip are required");
  });

  it("returns 400 when zip is missing", async () => {
    const result = validateInput({ ssn: "123456789" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Both ssn and zip are required");
  });

  it("returns 400 for invalid SSN (not 9 digits)", async () => {
    const result = validateInput({ ssn: "12345", zip: "07656" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("SSN must be 9 digits");
  });

  it("returns 400 for invalid ZIP (not 5 digits)", async () => {
    const result = validateInput({ ssn: "123456789", zip: "123" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("ZIP must be 5 digits");
  });

  it("accepts SSN with hyphens and strips them", async () => {
    const result = validateInput({ ssn: "123-45-6789", zip: "07656" });
    expect(result.valid).toBe(true);
    expect(result.ssn).toBe("123456789");
    expect(result.zip).toBe("07656");
  });

  it("handles API Gateway proxy format with stringified body", async () => {
    const result = validateInput({
      body: JSON.stringify({ ssn: "123456789", zip: "07656" }),
    });
    expect(result.valid).toBe(true);
    expect(result.ssn).toBe("123456789");
    expect(result.zip).toBe("07656");
  });
});

describe("handler error handling", () => {
  it("returns 500 when database query fails", async () => {
    mockExecute.mockRejectedValue(new Error("ORA-12541: TNS:no listener"));

    const result = await handler({ ssn: "123456789", zip: "07656" });

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe("Internal server error");
  });

  it("returns 400 when validation fails", async () => {
    const result = await handler({});
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toBe("Both ssn and zip are required");
  });

  it("closes the database connection even on error", async () => {
    mockExecute.mockRejectedValue(new Error("query failed"));

    await handler({ ssn: "123456789", zip: "07656" });

    expect(mockClose).toHaveBeenCalled();
  });
});

describe("handler business logic", () => {
  describe("when filer has no matching rows in DB", () => {
    it("returns 200 with empty filer object when no rows match", async () => {
      mockExecute.mockResolvedValue({ rows: [] });

      const result = await handler({ ssn: "123456789", zip: "00000" });

      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body);
      expect(body.records).toEqual([]);
    });
  });

  describe("when filer has one matching row in DB", () => {
    it("returns 200 and constructs the response", async () => {
      const row = buildMockRow({});
      mockExecute.mockResolvedValue({ rows: [row] });
      const result = await handler({ ssn: "123456789", zip: "12345" });
      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body);
      console.log(body["records"][0]);

      expect(body["records"]).toHaveLength(1);
      expect(body["records"][0].return_year).toBe("2024");
      expect(body["records"][0].application_date).toBe("10/31/2025 00:00:00");
      expect(body["records"][0]["anchor"][0].status).toBe("payment_sent");
      expect(body["records"][0].ptr).toBeDefined();
      expect(body["records"][0].ptr.length).toBe(0);
      expect(body["records"][0].stay_nj).toBeDefined();
      expect(body["records"][0].stay_nj.length).toBe(0);
    });
  });

  describe("when filer has multiple matching rows in DB", () => {
    it("returns 200 and constructs the response", async () => {
      const row2024 = buildMockRow({ RETURN_YEAR_DTE: 2024 });
      const row2025 = buildMockRow({
        RETURN_YEAR_DTE: 2025,
        RNY_APPLIED_DTE: "10/31/2026 00:00:00",
      });
      mockExecute.mockResolvedValue({ rows: [row2024, row2025] });

      const result = await handler({ ssn: "123456789", zip: "12345" });
      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body);
      expect(body["records"]).toHaveLength(2);

      expect(body["records"][0].return_year).toBe("2024");
      expect(body["records"][0].application_date).toBe("10/31/2025 00:00:00");
      expect(body["records"][0]["anchor"][0].status).toBe("payment_sent");
      expect(body["records"][0].ptr).toBeDefined();
      expect(body["records"][0].ptr.length).toBe(0);
      expect(body["records"][0].stay_nj).toBeDefined();
      expect(body["records"][0].stay_nj.length).toBe(0);

      expect(body["records"][1].return_year).toBe("2025");
      expect(body["records"][1].application_date).toBe("10/31/2026 00:00:00");
      expect(body["records"][1]["anchor"][0].status).toBe("payment_sent");
      expect(body["records"][1].ptr).toBeDefined();
      expect(body["records"][1].ptr.length).toBe(0);
      expect(body["records"][1].stay_nj).toBeDefined();
      expect(body["records"][1].stay_nj.length).toBe(0);
    });
  });
});
