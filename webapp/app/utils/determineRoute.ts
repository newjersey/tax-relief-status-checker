import type { StatusRecord } from "@/components/types";
import { setIssueFlagged } from "./setIssueFlagged";
import { FormCode } from "@/components/types";
import { hasPaymentSentTransaction } from "./hasPaymentSentTransaction";

/** Determines the route to navigate to based on the status record's transaction data. */
export const determineRoute = (record: StatusRecord): string => {
  const [hasAnchorPayment, hasPtrPayment, hasStayPayment] = hasPaymentSentTransaction(record);
  if (hasAnchorPayment || hasPtrPayment || hasStayPayment) {
    return "/payment-info";
  }
  if (setIssueFlagged(record) !== undefined) {
    return "/more-information-needed";
  }
  return record.form_code === FormCode.ANC1
    ? "/anchor-application-received"
    : "/application-received";
};
