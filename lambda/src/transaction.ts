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

const anchorCDE = 13;
const ptrCDE = 49;
const stayCDE = 41;

export const buildTransaction = (
  TRANS_CDE: string,
  TRANS_STATUS_CDE: string,
  REVIEW_CATEGORY_CDE: string,
  CHECK_DTE: string,
  CHECK_AMT: number,
  CHECK_NUM: string,
  DIRECT_DEPOSIT_IND: string,
): Transaction => {
  let status;
  if (TRANS_CDE == "RR" && TRANS_STATUS_CDE == "PR" && REVIEW_CATEGORY_CDE === null) {
    status = "Processing";
  } else if (TRANS_CDE == "RR" && TRANS_STATUS_CDE == "PR" && REVIEW_CATEGORY_CDE !== null) {
    status = "Issue Flagged";
  } else if (TRANS_CDE == "RR" && TRANS_STATUS_CDE.startsWith("AP")) {
    status = "Approved";
  } else {
    status = "Payment Sent";
  }

  if (status === "Issue Flagged") {
    return { status: status, review_category: REVIEW_CATEGORY_CDE };
  }

  if (status === "Payment Sent") {
    let method = "check";
    if (DIRECT_DEPOSIT_IND === "Y") {
      method = "direct_deposit";
    }
    const payment_details = {
      amount: CHECK_AMT,
      date: CHECK_DTE,
      method: method,
      check_number: CHECK_NUM,
    };
    return { status: status, payment_details: payment_details };
  }
  return { status: status };
};

export const buildAllTransactions = (row: InquiryRow): AllTransactions => {
  const anchor = [];
  const ptr = [];
  const stay_nj = [];
  for (let i = 1; i <= row.TRANS_TOTAL_NUM; i++) {
    const transaction = buildTransaction(
      row[`TRANS_${i}_CDE`] as string,
      row[`TRANS_STATUS_${i}_CDE`] as string,
      row[`REVIEW_CATEGORY_${i}_CDE`] as string,
      row[`CHECK_${i}_DTE`] as string,
      row[`CHECK_${i}_AMT`] as number,
      row[`CHECK_${i}_NUM`] as string,
      row[`DIRECT_DEPOSIT_IND`] as string,
    );
    if (row[`TRANS_${i}_TAX_CDE`] == anchorCDE) {
      anchor.push(transaction);
    } else if (row[`TRANS_${i}_TAX_CDE`] == ptrCDE) {
      ptr.push(transaction);
    } else if (row[`TRANS_${i}_TAX_CDE`] == stayCDE) {
      stay_nj.push(transaction);
    } else {
      throw new Error("No Transaction Tax Code");
    }
  }
  return { anchor: anchor, ptr: ptr, stay_nj: stay_nj };
};
