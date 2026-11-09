import { setIssueFlagged } from "./setIssueFlagged";
import { FormCode } from "@/components/types";
import { hasPaymentSentTransaction } from "./hasPaymentSentTransaction";
import { CurrentYear, YearRecord } from "@/components/TaxReliefDataProvider";

/** Determines the route to navigate to based on the status record's transaction data. */
export const determineRoute = (record: YearRecord, currentYear: CurrentYear): string => {
  const [hasAnchorPayment, hasPtrPayment, hasStayPayment] = hasPaymentSentTransaction(record);
  if (hasAnchorPayment || hasPtrPayment || hasStayPayment) {
    return "/payment-info";
  }
  if (setIssueFlagged(record) !== undefined) {
    return "/more-information-needed";
  }

  if (currentYear === CurrentYear.YEAR2024) {
    return "/application-received";
  }
  return record.form_code === FormCode.ANC1
    ? "/anchor-application-received"
    : "/application-received";
};
