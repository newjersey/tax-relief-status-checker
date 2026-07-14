import { describe, it, expect } from "vitest";

import { getEarliestTransaction } from "./page";

const payment_sent_transaction = {
  status: "payment_sent",
  payment_details: {
    amount: 377.56,
    date: "7/6/2026 0:00:00",
    method: "check",
    check_number: "922775385",
  },
};

describe("getEarliestTransaction", () => {
  it("returns null for no transactions", () => {
    expect(getEarliestTransaction([])).toBeNull();
  });

  it("returns null for no valid transactions", () => {
    expect(
      getEarliestTransaction([
        {
          status: "processing",
        },
      ]),
    ).toBeNull();
  });

  it("returns the first transaction for 1 valid transaction", () => {
    expect(getEarliestTransaction([payment_sent_transaction])).toEqual(payment_sent_transaction);
  });

  it("returns the earliest dated transaction for multiple valid transaction", () => {
    expect(
      getEarliestTransaction([
        payment_sent_transaction,
        {
          status: "payment_sent",
          payment_details: {
            amount: 377.56,
            date: "1/1/2026 0:00:00",
            method: "check",
            check_number: "922775385",
          },
        },
      ]),
    ).toEqual({
      status: "payment_sent",
      payment_details: {
        amount: 377.56,
        date: "1/1/2026 0:00:00",
        method: "check",
        check_number: "922775385",
      },
    });
  });
});
