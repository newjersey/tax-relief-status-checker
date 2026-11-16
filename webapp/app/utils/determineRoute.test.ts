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

const paymentInfoRecord = buildYearRecord({ ptr: [{ status: TransactionStatus.PAYMENT_SENT }] });
const applicationReceivedRecord = buildYearRecord({
  ptr: [{ status: TransactionStatus.PROCESSING }],
});
const moreInformationNeededRecord = buildYearRecord({
  ptr: [{ status: TransactionStatus.ISSUE_FLAGGED, review_category: "SVR" }],
  anchor: [{ status: TransactionStatus.ISSUE_FLAGGED, review_category: "MOD" }],
});
const anchorApplicationReceivedRecord = buildYearRecord({
  anchor: [{ status: TransactionStatus.PROCESSING }],
  form_code: FormCode.ANC1,
});

describe("determineRoute", () => {
  describe("form_code is PAS-1", () => {
    it.each([
      {
        year: CurrentYear.YEAR2024,
        record: paymentInfoRecord,
        expectedRoute: "/payment-info",
      },
      {
        year: CurrentYear.YEAR2025,
        record: paymentInfoRecord,
        expectedRoute: "/payment-info",
      },
      {
        year: CurrentYear.YEAR2024,
        record: applicationReceivedRecord,
        expectedRoute: "/application-received",
      },
      {
        year: CurrentYear.YEAR2025,
        record: applicationReceivedRecord,
        expectedRoute: "/application-received",
      },
      {
        year: CurrentYear.YEAR2024,
        record: anchorApplicationReceivedRecord,
        expectedRoute: "/application-received",
      },
      {
        year: CurrentYear.YEAR2025,
        record: anchorApplicationReceivedRecord,
        expectedRoute: "/anchor-application-received",
      },
      {
        year: CurrentYear.YEAR2024,
        record: moreInformationNeededRecord,
        expectedRoute: "/more-information-needed",
      },
      {
        year: CurrentYear.YEAR2025,
        record: moreInformationNeededRecord,
        expectedRoute: "/more-information-needed",
      },
    ])("routes a user to $expectedRoute for $year record", ({ year, record, expectedRoute }) => {
      expect(determineRoute(record, year)).toBe(expectedRoute);
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
});
