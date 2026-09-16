import { describe, it, expect } from "vitest";
import { StatusRecord, FormCode, TransactionStatus } from "@/components/types";
import { hasPaymentSentTransaction } from "./hasPaymentSentTransaction";

const buildStatusRecord = (overrides?: Partial<StatusRecord>): StatusRecord => ({
  return_year: "2025",
  application_date: "2026-03-19T00:00:00.000Z",
  form_code: FormCode.PAS1,
  anchor: [],
  ptr: [],
  stay_nj: [],
  ...overrides,
});

describe("hasPaymentSentTransaction", () => {
  it("returns [0,0,0] for no payments sent", () => {
    const record = buildStatusRecord();

    expect(hasPaymentSentTransaction(record)).toStrictEqual([false, false, false]);
  });
  it("returns [1,0,0] for a record with anchor payment sent", () => {
    const record = buildStatusRecord({ anchor: [{ status: TransactionStatus.PAYMENT_SENT }] });

    expect(hasPaymentSentTransaction(record)).toStrictEqual([true, false, false]);
  });
  it("returns [0,1,0] for a record with ptr payment sent", () => {
    const record = buildStatusRecord({ ptr: [{ status: TransactionStatus.PAYMENT_SENT }] });

    expect(hasPaymentSentTransaction(record)).toStrictEqual([false, true, false]);
  });
  it("returns [0,0,0] for a record with stay payment sent (feature flag false)", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_STAY", "false");
    const record = buildStatusRecord({ stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }] });

    expect(hasPaymentSentTransaction(record)).toStrictEqual([false, false, false]);
    vi.unstubAllEnvs();
  });
  it("returns [0,0,1] for a record with stay payment sent (feature flag true)", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_STAY", "true");
    const record = buildStatusRecord({ stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }] });

    expect(hasPaymentSentTransaction(record)).toStrictEqual([false, false, true]);
    vi.unstubAllEnvs();
  });
  it("returns [1,1,0] for a record with anchor,ptr payment", () => {
    const record = buildStatusRecord({
      anchor: [{ status: TransactionStatus.PAYMENT_SENT }],
      ptr: [{ status: TransactionStatus.PAYMENT_SENT }],
    });
    expect(hasPaymentSentTransaction(record)).toStrictEqual([true, true, false]);
  });
  it("returns [1,0,1] for a record with anchor,stay payment (feature flag true)", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_STAY", "true");

    const record = buildStatusRecord({
      anchor: [{ status: TransactionStatus.PAYMENT_SENT }],
      stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }],
    });
    expect(hasPaymentSentTransaction(record)).toStrictEqual([true, false, true]);
    vi.unstubAllEnvs;
  });
  it("returns [0,1,1] for a record with ptr,stay payment (feature flag true)", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_STAY", "true");

    const record = buildStatusRecord({
      ptr: [{ status: TransactionStatus.PAYMENT_SENT }],
      stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }],
    });
    expect(hasPaymentSentTransaction(record)).toStrictEqual([false, true, true]);
    vi.unstubAllEnvs;
  });
  it("returns [1,1,1] for a record with anchor,ptr,stay payment (feature flag true)", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_STAY", "true");

    const record = buildStatusRecord({
      anchor: [{ status: TransactionStatus.PAYMENT_SENT }],
      ptr: [{ status: TransactionStatus.PAYMENT_SENT }],
      stay_nj: [{ status: TransactionStatus.PAYMENT_SENT }],
    });
    expect(hasPaymentSentTransaction(record)).toStrictEqual([true, true, true]);
    vi.unstubAllEnvs;
  });
});
