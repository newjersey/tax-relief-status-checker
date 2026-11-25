import { CurrentYear, YearRecord } from "@/components/TaxReliefDataProvider";
import { EstimatedEligibilityType, TransactionStatus } from "@/components/types";
import { hasPaymentSentTransaction } from "./hasPaymentSentTransaction";

export const shouldShowEstimatedTransaction = (
  record: YearRecord,
  currentYear: CurrentYear,
): EstimatedEligibilityType => {
  if (currentYear !== CurrentYear.YEAR2025) {
    return EstimatedEligibilityType.NOT_ELIGIBLE;
  }

  const [hasAnchorPayment, hasPTRPayment] = hasPaymentSentTransaction(record, currentYear);

  const anchorApproved =
    record.anchor.length === 1 && record.anchor[0]?.status === TransactionStatus.APPROVED;

  const stayApproved =
    record.stay_nj.length === 1 && record.stay_nj[0]?.status === TransactionStatus.APPROVED;

  const ptrApproved = record.ptr.some(
    (transaction) => transaction?.status === TransactionStatus.APPROVED,
  );

  const ptrApprovedOrPaid = ptrApproved || hasPTRPayment;

  if (anchorApproved && stayApproved) return EstimatedEligibilityType.BOTH_ELIGIBLE;
  if (anchorApproved) return EstimatedEligibilityType.ANCHOR_ELIGIBLE;

  if (stayApproved) {
    if (ptrApprovedOrPaid && !hasAnchorPayment) {
      return EstimatedEligibilityType.NOT_ELIGIBLE;
    } else {
      return EstimatedEligibilityType.STAY_ELIGIBLE;
    }
  }

  return EstimatedEligibilityType.NOT_ELIGIBLE;
};
