import { describe, it, expect } from "vitest";
import { determineRoute } from "./determineRoute";
import { TransactionStatus } from "@/components/types";
import { FormCode } from "@/components/types";
import { CurrentYear, YearRecord } from "@/components/TaxReliefDataProvider";

const buildYearRecord = (overrides?: Partial<YearRecord>): YearRecord => ({
  return_year: "2025",
  application_date: "2026-03-19T00:00:00.000Z",
  form_code: FormCode.PAS1,
  anchor: [],
  ptr: [],
  stay_nj: [],
  ...overrides,
});

describe("determineRoute", () => {
  describe("form_code is PAS-1", () => {
    it("routes a user to payment info when record has PTR payment sent", () => {
      const record = buildYearRecord({
        ptr: [{ status: TransactionStatus.PAYMENT_SENT }],
      });

      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/payment-info");
    });

    it("routes a user to payment info when record has Stay NJ payment sent when feature flag is true", () => {
      vi.stubEnv("NEXT_PUBLIC_ENABLE_STAY", "true");
      const record = buildYearRecord({
        stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }],
      });

      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/payment-info");
      vi.unstubAllEnvs();
    });

    it("routes a user to application-received when record has Stay NJ payment sent when feature flag is false", () => {
      vi.stubEnv("NEXT_PUBLIC_ENABLE_STAY", "false");
      const record = buildYearRecord({
        stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }],
      });

      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/application-received");
      vi.unstubAllEnvs();
    });

    it("routes a user to more-information-needed when record has a flagged issue", () => {
      const record = buildYearRecord({
        ptr: [{ status: TransactionStatus.ISSUE_FLAGGED, review_category: "SVR" }],
        anchor: [{ status: TransactionStatus.ISSUE_FLAGGED, review_category: "MOD" }],
      });

      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/more-information-needed");
    });

    it("routes a user to the application received page when no PTR payment sent and no issue is flagged", () => {
      const record = buildYearRecord({
        ptr: [{ status: TransactionStatus.PROCESSING }],
      });

      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/application-received");
    });
  });

  describe("form_code is ANC-1", () => {
    it("routes a user to anchor payment info when record only has ANCHOR payment sent", () => {
      const record = buildYearRecord({
        anchor: [{ status: TransactionStatus.PAYMENT_SENT }],
        form_code: FormCode.ANC1,
      });
      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/payment-info");
    });
    it("routes a user to regular payment info when record has ANCHOR and PTR payment sent", () => {
      const record = buildYearRecord({
        anchor: [{ status: TransactionStatus.PAYMENT_SENT }],
        ptr: [{ status: TransactionStatus.PAYMENT_SENT }],
        form_code: FormCode.ANC1,
      });
      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/payment-info");
    });
    it("routes a user to regular payment info when record has ANCHOR and Stay payment sent", () => {
      vi.stubEnv("NEXT_PUBLIC_ENABLE_STAY", "true");
      const record = buildYearRecord({
        anchor: [{ status: TransactionStatus.PAYMENT_SENT }],
        stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }],
        form_code: FormCode.ANC1,
      });
      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/payment-info");
      vi.unstubAllEnvs;
    });
    it("routes a user to more-information-needed when record has a flagged issue", () => {
      const record = buildYearRecord({
        ptr: [{ status: TransactionStatus.ISSUE_FLAGGED, review_category: "SVR" }],
        anchor: [{ status: TransactionStatus.ISSUE_FLAGGED, review_category: "MOD" }],
        form_code: FormCode.ANC1,
      });
      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/more-information-needed");
    });
    it("routes a user to the anchor application received page when no ANCHOR payment sent and no issue is flagged", () => {
      const record = buildYearRecord({
        anchor: [{ status: TransactionStatus.PROCESSING }],
        form_code: FormCode.ANC1,
      });
      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/anchor-application-received");
    });
  });

  describe("form_code is NULL", () => {
    it("routes a user to payment info when record has PTR payment sent", () => {
      const record = buildYearRecord({
        form_code: null,
        ptr: [{ status: TransactionStatus.PAYMENT_SENT }],
      });

      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/payment-info");
    });

    it("routes a user to payment info when record has Stay NJ payment sent when feature flag is true", () => {
      vi.stubEnv("NEXT_PUBLIC_ENABLE_STAY", "true");
      const record = buildYearRecord({
        form_code: null,

        stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }],
      });

      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/payment-info");
      vi.unstubAllEnvs();
    });

    it("routes a user to application-received when record has Stay NJ payment sent when feature flag is false", () => {
      vi.stubEnv("NEXT_PUBLIC_ENABLE_STAY", "false");
      const record = buildYearRecord({
        form_code: null,
        stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }],
      });

      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/application-received");
      vi.unstubAllEnvs();
    });

    it("routes a user to more-information-needed when record has a flagged issue", () => {
      const record = buildYearRecord({
        form_code: null,
        ptr: [{ status: TransactionStatus.ISSUE_FLAGGED, review_category: "SVR" }],
        anchor: [{ status: TransactionStatus.ISSUE_FLAGGED, review_category: "MOD" }],
      });

      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/more-information-needed");
    });

    it("routes a user to the application received page when no PTR payment sent and no issue is flagged", () => {
      const record = buildYearRecord({
        form_code: null,
        ptr: [{ status: TransactionStatus.PROCESSING }],
      });

      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/application-received");
    });
  });

  describe("form_code is PAS-1", () => {
    it("routes a user to payment info when record has PTR payment sent", () => {
      const record = buildYearRecord({
        ptr: [{ status: TransactionStatus.PAYMENT_SENT }],
      });

      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/payment-info");
    });

    it("routes a user to payment info when record has Stay NJ payment sent when feature flag is true", () => {
      vi.stubEnv("NEXT_PUBLIC_ENABLE_STAY", "true");
      const record = buildYearRecord({
        stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }],
      });

      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/payment-info");
      vi.unstubAllEnvs();
    });

    it("routes a user to application-received when record has Stay NJ payment sent when feature flag is false", () => {
      vi.stubEnv("NEXT_PUBLIC_ENABLE_STAY", "false");
      const record = buildYearRecord({
        stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }],
      });

      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/application-received");
      vi.unstubAllEnvs();
    });

    it("routes a user to more-information-needed when record has a flagged issue", () => {
      const record = buildYearRecord({
        ptr: [{ status: TransactionStatus.ISSUE_FLAGGED, review_category: "SVR" }],
        anchor: [{ status: TransactionStatus.ISSUE_FLAGGED, review_category: "MOD" }],
      });

      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/more-information-needed");
    });

    it("routes a user to the application received page when no PTR payment sent and no issue is flagged", () => {
      const record = buildYearRecord({
        ptr: [{ status: TransactionStatus.PROCESSING }],
      });

      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/application-received");
    });
  });

  describe("return_year is 2024", () => {
    it("routes a user to payment info when record only has payment sent", () => {
      const record = buildYearRecord({
        return_year: "2024",
        anchor: [{ status: TransactionStatus.PAYMENT_SENT }],
      });
      expect(determineRoute(record, CurrentYear.YEAR2024)).toBe("/payment-info");
    });

    it("routes a user to regular application received when no payments sent", () => {
      const record = buildYearRecord({
        ptr: [{ status: TransactionStatus.PROCESSING }],
      });
      expect(determineRoute(record, CurrentYear.YEAR2025)).toBe("/application-received");
    });
    it("routes a user to more-information-needed when record has a flagged issue", () => {
      const record = buildYearRecord({
        return_year: "2024",
        ptr: [{ status: TransactionStatus.ISSUE_FLAGGED, review_category: "SVR" }],
        anchor: [{ status: TransactionStatus.ISSUE_FLAGGED, review_category: "MOD" }],
      });
      expect(determineRoute(record, CurrentYear.YEAR2024)).toBe("/more-information-needed");
    });
  });
});
