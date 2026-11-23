import { describe, it, expect } from "vitest";
import { TransactionStatus } from "@/components/types";
import { hasPaymentSentTransaction } from "./hasPaymentSentTransaction";
import { CurrentYear } from "@/components/TaxReliefDataProvider";
import { buildYearRecord } from "./testUtils";

describe("hasPaymentSentTransaction (currentYear = 2024)", () => {
  it("returns [0,0,0] for no payments sent", () => {
    const record = buildYearRecord();

    expect(hasPaymentSentTransaction(record, CurrentYear.YEAR2024)).toStrictEqual([
      false,
      false,
      false,
    ]);
  });
  it("returns [1,0,0] for a record with anchor payment sent", () => {
    const record = buildYearRecord({ anchor: [{ status: TransactionStatus.PAYMENT_SENT }] });

    expect(hasPaymentSentTransaction(record, CurrentYear.YEAR2024)).toStrictEqual([
      true,
      false,
      false,
    ]);
  });
  it("returns [0,1,0] for a record with ptr payment sent", () => {
    const record = buildYearRecord({ ptr: [{ status: TransactionStatus.PAYMENT_SENT }] });

    expect(hasPaymentSentTransaction(record, CurrentYear.YEAR2024)).toStrictEqual([
      false,
      true,
      false,
    ]);
  });
  it("returns [0,0,1] for a record with stay payment sent", () => {
    const record = buildYearRecord({ stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }] });

    expect(hasPaymentSentTransaction(record, CurrentYear.YEAR2024)).toStrictEqual([
      false,
      false,
      true,
    ]);
  });

  it("returns [1,1,0] for a record with anchor,ptr payment", () => {
    const record = buildYearRecord({
      anchor: [{ status: TransactionStatus.PAYMENT_SENT }],
      ptr: [{ status: TransactionStatus.PAYMENT_SENT }],
    });
    expect(hasPaymentSentTransaction(record, CurrentYear.YEAR2024)).toStrictEqual([
      true,
      true,
      false,
    ]);
  });
  it("returns [1,0,1] for a record with anchor,stay payment", () => {
    const record = buildYearRecord({
      anchor: [{ status: TransactionStatus.PAYMENT_SENT }],
      stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }],
    });
    expect(hasPaymentSentTransaction(record, CurrentYear.YEAR2024)).toStrictEqual([
      true,
      false,
      true,
    ]);
  });
  it("returns [0,1,1] for a record with ptr,stay payment", () => {
    const record = buildYearRecord({
      ptr: [{ status: TransactionStatus.PAYMENT_SENT }],
      stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }],
    });
    expect(hasPaymentSentTransaction(record, CurrentYear.YEAR2024)).toStrictEqual([
      false,
      true,
      true,
    ]);
  });
  it("returns [1,1,1] for a record with anchor,ptr,stay payment", () => {
    const record = buildYearRecord({
      anchor: [{ status: TransactionStatus.PAYMENT_SENT }],
      ptr: [{ status: TransactionStatus.PAYMENT_SENT }],
      stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }],
    });
    expect(hasPaymentSentTransaction(record, CurrentYear.YEAR2024)).toStrictEqual([
      true,
      true,
      true,
    ]);
  });
});

describe("hasPaymentSentTransaction (currentYear = 2025)", () => {
  it("returns [0,0,0] for no payments sent", () => {
    const record = buildYearRecord();

    expect(hasPaymentSentTransaction(record, CurrentYear.YEAR2025)).toStrictEqual([
      false,
      false,
      false,
    ]);
  });
  it("returns [1,0,0] for a record with anchor payment sent", () => {
    const record = buildYearRecord({ anchor: [{ status: TransactionStatus.PAYMENT_SENT }] });

    expect(hasPaymentSentTransaction(record, CurrentYear.YEAR2025)).toStrictEqual([
      true,
      false,
      false,
    ]);
  });
  it("returns [0,1,0] for a record with ptr payment sent", () => {
    const record = buildYearRecord({ ptr: [{ status: TransactionStatus.PAYMENT_SENT }] });

    expect(hasPaymentSentTransaction(record, CurrentYear.YEAR2025)).toStrictEqual([
      false,
      true,
      false,
    ]);
  });
  it("returns [0,0,0] for a record with stay payment sent", () => {
    const record = buildYearRecord({ stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }] });

    expect(hasPaymentSentTransaction(record, CurrentYear.YEAR2025)).toStrictEqual([
      false,
      false,
      false,
    ]);
  });

  it("returns [1,1,0] for a record with anchor,ptr payment", () => {
    const record = buildYearRecord({
      anchor: [{ status: TransactionStatus.PAYMENT_SENT }],
      ptr: [{ status: TransactionStatus.PAYMENT_SENT }],
    });
    expect(hasPaymentSentTransaction(record, CurrentYear.YEAR2025)).toStrictEqual([
      true,
      true,
      false,
    ]);
  });
  it("returns [1,0,0] for a record with anchor,stay payment", () => {
    const record = buildYearRecord({
      anchor: [{ status: TransactionStatus.PAYMENT_SENT }],
      stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }],
    });
    expect(hasPaymentSentTransaction(record, CurrentYear.YEAR2025)).toStrictEqual([
      true,
      false,
      false,
    ]);
  });
  it("returns [0,1,0] for a record with ptr,stay payment", () => {
    const record = buildYearRecord({
      ptr: [{ status: TransactionStatus.PAYMENT_SENT }],
      stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }],
    });
    expect(hasPaymentSentTransaction(record, CurrentYear.YEAR2025)).toStrictEqual([
      false,
      true,
      false,
    ]);
  });
  it("returns [1,1,0] for a record with anchor,ptr,stay payment", () => {
    const record = buildYearRecord({
      anchor: [{ status: TransactionStatus.PAYMENT_SENT }],
      ptr: [{ status: TransactionStatus.PAYMENT_SENT }],
      stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }],
    });
    expect(hasPaymentSentTransaction(record, CurrentYear.YEAR2025)).toStrictEqual([
      true,
      true,
      false,
    ]);
  });
});
