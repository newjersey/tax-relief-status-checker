import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import {
  getEarliestTransaction,
  showProgramTransactions,
  showEarliestTransaction,
  showUpdatedTransaction,
  sortStayNJTransactionsByQuarter,
} from "./page";
import { render } from "@testing-library/react";
import { formatDate } from "../utils/formatDate";
import {
  payment_sent_transaction,
  earlier_transaction,
  stayQ1Start,
  stayQ1End,
  stayQ2Start,
  stayQ2End,
  stayQ3Start,
  stayQ3End,
  stayQ4Start,
  stayQ4End,
  error_payment_sent_transaction,
} from "./testUtils";
import { PaymentMethod, TaxProgram, TransactionStatus } from "@/components/types";

export enum PaymentType {
  ADJUSTED = "adjusted",
  DIRECT_DEPOSIT = "direct_deposit",
  CHECK = "check",
}

const checkTransactionInfo = (
  rowHTML: string,
  category: string,
  date: string,
  amount: number,
  paymentType: PaymentType,
) => {
  if (paymentType === PaymentType.ADJUSTED) {
    expect(rowHTML).toContain(`<td>${category}</td>`);
    expect(rowHTML).toContain(`Your benefit amount was adjusted. A check was sent on ${date}`);
    expect(rowHTML).toContain(`<td>$${amount}</td>`);
  } else if (paymentType === PaymentType.DIRECT_DEPOSIT) {
    expect(rowHTML).toContain(`<td>${category}</td>`);
    expect(rowHTML).toContain(`<td>Direct deposit made on ${date}</td>`);
    expect(rowHTML).toContain(`<td>$${amount}</td>`);
  } else if (paymentType === PaymentType.CHECK) {
    expect(rowHTML).toContain(`<td>${category}</td>`);
    expect(rowHTML).toContain(`<td>Check issued on ${date}</td>`);
    expect(rowHTML).toContain(`<td>$${amount}</td>`);
  }
};

describe("getEarliestTransaction", () => {
  it("returns null for no transactions", () => {
    expect(getEarliestTransaction([])).toBeNull();
  });

  it("returns null for no valid transactions", () => {
    expect(
      getEarliestTransaction([
        {
          status: TransactionStatus.PROCESSING,
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
          status: TransactionStatus.PAYMENT_SENT,
          payment_details: {
            amount: 377.56,
            date: "1/1/2026 0:00:00",
            method: PaymentMethod.CHECK,
            check_number: "922775385",
          },
        },
      ]),
    ).toEqual({
      status: TransactionStatus.PAYMENT_SENT,
      payment_details: {
        amount: 377.56,
        date: "1/1/2026 0:00:00",
        method: PaymentMethod.CHECK,
        check_number: "922775385",
      },
    });
  });
});

describe("showEarliestTransaction", () => {
  it("shows correct message when method is check", () => {
    const result = showEarliestTransaction(payment_sent_transaction, TaxProgram.ANCHOR);
    const html = renderToStaticMarkup(result);
    checkTransactionInfo(
      html,
      "ANCHOR",
      formatDate(payment_sent_transaction.payment_details.date),
      payment_sent_transaction.payment_details.amount,
      PaymentType.CHECK,
    );
  });

  it("shows correct message when method is direct deposit", () => {
    const transaction = payment_sent_transaction;
    transaction.payment_details.method = PaymentMethod.DIRECT_DEPOSIT;
    const result = showEarliestTransaction(transaction, TaxProgram.ANCHOR);
    const html = renderToStaticMarkup(result);
    checkTransactionInfo(
      html,
      "ANCHOR",
      formatDate(payment_sent_transaction.payment_details.date),
      payment_sent_transaction.payment_details.amount,
      PaymentType.DIRECT_DEPOSIT,
    );
  });

  it("returns nothing if there is no payment_details", () => {
    expect(showEarliestTransaction(error_payment_sent_transaction, TaxProgram.ANCHOR)).toBeNull;
  });
});

describe("showUpdatedTransaction", () => {
  it("shows 'your benefit amount was adjusted' if check has payment details", () => {
    const result = showUpdatedTransaction(payment_sent_transaction, TaxProgram.ANCHOR);
    const html = renderToStaticMarkup(result);
    checkTransactionInfo(
      html,
      "ANCHOR",
      formatDate(payment_sent_transaction.payment_details.date),
      payment_sent_transaction.payment_details.amount,
      PaymentType.ADJUSTED,
    );
  });

  it("returns nothing if there is no payment_details", () => {
    expect(showUpdatedTransaction(error_payment_sent_transaction, TaxProgram.ANCHOR)).toBeNull;
  });
});

describe("showAllTransactions", () => {
  it("shows first check and update payments for specified transaction", () => {
    const result = showProgramTransactions(
      [payment_sent_transaction, earlier_transaction],
      TaxProgram.ANCHOR,
    );
    render(result);
    const tableRows = document.body.querySelectorAll("tr");
    expect(tableRows.length).toEqual(2);
    checkTransactionInfo(
      tableRows[1].innerHTML.toString(),
      "ANCHOR",
      formatDate(payment_sent_transaction.payment_details.date),
      payment_sent_transaction.payment_details.amount,
      PaymentType.ADJUSTED,
    );
    checkTransactionInfo(
      tableRows[0].innerHTML.toString(),
      "ANCHOR",
      formatDate(earlier_transaction.payment_details.date),
      earlier_transaction.payment_details.amount,
      PaymentType.DIRECT_DEPOSIT,
    );
  });

  it("returns nothing if there is no payment_details", () => {
    expect(showUpdatedTransaction(error_payment_sent_transaction, TaxProgram.ANCHOR)).toBeNull;
  });
});

describe("sortStayNJTransactionByQuater", () => {
  describe("for ONE transaction", () => {
    it("puts transaction with payment_date in bucket for range 1/1 to 4/31", () => {
      expect(sortStayNJTransactionsByQuarter([stayQ1Start])).toEqual([[stayQ1Start], [], [], []]);
      expect(sortStayNJTransactionsByQuarter([stayQ1End])).toEqual([[stayQ1End], [], [], []]);
    });
    it("puts transaction with payment_date in bucket for range 5/1 to 7/31", () => {
      expect(sortStayNJTransactionsByQuarter([stayQ2Start])).toEqual([[], [stayQ2Start], [], []]);
      expect(sortStayNJTransactionsByQuarter([stayQ2End])).toEqual([[], [stayQ2End], [], []]);
    });
    it("puts transaction with payment_date in bucket for range 8/1 to 10/31", () => {
      expect(sortStayNJTransactionsByQuarter([stayQ3Start])).toEqual([[], [], [stayQ3Start], []]);
      expect(sortStayNJTransactionsByQuarter([stayQ3End])).toEqual([[], [], [stayQ3End], []]);
    });
    it("puts transaction with payment_date in bucket for range 11/1 to 12/31", () => {
      expect(sortStayNJTransactionsByQuarter([stayQ4Start])).toEqual([[], [], [], [stayQ4Start]]);
      expect(sortStayNJTransactionsByQuarter([stayQ4End])).toEqual([[], [], [], [stayQ4End]]);
    });
  });

  describe("for multiple transactions per bucket", () => {
    it("puts transactions into date range respective buckets", () => {
      expect(
        sortStayNJTransactionsByQuarter([
          stayQ1Start,
          stayQ2Start,
          stayQ3Start,
          stayQ4Start,
          stayQ1End,
          stayQ2End,
          stayQ3End,
          stayQ4End,
        ]),
      ).toEqual([
        [stayQ1Start, stayQ1End],
        [stayQ2Start, stayQ2End],
        [stayQ3Start, stayQ3End],
        [stayQ4Start, stayQ4End],
      ]);
    });
  });
});
