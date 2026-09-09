import { TransactionStatus } from "@/components/types";
import type { StatusRecord } from "@/components/types";
import { setIssueFlagged } from "./setIssueFlagged";

/** Determines the route to navigate to based on the status record's transaction data. */
export const determineRoute = (record: StatusRecord): string => {
  const hasPaymentSentTransaction = [...record.ptr].some(
    (transaction) => transaction.status === TransactionStatus.PAYMENT_SENT,
  );

  if (hasPaymentSentTransaction) {
    return "/payment-info";
  }

  if (setIssueFlagged(record) !== undefined) {
    return "/more-information-needed";
  }

  return "/application-received";
};
