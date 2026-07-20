import { describe, it, expect } from "vitest";

import {
  getEarliestTransaction,
  showEarliestTransaction,
  showUpdatedTransaction,
  sortStayNJTransactions,
} from "./page";

const payment_sent_transaction = {
  status: "payment_sent",
  payment_details: {
    amount: 377.56,
    date: "7/6/2026 0:00:00",
    method: "check",
    check_number: "922775385",
  },
};

const stayQ1 = {
  status: "payment_sent",
  payment_details: {
    amount: 377.56,
    date: "01/01/2027 0:00:00",
    method: "check",
    check_number: "922775385",
  },
};

const stayQ2 = {
  status: "payment_sent",
  payment_details: {
    amount: 377.56,
    date: "05/01/2027 0:00:00",
    method: "check",
    check_number: "922775385",
  },
};

const stayQ3 = {
  status: "payment_sent",
  payment_details: {
    amount: 377.56,
    date: "08/01/2027 0:00:00",
    method: "check",
    check_number: "922775385",
  },
};

const stayQ4 = {
  status: "payment_sent",
  payment_details: {
    amount: 377.56,
    date: "11/01/2027 0:00:00",
    method: "check",
    check_number: "922775385",
  },
};

const error_payment_sent_transaction = {
  status: "payment_sent",
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

describe("showEarliestTransaction", () => {
  it("shows check sent on if method is check", () => {
    const result = showEarliestTransaction(payment_sent_transaction, "ANCHOR");
    expect(result?.props.children[0].props.children).toBe("ANCHOR");
    expect(result?.props.children[1].props.children).toStrictEqual([
      "Check issued on ",
      "07/06/2026",
    ]);
    expect(result?.props.children[2].props.children).toStrictEqual(["$", 377.56]);
  });

  it("shows direct deposit made on if method is direct_deposit", () => {
    const transaction = payment_sent_transaction;
    transaction.payment_details.method = "direct_deposit";
    const result = showEarliestTransaction(transaction, "ANCHOR");
    expect(result?.props.children[0].props.children).toBe("ANCHOR");
    expect(result?.props.children[1].props.children).toStrictEqual([
      "Direct deposit made on ",
      "07/06/2026",
    ]);
    expect(result?.props.children[2].props.children).toStrictEqual(["$", 377.56]);
  });

  it("returns nothing if there is no payment_details", () => {
    expect(showEarliestTransaction(error_payment_sent_transaction, "ANCHOR")).toBeNull;
  });
});

describe("showUpdatedTransaction", () => {
  it("shows your benefit amount was adjusted if check has payment details", () => {
    const result = showUpdatedTransaction(payment_sent_transaction, "ANCHOR");
    expect(result?.props.children[0].props.children).toBe("ANCHOR");
    expect(result?.props.children[1].props.children.text).toStrictEqual([
      "Your benefit amount was adjusted. A check was sent on",
      " ",
      "07/06/2026",
    ]);
    console.log(result);
    expect(result?.props.children[2].props.children[0].props.children).toStrictEqual(["$", 377.56]);
  });

  it("returns nothing if there is no payment_details", () => {
    expect(showUpdatedTransaction(error_payment_sent_transaction, "ANCHOR")).toBeNull;
  });
});

describe("sortStayNJTransaction", () => {
  describe("for ONE transaction", () => {
    it("puts transaction with payment_date in bucket for range 1/1 to 4/31", () => {
      expect(sortStayNJTransactions([stayQ1])).toEqual([[stayQ1], [], [], []]);
    });
    it("puts transaction with payment_date in bucket for range 5/1 to 7/31", () => {
      expect(sortStayNJTransactions([stayQ2])).toEqual([[], [stayQ2], [], []]);
    });
    it("puts transaction with payment_date in bucket for range 8/1 to 10/31", () => {
      expect(sortStayNJTransactions([stayQ3])).toEqual([[], [], [stayQ3], []]);
    });
    it("puts transaction with payment_date in bucket for range 11/1 to 12/31", () => {
      expect(sortStayNJTransactions([stayQ4])).toEqual([[], [], [], [stayQ4]]);
    });
  });

  describe("for MANY transactions", () => {
    it("puts transactions into date range respective buckets", () => {
      expect(sortStayNJTransactions([stayQ1, stayQ2, stayQ3, stayQ4])).toEqual([
        [stayQ1],
        [stayQ2],
        [stayQ3],
        [stayQ4],
      ]);
    });
  });
});
