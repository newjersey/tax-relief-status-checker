export interface Transaction {
  readonly status: TransactionStatus;
  readonly review_category?: string;
  readonly payment_details?: {
    readonly amount: number;
    readonly date: string;
    readonly method: PaymentMethod;
    readonly check_number?: string;
  };
}

enum PaymentMethod {
  DIRECT_DEPOSIT = "direct_deposit",
  CHECK = "check",
}

export interface PaymentDetails {
  readonly amount: number;
  readonly date: Date;
  readonly method: PaymentMethod;
  readonly check_number: string;
}

export enum TransactionStatus {
  PAYMENT_SENT = "payment_sent",
  PROCESSING = "processing",
  ISSUE_FLAGGED = "issue_flagged",
  APPROVED = "approved",
}

export enum IssueFlaggedType {
  PROPERTY_TAX_BILL_NEEDED,
  CONTACT_TAXATION,
}
