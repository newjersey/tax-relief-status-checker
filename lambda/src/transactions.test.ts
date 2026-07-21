import { describe, it, expect } from "vitest";
import { buildMockRow } from "./helpers.ts";
import { buildAllTransactions, buildTransaction } from "./transaction.ts";

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

describe("build transaction status codes", () => {
  describe("when TRANS_X_CDE = RR and TRANS_STATUS_X_CDE = PR and REVIEW_CATEGORY_X_CDE = null", () => {
    it("returns status as Processing without payment details", async () => {
      const row = buildMockRow({
        TRANS_1_CDE: "RR",
        TRANS_STATUS_1_CDE: "PR",
        REVIEW_CATEGORY_1_CDE: null,
      });

      const result = callBuildTransaction(row, 1);
      expect(result.status).toBe("processing");
    });
  });

  describe("when TRANS_X_CDE = RR and TRANS_STATUS_X_CDE = PRH and REVIEW_CATEGORY_X_CDE = null", () => {
    it("returns status as Processing without payment details", async () => {
      const row = buildMockRow({
        TRANS_1_CDE: "RR",
        TRANS_STATUS_1_CDE: "PRH",
        REVIEW_CATEGORY_1_CDE: null,
      });

      const result = callBuildTransaction(row, 1);
      expect(result.status).toBe("processing");
    });
  });

  describe("when TRANS_X_CDE = RR and TRANS_STATUS_X_CDE = PR and REVIEW_CATEGORY_X_CDE = !null", () => {
    it("returns status as Issue Flagged without payment details and with a review category", async () => {
      const row = buildMockRow({
        TRANS_1_CDE: "RR",
        TRANS_STATUS_1_CDE: "PR",
        REVIEW_CATEGORY_1_CDE: "MOCK_REVIEW_CATEGORY",
      });

      const result = callBuildTransaction(row, 1);
      expect(result.status).toBe("issue_flagged");
      expect(result.payment_details).toBeUndefined();
      expect(result.review_category).toBe("MOCK_REVIEW_CATEGORY");
    });
  });

  describe("when TRANS_X_CDE = RR and TRANS_STATUS_X_CDE = PRH and REVIEW_CATEGORY_X_CDE = !null", () => {
    it("returns status as Processing without payment details", async () => {
      const row = buildMockRow({
        TRANS_1_CDE: "RR",
        TRANS_STATUS_1_CDE: "PRH",
        REVIEW_CATEGORY_1_CDE: "MOCK_REVIEW_CATEGORY",
      });

      const result = callBuildTransaction(row, 1);
      expect(result.status).toBe("issue_flagged");
      expect(result.review_category).toBe("MOCK_REVIEW_CATEGORY");
    });
  });

  describe("when TRANS_X_CDE = RR and TRANS_STATUS_X_CDE = AP*", () => {
    it.each(["APC", "APR"])(
      "returns status as Approved without payment details when status code is %s",
      async (statusCode) => {
        const row = buildMockRow({
          TRANS_1_CDE: "RR",
          TRANS_STATUS_1_CDE: statusCode,
        });

        const result = callBuildTransaction(row, 1);
        expect(result.status).toBe("approved");
        expect(result.payment_details).toBeUndefined();
      },
    );
  });

  describe("when TRANS_X_CDE = RF", () => {
    it("returns status as Payment Sent with payment details", async () => {
      const row = buildMockRow({
        TRANS_1_CDE: "RF",
      });

      const result = callBuildTransaction(row, 1);
      expect(result.status).toBe("payment_sent");
      expect(result.payment_details?.amount).toBe(1750);
      expect(result.payment_details?.method).toBe("check");
      expect(result.payment_details?.check_number).toBe("922775385");
      expect(result.payment_details?.date).toBe("12/11/2025 00:00:00");
    });
  });

  describe("when TRANS_X_CDE is missing", () => {
    it("throws an error with trans cde", async () => {
      const row = buildMockRow({
        TRANS_1_CDE: null,
      });

      expect(() => callBuildTransaction(row, 1)).toThrow("Invalid TRANS_CDE: null");
    });
  });

  describe("when CHECK_X_NUMBER second + third characters are NOT NN", () => {
    it("returns payment method as check", async () => {
      const row = buildMockRow({
        TRANS_1_CDE: "RF",
        CHECK_1_NUM: "012345678",
      });

      const result = callBuildTransaction(row, 1);
      expect(result.payment_details?.method).toBe("check");
    });
  });

  describe("when CHECK_X_NUMBER second + third characters are NN", () => {
    it("returns payment method as direct deposit", async () => {
      const row = buildMockRow({
        TRANS_1_CDE: "RF",
        CHECK_1_NUM: "0NN345678",
      });

      const result = callBuildTransaction(row, 1);
      expect(result.payment_details?.method).toBe("direct_deposit");
    });
  });

  describe("when CHECK_X_NUMBER is missing", () => {
    it("throws an error for Missing CHECK_NUM", async () => {
      const row = buildMockRow({
        TRANS_1_CDE: "RF",
        CHECK_1_NUM: null,
      });

      expect(() => callBuildTransaction(row, 1)).toThrow("Missing CHECK_NUM");
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

      const result = buildAllTransactions(row);
      expect(result.anchor.length).toBe(1);
      expect(result.ptr.length).toBe(0);
      expect(result.stay_nj.length).toBe(0);
      expect(result.anchor[0].payment_details?.check_number).toBe("922775385");
    });
    it("correctly sorts transaction into ptr bucket when tax code is PTR", async () => {
      const row = buildMockRow({
        TRANS_TOTAL_NUM: 1,
        TRANS_1_TAX_CDE: 49,
      });

      const result = buildAllTransactions(row);
      expect(result.anchor.length).toBe(0);
      expect(result.ptr.length).toBe(1);
      expect(result.stay_nj.length).toBe(0);
      expect(result.ptr[0].payment_details?.check_number).toBe("922775385");
    });
    it("correctly sorts transaction into stay_nj bucket when tax code is stay_nj", async () => {
      const row = buildMockRow({
        TRANS_TOTAL_NUM: 1,
        TRANS_1_TAX_CDE: 41,
      });

      const result = buildAllTransactions(row);
      expect(result.anchor.length).toBe(0);
      expect(result.ptr.length).toBe(0);
      expect(result.stay_nj.length).toBe(1);
      expect(result.stay_nj[0].payment_details?.check_number).toBe("922775385");
    });
    it("throws an error for invalid transaction tax code", async () => {
      const row = buildMockRow({
        TRANS_TOTAL_NUM: 1,
        TRANS_1_TAX_CDE: 0,
      });

      expect(() => buildAllTransactions(row)).toThrow(
        "Invalid transaction tax code: 0 for transaction 1",
      );
    });
  });
  describe("when there are NO transactions", () => {
    it("should not put any transactions into a bucket", async () => {
      const row = buildMockRow({
        TRANS_TOTAL_NUM: 0,
      });

      const result = buildAllTransactions(row);
      expect(result.anchor.length).toBe(0);
      expect(result.ptr.length).toBe(0);
      expect(result.stay_nj.length).toBe(0);
    });
  });
  describe("when there are MANY transactions", () => {
    it("should sort the transactions into their respective buckets", async () => {
      const row = buildMockRow({
        CHECK_1_NUM: "111111111",

        TRANS_2_CDE: "RF",
        TRANS_STATUS_2_CDE: "APC",
        REVIEW_CATEGORY_2_CDE: null,
        CHECK_2_DTE: "11/28/2025 0:00:00",
        CHECK_2_AMT: 246,
        CHECK_2_NUM: "222222222",
        TRANS_2_TAX_CDE: 49,
        TRANS_TOTAL_NUM: 5,
        TRANS_3_CDE: "RF",
        TRANS_STATUS_3_CDE: "APC",
        REVIEW_CATEGORY_3_CDE: "MDZ",
        CHECK_3_DTE: "12/11/2025 00:00:00",
        CHECK_3_AMT: 1750,
        CHECK_3_NUM: "333333333",
        TRANS_3_TAX_CDE: 13,
        TRANS_4_CDE: "RF",
        TRANS_STATUS_4_CDE: "APC",
        REVIEW_CATEGORY_4_CDE: null,
        CHECK_4_DTE: "11/28/2025 0:00:00",
        CHECK_4_AMT: 246,
        CHECK_4_NUM: "444444444",
        TRANS_4_TAX_CDE: 41,
        TRANS_5_CDE: "RF",
        TRANS_STATUS_5_CDE: "APC",
        REVIEW_CATEGORY_5_CDE: null,
        CHECK_5_DTE: "11/28/2025 0:00:00",
        CHECK_5_AMT: 246,
        CHECK_5_NUM: "555555555",
        TRANS_5_TAX_CDE: 41,
      });

      const result = buildAllTransactions(row);
      expect(result.anchor.length).toBe(2);
      expect(result.ptr.length).toBe(1);
      expect(result.stay_nj.length).toBe(2);

      expect(result.anchor[0].payment_details?.check_number).toBe("111111111");
      expect(result.anchor[1].payment_details?.check_number).toBe("333333333");
      expect(result.ptr[0].payment_details?.check_number).toBe("222222222");
      expect(result.stay_nj[0].payment_details?.check_number).toBe("444444444");
      expect(result.stay_nj[1].payment_details?.check_number).toBe("555555555");
    });
  });
});
