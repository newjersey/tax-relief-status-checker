import { YearRecord } from "@/components/TaxReliefDataProvider";
import { StatusRecord, TransactionStatus } from "@/components/types";

/** Returns an boolean array based on a records payment sent transaction per program */
export const hasPaymentSentTransaction = (record: YearRecord | StatusRecord): boolean[] => {
  const hasAnchorPayment = [...record.anchor].some(
    (transaction) => transaction.status === TransactionStatus.PAYMENT_SENT,
  );
  const hasPTRPayment = [...record.ptr].some(
    (transaction) => transaction.status === TransactionStatus.PAYMENT_SENT,
  );

  let hasStayPayment = false;
  if (process.env.NEXT_PUBLIC_ENABLE_STAY == "true") {
    hasStayPayment = [...record.stay_nj].some(
      (transaction) => transaction.status === TransactionStatus.PAYMENT_SENT,
    );
  }

  return [hasAnchorPayment, hasPTRPayment, hasStayPayment];
};
