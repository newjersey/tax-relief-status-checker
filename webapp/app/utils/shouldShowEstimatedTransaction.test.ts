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
  it("returns STAY_ELIGIBLE for a record with a STAY_NJ transaction that is approved but not sent", () => {
    const record = buildYearRecord({ stay_nj: [paymentApprovedTransaction] });
    expect(shouldShowEstimatedTransaction(record, CurrentYear.YEAR2025)).toBe(
      EstimatedEligibilityType.STAY_ELIGIBLE,
    );
  });
  it("returns STAY_ELIGIBLE for a record with a STAY_NJ transaction that is approved and a sent ANCHOR transaction", () => {
    const record = buildYearRecord({
      stay_nj: [paymentApprovedTransaction],
      anchor: [paymentSentTransaction],
    });
    expect(shouldShowEstimatedTransaction(record, CurrentYear.YEAR2025)).toBe(
      EstimatedEligibilityType.STAY_ELIGIBLE,
    );
  });
  it("returns STAY_ELIGIBLE for a record with a STAY_NJ transaction that is approved and a sent ANCHOR + PTR transactions", () => {
    const record = buildYearRecord({
      stay_nj: [paymentApprovedTransaction],
      anchor: [paymentSentTransaction],
      ptr: [paymentSentTransaction],
    });
    expect(shouldShowEstimatedTransaction(record, CurrentYear.YEAR2025)).toBe(
      EstimatedEligibilityType.STAY_ELIGIBLE,
    );
  });
  it("returns STAY_ELIGIBLE for a record with a STAY_NJ + PTR transactions that is approved and a sent ANCHOR transaction", () => {
    const record = buildYearRecord({
      stay_nj: [paymentApprovedTransaction],
      anchor: [paymentSentTransaction],
      ptr: [paymentApprovedTransaction],
    });
    expect(shouldShowEstimatedTransaction(record, CurrentYear.YEAR2025)).toBe(
      EstimatedEligibilityType.STAY_ELIGIBLE,
    );
  });
  it("returns BOTH_ELIGIBLE for a record with a ANCHOR + STAY_NJ transactions that is approved but not sent", () => {
    const record = buildYearRecord({
      stay_nj: [paymentApprovedTransaction],
      anchor: [paymentApprovedTransaction],
    });
    expect(shouldShowEstimatedTransaction(record, CurrentYear.YEAR2025)).toBe(
      EstimatedEligibilityType.BOTH_ELIGIBLE,
    );
  });
  it("returns BOTH_ELIGIBLE for a record with a ANCHOR + STAY_NJ transactions that is approved and a sent PTR transaction", () => {
    const record = buildYearRecord({
      stay_nj: [paymentApprovedTransaction],
      anchor: [paymentApprovedTransaction],
      ptr: [paymentSentTransaction],
    });
    expect(shouldShowEstimatedTransaction(record, CurrentYear.YEAR2025)).toBe(
      EstimatedEligibilityType.BOTH_ELIGIBLE,
    );
  });
  it("returns BOTH_ELIGIBLE for a record with a ANCHOR + STAY_NJ + PTR transactions that is approved but not send", () => {
    const record = buildYearRecord({
      stay_nj: [paymentApprovedTransaction],
      anchor: [paymentApprovedTransaction],
      ptr: [paymentApprovedTransaction],
    });
    expect(shouldShowEstimatedTransaction(record, CurrentYear.YEAR2025)).toBe(
      EstimatedEligibilityType.BOTH_ELIGIBLE,
    );
  });
  it("returns NOT_ELIGIBLE for a record with a STAY_NJ + PTR transactions that is approved but no ANCHOR transaction", () => {
    const record = buildYearRecord({
      stay_nj: [paymentApprovedTransaction],
      ptr: [paymentApprovedTransaction],
    });
    expect(shouldShowEstimatedTransaction(record, CurrentYear.YEAR2025)).toBe(
      EstimatedEligibilityType.NOT_ELIGIBLE,
    );
  });
  it("returns NOT_ELIGIBLE for a record with a STAY_NJ transactions that is approved, a sent PTR transaction, but no ANCHOR transaction", () => {
    const record = buildYearRecord({
      stay_nj: [paymentApprovedTransaction],
      ptr: [paymentSentTransaction],
    });
    expect(shouldShowEstimatedTransaction(record, CurrentYear.YEAR2025)).toBe(
      EstimatedEligibilityType.NOT_ELIGIBLE,
    );
  });
});
