import { expect } from "vitest";

export const payment_sent_transaction = {
  status: "payment_sent",
  payment_details: {
    amount: 377.56,
    date: "7/6/2026 0:00:00",
    method: "check",
    check_number: "922775385",
  },
};

export const earlier_transaction = {
  status: "payment_sent",
  payment_details: {
    amount: 10.0,
    date: "1/1/2026 0:00:00",
    method: "direct_deposit",
    check_number: "9NN775385",
  },
};

export const stayQ1Start = {
  status: "payment_sent",
  payment_details: {
    amount: 377.56,
    date: "01/01/2027 0:00:00",
    method: "check",
    check_number: "922775385",
  },
};

export const stayQ1End = {
  status: "payment_sent",
  payment_details: {
    amount: 377.56,
    date: "04/30/2027 0:00:00",
    method: "check",
    check_number: "922775385",
  },
};

export const stayQ2Start = {
  status: "payment_sent",
  payment_details: {
    amount: 377.56,
    date: "05/01/2027 0:00:00",
    method: "check",
    check_number: "922775385",
  },
};

export const stayQ2End = {
  status: "payment_sent",
  payment_details: {
    amount: 377.56,
    date: "07/31/2027 0:00:00",
    method: "check",
    check_number: "922775385",
  },
};

export const stayQ3Start = {
  status: "payment_sent",
  payment_details: {
    amount: 377.56,
    date: "08/01/2027 0:00:00",
    method: "check",
    check_number: "922775385",
  },
};

export const stayQ3End = {
  status: "payment_sent",
  payment_details: {
    amount: 377.56,
    date: "10/31/2027 0:00:00",
    method: "check",
    check_number: "922775385",
  },
};

export const stayQ4Start = {
  status: "payment_sent",
  payment_details: {
    amount: 377.56,
    date: "11/01/2027 0:00:00",
    method: "check",
    check_number: "922775385",
  },
};

export const stayQ4End = {
  status: "payment_sent",
  payment_details: {
    amount: 377.56,
    date: "12/31/2027 0:00:00",
    method: "check",
    check_number: "922775385",
  },
};

export const error_payment_sent_transaction = {
  status: "payment_sent",
};

export enum PaymentType {
  ADJUSTED = "adjusted",
  DIRECT_DEPOSIT = "direct_deposit",
  CHECK = "check",
}

export const checkTransactionInfo = (
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
