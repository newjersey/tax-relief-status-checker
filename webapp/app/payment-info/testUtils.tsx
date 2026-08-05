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

export const error_payment_sent_transaction = {
  status: TransactionStatus.PAYMENT_SENT,
};
