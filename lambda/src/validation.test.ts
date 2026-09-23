import { describe, it, expect } from "vitest";
import { buildMockRow } from "./testHelpers";
import { isRecordValid } from "./validation";

const buildExpectedError = (field: string, expectedType: string) => {
  return {
    expected: expectedType,
    code: "invalid_type",
    path: [field],
    message: `${field} is required`,
  };
};

describe("when 1 field is missing", () => {
  describe("when DLN_NUM is missing", () => {
    it("returns result success as false and the associated error message", async () => {
      const row = buildMockRow({
        DLN_NUM: null,
      });
      const result = isRecordValid(row);
      expect(result).toBe(false);
    });
  });
  describe("when SOCIAL_SECURITY_NUMBER_IDN is missing", () => {
    it("returns result success as false and the associated error message", async () => {
      const row = buildMockRow({
        SOCIAL_SECURITY_NUMBER_IDN: null,
      });
      const result = isRecordValid(row);
      expect(result).toBe(false);
    });
  });
  describe("when ZIP_ADR is missing", () => {
    it("returns result success as false and the associated error message", async () => {
      const row = buildMockRow({
        ZIP_ADR: null,
      });
      const result = isRecordValid(row);
      expect(result).toBe(false);
    });
  });
  describe("when RETURN_YEAR_DTE is missing", () => {
    it("returns result success as false and the associated error message", async () => {
      const row = buildMockRow({
        RETURN_YEAR_DTE: null,
      });
      const result = isRecordValid(row);
      expect(result).toBe(false);
    });
  });
  describe("when RNY_APPLIED_DTE is missing", () => {
    it("returns result success as false and the associated error message", async () => {
      const row = buildMockRow({
        RNY_APPLIED_DTE: null,
      });
      const result = isRecordValid(row);
      expect(result).toBe(false);
    });
  });
  describe("when TRANS_TOTAL_NUM is missing", () => {
    it("returns result success as false and the associated error message", async () => {
      const row = buildMockRow({
        TRANS_TOTAL_NUM: null,
      });
      const result = isRecordValid(row);
      expect(result).toBe(false);
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
