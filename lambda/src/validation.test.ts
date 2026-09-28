import { describe, it, expect } from "vitest";
import { buildMockRow, buildMockTransactionValidation } from "./testHelpers";
import { isRecordValid, validateInput, validateTransaction } from "./validation";

describe("isRecordValid", () => {
  describe("when 1 field is missing", () => {
    describe("when DLN_NUM is missing", () => {
      it("returns result success as false", async () => {
        const row = buildMockRow({
          DLN_NUM: null,
        });
        const result = isRecordValid(row);
        expect(result).toBe(false);
      });
    });
    describe("when SOCIAL_SECURITY_NUMBER_IDN is missing", () => {
      it("returns result success as false", async () => {
        const row = buildMockRow({
          SOCIAL_SECURITY_NUMBER_IDN: null,
        });
        const result = isRecordValid(row);
        expect(result).toBe(false);
      });
    });
    describe("when ZIP_ADR is missing", () => {
      it("returns result success as false", async () => {
        const row = buildMockRow({
          ZIP_ADR: null,
        });
        const result = isRecordValid(row);
        expect(result).toBe(false);
      });
    });
    describe("when RETURN_YEAR_DTE is missing", () => {
      it("returns result success as false", async () => {
        const row = buildMockRow({
          RETURN_YEAR_DTE: null,
        });
        const result = isRecordValid(row);
        expect(result).toBe(false);
      });
    });
    describe("when RNY_APPLIED_DTE is missing", () => {
      it("returns result success as false", async () => {
        const row = buildMockRow({
          RNY_APPLIED_DTE: null,
        });
        const result = isRecordValid(row);
        expect(result).toBe(false);
      });
    });
    describe("when TRANS_TOTAL_NUM is missing", () => {
      it("returns result success as false", async () => {
        const row = buildMockRow({
          TRANS_TOTAL_NUM: null,
        });
        const result = isRecordValid(row);
        expect(result).toBe(false);
      });
    });
    describe("when FORM_CDE is missing", () => {
      it("returns result success as true", async () => {
        const row = buildMockRow({
          FORM_CDE: null,
        });
        const result = isRecordValid(row);
        expect(result).toBe(true);
      });
    });
  });

  describe("when all fields are missing", () => {
    it("returns result success as false and the associated error message for each field", async () => {
      const row = buildMockRow({
        DLN_NUM: null,
        SOCIAL_SECURITY_NUMBER_IDN: null,
        ZIP_ADR: null,
        RETURN_YEAR_DTE: null,
        RNY_APPLIED_DTE: null,
        TRANS_TOTAL_NUM: null,
      });
      const result = isRecordValid(row);

      expect(result).toBe(false);
    });
  });

  describe("when no fields are missing", () => {
    it("returns result success as true with no associated error messages", async () => {
      const row = buildMockRow();
      const result = isRecordValid(row);

      expect(result).toBe(true);
    });
  });
});

describe("validateInput", () => {
  it("returns false and reports error when ssn is missing", async () => {
    const result = validateInput({ zip: "07656" });
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain("Both ssn and zip are required");
  });

  it("returns false and reports error when zip is missing", async () => {
    const result = validateInput({ ssn: "123456789" });
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain("Both ssn and zip are required");
  });

  it("returns false and reports error for invalid SSN (not 9 digits)", async () => {
    const result = validateInput({ ssn: "12345", zip: "07656" });
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain("SSN must be 9 digits");
  });

  it("returns false and reports error for invalid ZIP (not 5 digits)", async () => {
    const result = validateInput({ ssn: "123456789", zip: "123" });
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain("ZIP must be 5 digits");
  });

  it("accepts SSN with hyphens and strips them", async () => {
    const result = validateInput({ ssn: "123-45-6789", zip: "07656" });
    expect(result.success).toBe(true);
    expect(result.data?.ssn).toBe("123456789");
    expect(result.data?.zip).toBe("07656");
  });

  it("handles API Gateway proxy format with stringified body", async () => {
    const result = validateInput({
      body: JSON.stringify({ ssn: "123456789", zip: "07656" }),
    });
    expect(result.success).toBe(true);
    expect(result.data?.ssn).toBe("123456789");
    expect(result.data?.zip).toBe("07656");
  });
});

describe("validateTransaction", () => {
  it("returns false and reports error when missing TRANS_CDE", async () => {
    const mockTransactionInfo = buildMockTransactionValidation({ TRANS_CDE: null });
    const result = validateTransaction(mockTransactionInfo);
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain("TRANS_CDE is invalid");
  });
  it("returns false and reports error when TRANS_CDE not RF or RR", async () => {
    const mockTransactionInfo = buildMockTransactionValidation({ TRANS_CDE: "ZZ" });
    const result = validateTransaction(mockTransactionInfo);
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain("TRANS_CDE is invalid");
  });
  it("returns false and reports error when missing TRANS_STATUS_CDE (TRANS_CDE = RF)", async () => {
    const mockTransactionInfo = buildMockTransactionValidation({ TRANS_STATUS_CDE: null });
    const result = validateTransaction(mockTransactionInfo);
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain("TRANS_STATUS_CDE is required when TRANS_CDE is RF");
  });
  it("returns false and reports error when TRANS_STATUS_CDE does not start with AP|PR (TRANS_CDE = RF)", async () => {
    const mockTransactionInfo = buildMockTransactionValidation({ TRANS_STATUS_CDE: "ZZ" });
    const result = validateTransaction(mockTransactionInfo);
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain("TRANS_STATUS_CDE must start with AP or PR");
  });

  it("returns false and reports error when missing Check Info (TRANS_CDE = RF)", async () => {
    const mockTransactionInfo = buildMockTransactionValidation({
      CHECK_DTE: null,
      CHECK_AMT: null,
      CHECK_NUM: null,
    });
    const result = validateTransaction(mockTransactionInfo);
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain("CHECK_DTE is required when TRANS_CDE is RF");
    expect(result.error?.message).toContain("CHECK_AMT is required when TRANS_CDE is RF");
    expect(result.error?.message).toContain("CHECK_NUM is required when TRANS_CDE is RF");
  });
  it("returns true when missing Check Info (TRANS_CDE = RR)", async () => {
    const mockTransactionInfo = buildMockTransactionValidation({
      CHECK_DTE: null,
      CHECK_AMT: null,
      CHECK_NUM: null,
      TRANS_CDE: "RR",
    });
    const result = validateTransaction(mockTransactionInfo);
    expect(result.success).toBe(true);
  });
});
