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

export interface TransactionWithProgram {
  readonly transaction: Transaction[];
  readonly taxProgram: TaxProgram;
}

export enum PaymentMethod {
  DIRECT_DEPOSIT = "direct_deposit",
  CHECK = "check",
}

export enum TaxProgram {
  ANCHOR = "ANCHOR",
  PTR = "Senior Freeze",
  STAY_NJ = "Stay NJ",
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
