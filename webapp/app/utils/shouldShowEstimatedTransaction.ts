import { CurrentYear, YearRecord } from "@/components/TaxReliefDataProvider";
import { EstimatedEligibilityType, TransactionStatus } from "@/components/types";

export const shouldShowEstimatedTransaction = (
  record: YearRecord,
  currentYear: CurrentYear,
): EstimatedEligibilityType => {
  if (
    record.anchor.length > 0 &&
    currentYear === CurrentYear.YEAR2025 &&
    record.anchor[0].status === TransactionStatus.APPROVED
  ) {
    return EstimatedEligibilityType.ANCHOR_ELIGIBLE;
  }
  return EstimatedEligibilityType.NOT_ELIGIBLE;
};
