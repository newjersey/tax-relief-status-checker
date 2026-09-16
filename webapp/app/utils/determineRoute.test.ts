import { describe, it, expect } from "vitest";
import { determineRoute } from "./determineRoute";
import type { StatusRecord } from "@/components/types";
import { TransactionStatus } from "@/components/types";
import { FormCode } from "@/components/types";

const buildStatusRecord = (overrides?: Partial<StatusRecord>): StatusRecord => ({
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
      const record = buildStatusRecord({
        ptr: [{ status: TransactionStatus.PAYMENT_SENT }],
      });

      expect(determineRoute(record)).toBe("/payment-info");
    });

    it("routes a user to payment info when record has Stay NJ payment sent when feature flag is true", () => {
      vi.stubEnv("NEXT_PUBLIC_ENABLE_STAY", "true");
      const record = buildStatusRecord({
        stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }],
      });

      expect(determineRoute(record)).toBe("/payment-info");
      vi.unstubAllEnvs();
    });

    it("routes a user to application-received when record has Stay NJ payment sent when feature flag is false", () => {
      vi.stubEnv("NEXT_PUBLIC_ENABLE_STAY", "false");
      const record = buildStatusRecord({
        stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }],
      });

      expect(determineRoute(record)).toBe("/application-received");
      vi.unstubAllEnvs();
    });

    it("routes a user to more-information-needed when record has a flagged issue", () => {
      const record = buildStatusRecord({
        ptr: [{ status: TransactionStatus.ISSUE_FLAGGED, review_category: "SVR" }],
        anchor: [{ status: TransactionStatus.ISSUE_FLAGGED, review_category: "MOD" }],
      });

      expect(determineRoute(record)).toBe("/more-information-needed");
    });

    it("routes a user to the application received page when no PTR payment sent and no issue is flagged", () => {
      const record = buildStatusRecord({
        ptr: [{ status: TransactionStatus.PROCESSING }],
      });

      expect(determineRoute(record)).toBe("/application-received");
    });
  });

  describe("form_code is ANC-1", () => {
    it("routes a user to anchor payment info when record only has ANCHOR payment sent", () => {
      const record = buildStatusRecord({
        anchor: [{ status: TransactionStatus.PAYMENT_SENT }],
        form_code: FormCode.ANC1,
      });
      expect(determineRoute(record)).toBe("/payment-info");
    });
    it("routes a user to regular payment info when record has ANCHOR and PTR payment sent", () => {
      const record = buildStatusRecord({
        anchor: [{ status: TransactionStatus.PAYMENT_SENT }],
        ptr: [{ status: TransactionStatus.PAYMENT_SENT }],
        form_code: FormCode.ANC1,
      });
      expect(determineRoute(record)).toBe("/payment-info");
    });
    it("routes a user to regular payment info when record has ANCHOR and Stay payment sent", () => {
      vi.stubEnv("NEXT_PUBLIC_ENABLE_STAY", "true");
      const record = buildStatusRecord({
        anchor: [{ status: TransactionStatus.PAYMENT_SENT }],
        stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }],
        form_code: FormCode.ANC1,
      });
      expect(determineRoute(record)).toBe("/payment-info");
      vi.unstubAllEnvs;
    });
    it("routes a user to more-information-needed when record has a flagged issue", () => {
      const record = buildStatusRecord({
        ptr: [{ status: TransactionStatus.ISSUE_FLAGGED, review_category: "SVR" }],
        anchor: [{ status: TransactionStatus.ISSUE_FLAGGED, review_category: "MOD" }],
        form_code: FormCode.ANC1,
      });
      expect(determineRoute(record)).toBe("/more-information-needed");
    });
    it("routes a user to the anchor application received page when no ANCHOR payment sent and no issue is flagged", () => {
      const record = buildStatusRecord({
        anchor: [{ status: TransactionStatus.PROCESSING }],
        form_code: FormCode.ANC1,
      });
      expect(determineRoute(record)).toBe("/anchor-application-received");
    });
  });
});
