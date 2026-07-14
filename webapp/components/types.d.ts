export interface Transaction {
  readonly status: string;
  readonly review_category?: string;
  readonly payment_details?: {
    readonly amount: number;
    readonly date: string;
    readonly method: string;
    readonly check_number?: string;
  };
}
