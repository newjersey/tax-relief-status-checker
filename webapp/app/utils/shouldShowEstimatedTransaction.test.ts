import { describe, it, expect } from "vitest";
import { buildYearRecord } from "./testUtils";
import { shouldShowEstimatedTransaction } from "./shouldShowEstimatedTransaction";
import { EstimatedEligibilityType } from "@/components/types";
import { paymentApprovedTransaction, paymentSentTransaction } from "./testUtils";
import { CurrentYear } from "@/components/TaxReliefDataProvider";

describe("shouldShowEstimatedTransaction", () => {
  it("returns ANCHOR_ELIGIBLE for a record with an ANCHOR transaction that is approved but not sent", () => {
    const record = buildYearRecord({ anchor: [paymentApprovedTransaction] });
    expect(shouldShowEstimatedTransaction(record, CurrentYear.YEAR2025)).toBe(
      EstimatedEligibilityType.ANCHOR_ELIGIBLE,
    );
  });
  it("returns NOT_ELIGIBLE for a record with an ANCHOR transaction that is approved but year is 2024", () => {
    const record = buildYearRecord({ anchor: [paymentApprovedTransaction] });
    expect(shouldShowEstimatedTransaction(record, CurrentYear.YEAR2024)).toBe(
      EstimatedEligibilityType.NOT_ELIGIBLE,
    );
  });
  it("returns NOT_ELIGIBLE for a record with an ANCHOR transaction that is payment sent", () => {
    const record = buildYearRecord({ anchor: [paymentSentTransaction] });
    expect(shouldShowEstimatedTransaction(record, CurrentYear.YEAR2025)).toBe(
      EstimatedEligibilityType.NOT_ELIGIBLE,
    );
  });
  it("returns NOT_ELIGIBLE for a record with no ANCHOR transaction", () => {
    const record = buildYearRecord({ anchor: [] });
    expect(shouldShowEstimatedTransaction(record, CurrentYear.YEAR2025)).toBe(
      EstimatedEligibilityType.NOT_ELIGIBLE,
    );
  });
});
