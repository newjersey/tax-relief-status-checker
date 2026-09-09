import { describe, it, expect } from "vitest";
import { determineRoute } from "./determineRoute";
import type { StatusRecord } from "@/components/types";
import { TransactionStatus } from "@/components/types";

const buildStatusRecord = (overrides?: Partial<StatusRecord>): StatusRecord => ({
  return_year: "2025",
  application_date: "2026-03-19T00:00:00.000Z",
  anchor: [],
  ptr: [],
  stay_nj: [],
  ...overrides,
});

describe("determineRoute", () => {
  it("routes a user to payment info when record has PTR payment sent", () => {
    const record = buildStatusRecord({
      ptr: [{ status: TransactionStatus.PAYMENT_SENT }],
    });

    expect(determineRoute(record)).toBe("/payment-info");
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
