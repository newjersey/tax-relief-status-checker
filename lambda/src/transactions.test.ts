import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

import { buildAllTransactions, buildTransaction } from "./transaction.ts";

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

const buildMockRow = (overrides = {}) => ({
  SOCIAL_SECURITY_NUMBER_IDN: "123456789",
  ZIP_ADR: "12345",
  RETURN_YEAR_DTE: 2024,
  RNY_APPLIED_DTE: "10/31/2025 00:00:00",
  TRANS_TOTAL_NUM: 2,
  TRANS_1_CDE: "RF",
  TRANS_STATUS_1_CDE: "APC",
  REVIEW_CATEGORY_1_CDE: "MDZ",
  CHECK_1_DTE: "12/11/2025 00:00:00",
  CHECK_1_AMT: 1750,
  CHECK_1_NUM: "922775385",
  TRANS_1_TAX_CDE: 13,
  TRANS_2_CDE: "RF",
  TRANS_STATUS_2_CDE: "APC",
  REVIEW_CATEGORY_2_CDE: null,
  CHECK_2_DTE: "11/28/2025 0:00:00",
  CHECK_2_AMT: 246,
  CHECK_2_NUM: "514221081",
  TRANS_2_TAX_CDE: 49,
  DIRECT_DEPOSIT_IND: "Y",
  ...overrides,
});

const callBuildTransaction = (row: any, i: number) => {
  return buildTransaction(
    row[`TRANS_${i}_CDE`],
    row[`TRANS_STATUS_${i}_CDE`],
    row[`REVIEW_CATEGORY_${i}_CDE`],
    row[`CHECK_${i}_DTE`],
    row[`CHECK_${i}_AMT`],
    row[`CHECK_${i}_NUM`],
  );
};

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

describe("build transaction status codes", () => {
  describe("when TRANS_X_CDE = RR and TRANS_STATUS_X_CDE = PR and REVIEW_CATEGORY_X_CDE = null", () => {
    it("returns status as Processing without payment details", async () => {
      const row = buildMockRow({
        TRANS_1_CDE: "RR",
        TRANS_STATUS_1_CDE: "PR",
        REVIEW_CATEGORY_1_CDE: null,
      });
      mockExecute.mockResolvedValue({ rows: [row] });

      const result = callBuildTransaction(row, 1);
      expect(result.status).toBe("processing");
    });
  });

  describe("when TRANS_X_CDE = RR and TRANS_STATUS_X_CDE = PR and REVIEW_CATEGORY_X_CDE = !null", () => {
    it("returns status as Issue Flagged without payment details and with a review category", async () => {
      const row = buildMockRow({
        TRANS_1_CDE: "RR",
        TRANS_STATUS_1_CDE: "PR",
        REVIEW_CATEGORY_1_CDE: "ID",
      });
      mockExecute.mockResolvedValue({ rows: [row] });

      const result = callBuildTransaction(row, 1);
      expect(result.status).toBe("issue_flagged");
      expect(result.payment_details).toBeUndefined();
      expect(result.review_category).toBe("ID");
    });
  });

  describe("when TRANS_X_CDE = RR and TRANS_STATUS_X_CDE = AP*", () => {
    it("returns status as Approved without payment details when status code is APC", async () => {
      const row = buildMockRow({
        TRANS_1_CDE: "RR",
        TRANS_STATUS_1_CDE: "APC",
      });
      mockExecute.mockResolvedValue({ rows: [row] });

      const result = callBuildTransaction(row, 1);
      expect(result.status).toBe("approved");
      expect(result.payment_details).toBeUndefined();
    });
    it("returns status as Approved without payment details when status code is APR", async () => {
      const row = buildMockRow({
        TRANS_1_CDE: "RR",
        TRANS_STATUS_1_CDE: "APR",
      });
      mockExecute.mockResolvedValue({ rows: [row] });

      const result = callBuildTransaction(row, 1);
      expect(result.status).toBe("approved");
      expect(result.payment_details).toBeUndefined();
    });
  });

  describe("when TRANS_X_CDE = RF", () => {
    it("returns status as Payment Sent with payment details", async () => {
      const row = buildMockRow({
        TRANS_1_CDE: "RF",
      });
      mockExecute.mockResolvedValue({ rows: [row] });

      const result = callBuildTransaction(row, 1);
      expect(result.status).toBe("payment_sent");
      expect(result.payment_details?.amount).toBe(1750);
      expect(result.payment_details?.method).toBe("check");
      expect(result.payment_details?.check_number).toBe("922775385");
      expect(result.payment_details?.date).toBe("12/11/2025 00:00:00");
    });
  });

  describe("when CHECK_X_NUMBER second + third characters are NOT NN", () => {
    it("returns returns payment method as check", async () => {
      const row = buildMockRow({
        TRANS_1_CDE: "RF",
        CHECK_1_NUM: "012345678",
      });
      mockExecute.mockResolvedValue({ rows: [row] });

      const result = callBuildTransaction(row, 1);
      expect(result.status).toBe("payment_sent");
      expect(result.payment_details?.amount).toBe(1750);
      expect(result.payment_details?.method).toBe("check");
      expect(result.payment_details?.check_number).toBe("012345678");
      expect(result.payment_details?.date).toBe("12/11/2025 00:00:00");
    });
  });

  describe("when CHECK_X_NUMBER second + third characters are NN", () => {
    it("returns returns payment method as direct deposit", async () => {
      const row = buildMockRow({
        TRANS_1_CDE: "RF",
        CHECK_1_NUM: "0NN345678",
      });
      mockExecute.mockResolvedValue({ rows: [row] });

      const result = callBuildTransaction(row, 1);
      expect(result.status).toBe("payment_sent");
      expect(result.payment_details?.amount).toBe(1750);
      expect(result.payment_details?.method).toBe("direct_deposit");
      expect(result.payment_details?.check_number).toBe("0NN345678");
      expect(result.payment_details?.date).toBe("12/11/2025 00:00:00");
    });
  });
});

describe("build all transactions", () => {
  describe("when there is only one transaction", () => {
    it("correctly sorts transaction into ANCHOR bucket when tax code is ANCHOR", async () => {
      const row = buildMockRow({
        TRANS_TOTAL_NUM: 1,
        TRANS_1_TAX_CDE: 13,
      });
      mockExecute.mockResolvedValue({ rows: [row] });

      const result = buildAllTransactions(row);
      expect(result.anchor.length).toBe(1);
      expect(result.ptr.length).toBe(0);
      expect(result.stay_nj.length).toBe(0);
    });
    it("correctly sorts transaction into ptr bucket when tax code is PTR", async () => {
      const row = buildMockRow({
        TRANS_TOTAL_NUM: 1,
        TRANS_1_TAX_CDE: 49,
      });
      mockExecute.mockResolvedValue({ rows: [row] });

      const result = buildAllTransactions(row);
      expect(result.anchor.length).toBe(0);
      expect(result.ptr.length).toBe(1);
      expect(result.stay_nj.length).toBe(0);
    });
    it("correctly sorts transaction into stay_nj bucket when tax code is stay_nj", async () => {
      const row = buildMockRow({
        TRANS_TOTAL_NUM: 1,
        TRANS_1_TAX_CDE: 41,
      });
      mockExecute.mockResolvedValue({ rows: [row] });

      const result = buildAllTransactions(row);
      expect(result.anchor.length).toBe(0);
      expect(result.ptr.length).toBe(0);
      expect(result.stay_nj.length).toBe(1);
    });
  });
  describe("when there are NO transactions", () => {
    it("should not put any transactions into a bucket", async () => {
      const row = buildMockRow({
        TRANS_TOTAL_NUM: 0,
      });
      mockExecute.mockResolvedValue({ rows: [row] });

      const result = buildAllTransactions(row);
      expect(result.anchor.length).toBe(0);
      expect(result.ptr.length).toBe(0);
      expect(result.stay_nj.length).toBe(0);
    });
  });
  describe("when there are MANY transactions", () => {
    it("should sort the transactions into their respective buckets", async () => {
      const row = buildMockRow({
        TRANS_TOTAL_NUM: 5,
        TRANS_3_CDE: "RF",
        TRANS_STATUS_3_CDE: "APC",
        REVIEW_CATEGORY_3_CDE: "MDZ",
        CHECK_3_DTE: "12/11/2025 00:00:00",
        CHECK_3_AMT: 1750,
        CHECK_3_NUM: "922775385",
        TRANS_3_TAX_CDE: 13,
        TRANS_4_CDE: "RF",
        TRANS_STATUS_4_CDE: "APC",
        REVIEW_CATEGORY_4_CDE: null,
        CHECK_4_DTE: "11/28/2025 0:00:00",
        CHECK_4_AMT: 246,
        CHECK_4_NUM: "514221081",
        TRANS_4_TAX_CDE: 41,
        TRANS_5_CDE: "RF",
        TRANS_STATUS_5_CDE: "APC",
        REVIEW_CATEGORY_5_CDE: null,
        CHECK_5_DTE: "11/28/2025 0:00:00",
        CHECK_5_AMT: 246,
        CHECK_5_NUM: "514221081",
        TRANS_5_TAX_CDE: 41,
      });
      mockExecute.mockResolvedValue({ rows: [row] });

      const result = buildAllTransactions(row);
      expect(result.anchor.length).toBe(2);
      expect(result.ptr.length).toBe(1);
      expect(result.stay_nj.length).toBe(2);
    });
  });
});
