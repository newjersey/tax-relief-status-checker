export interface Transaction {
  readonly status: string;
  readonly review_category?: string;
  readonly payment_details?: {
    readonly amount: number;
    readonly date: string;
    readonly method: string;
    readonly check_number: string;
  };
}

export interface AllTransactions {
  readonly anchor: Transaction[];
  readonly ptr: Transaction[];
  readonly stay_nj: Transaction[];
}

/** Database row from ELF_SAVER_INQUIRY */
export interface InquiryRow {
  readonly SOCIAL_SECURITY_NUMBER_IDN: string;
  readonly ZIP_ADR: string;
  readonly RNY_APPLIED_DTE: string;
  readonly RETURN_YEAR_DTE: number;
  readonly TRANS_TOTAL_NUM: number;
  readonly [key: string]: unknown;
}
