import { Transaction, AllTransactions, InquiryRow } from "./types";

const ANCHORCDE = "13";
const PTRCDE = "49";
const STAYNJCDE = "41";

export const buildTransaction = (
  TRANS_CDE: string,
  TRANS_STATUS_CDE: string,
  REVIEW_CATEGORY_CDE: string,
  CHECK_DTE: string,
  CHECK_AMT: number,
  CHECK_NUM: string,
): Transaction => {
  let status;
  if (TRANS_CDE === "RR" && TRANS_STATUS_CDE === "PR" && REVIEW_CATEGORY_CDE === null) {
    status = "processing";
  } else if (TRANS_CDE === "RR" && TRANS_STATUS_CDE === "PR" && REVIEW_CATEGORY_CDE !== null) {
    status = "issue_flagged";
  } else if (TRANS_CDE === "RR" && TRANS_STATUS_CDE.startsWith("AP")) {
    status = "approved";
  } else if (TRANS_CDE === "RF") {
    status = "payment_sent";
  } else {
    throw new Error(`Invalid TRANS_CDE: ${TRANS_CDE}`);
  }

  if (status === "issue_flagged") {
    return { status: status, review_category: REVIEW_CATEGORY_CDE };
  }

  if (status === "payment_sent") {
    let method;
    if (CHECK_NUM.slice(1, 3) === "NN") {
      method = "direct_deposit";
    } else if (CHECK_NUM.slice(1, 3)) {
      method = "check";
    } else {
      throw new Error(`Missing CHECK_NUM`);
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
    );

    const taxCode = row[`TRANS_${i}_TAX_CDE`];
    if (taxCode == ANCHORCDE) {
      anchor.push(transaction);
    } else if (taxCode == PTRCDE) {
      ptr.push(transaction);
    } else if (taxCode == STAYNJCDE) {
      stay_nj.push(transaction);
    } else {
      throw new Error(
        `Invalid transaction tax code: ${row[`TRANS_${i}_TAX_CDE`]} for transaction ${i}`,
      );
    }
  }
  return { anchor: anchor, ptr: ptr, stay_nj: stay_nj };
};
