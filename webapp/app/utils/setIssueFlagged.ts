import { IssueFlaggedType, Transaction, TransactionStatus } from "@/components/types";
import { StatusRecord } from "../page";

const ISSUE_FLAGGED_TAX_BILL_NEEDED_REVIEW_CATEGORIES = ["MOD", "MDZ"];
const ISSUE_FLAGGED_CONTACT_TAXATION_REVIEW_CATEGORIES = ["MAX", "MHX", "PCT", "DSU", "DSO"];

export const setIssueFlagged = (record: StatusRecord): undefined | IssueFlaggedType => {
  if (hasReviewCategory(record.ptr, ["SVR"])) {
    if (hasReviewCategory(record.anchor, ISSUE_FLAGGED_TAX_BILL_NEEDED_REVIEW_CATEGORIES)) {
      return IssueFlaggedType.PROPERTY_TAX_BILL_NEEDED;
    } else if (hasReviewCategory(record.anchor, ISSUE_FLAGGED_CONTACT_TAXATION_REVIEW_CATEGORIES)) {
      return IssueFlaggedType.CONTACT_TAXATION;
    }
  }
};

const hasReviewCategory = (transactionList: Transaction[], reviewCategory: string[]): boolean => {
  for (const t of transactionList) {
    if (
      t.status === TransactionStatus.ISSUE_FLAGGED &&
      reviewCategory.includes(t.review_category!)
    ) {
      return true;
    }
  }
  return false;
};
