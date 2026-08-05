import { TransactionStatus } from "@/components/types";
import { PaymentMethod } from "@/components/types";

export const payment_sent_transaction = {
  status: TransactionStatus.PAYMENT_SENT,
  payment_details: {
    amount: 377.56,
    date: "7/6/2026 0:00:00",
    method: PaymentMethod.CHECK,
    check_number: "922775385",
  },
};

export const earlier_transaction = {
  status: TransactionStatus.PAYMENT_SENT,
  payment_details: {
    amount: 10.0,
    date: "1/1/2026 0:00:00",
    method: PaymentMethod.DIRECT_DEPOSIT,
    check_number: "9NN775385",
  },
};

export const stayQ1Start = {
  status: TransactionStatus.PAYMENT_SENT,
  payment_details: {
    amount: 377.56,
    date: "2027-01-01T05:00:00.000Z",
    method: PaymentMethod.CHECK,
    check_number: "922775385",
  },
};

export const stayQ1End = {
  status: TransactionStatus.PAYMENT_SENT,
  payment_details: {
    amount: 377.56,
    date: "2027-05-01T04:59:59.000Z",
    method: PaymentMethod.CHECK,
    check_number: "922775385",
  },
};

export const stayQ2Start = {
  status: TransactionStatus.PAYMENT_SENT,
  payment_details: {
    amount: 377.56,
    date: "2027-05-01T05:00:00.000Z",
    method: PaymentMethod.CHECK,
    check_number: "922775385",
  },
};

export const stayQ2End = {
  status: TransactionStatus.PAYMENT_SENT,
  payment_details: {
    amount: 377.56,
    date: "2027-08-01T04:59:59.000Z",
    method: PaymentMethod.CHECK,
    check_number: "922775385",
  },
};

export const stayQ3Start = {
  status: TransactionStatus.PAYMENT_SENT,
  payment_details: {
    amount: 377.56,
    date: "2027-08-01T05:00:00.000Z",
    method: PaymentMethod.CHECK,
    check_number: "922775385",
  },
};

export const stayQ3End = {
  status: TransactionStatus.PAYMENT_SENT,
  payment_details: {
    amount: 377.56,
    date: "2027-11-01T04:59:59.000Z",
    method: PaymentMethod.CHECK,
    check_number: "922775385",
  },
};

export const stayQ4Start = {
  status: TransactionStatus.PAYMENT_SENT,
  payment_details: {
    amount: 377.56,
    date: "2027-11-01T5:00:00.000Z",
    method: PaymentMethod.CHECK,
    check_number: "922775385",
  },
};

export const stayQ4End = {
  status: TransactionStatus.PAYMENT_SENT,
  payment_details: {
    amount: 377.56,
    date: "2028-01-01T03:59:59.000Z",
    method: PaymentMethod.CHECK,
    check_number: "922775385",
  },
};

export const error_payment_sent_transaction = {
  status: TransactionStatus.PAYMENT_SENT,
};
