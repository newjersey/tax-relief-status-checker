import { YearRecord } from "@/components/TaxReliefDataProvider";
import { FormCode, PaymentMethod, TransactionStatus } from "@/components/types";

export const buildYearRecord = (overrides?: Partial<YearRecord>): YearRecord => ({
  return_year: "2025",
  application_date: "2026-03-19T00:00:00.000Z",
  form_code: FormCode.PAS1,
  anchor: [],
  ptr: [],
  stay_nj: [],
  stay_eligible_rebate: 1500,
  anchor_eligible_rebate: 1750,
  ...overrides,
});

export const paymentApprovedTransaction = { status: TransactionStatus.APPROVED };

export const paymentSentTransaction = {
  status: TransactionStatus.PAYMENT_SENT,
  payment_details: {
    amount: 377.56,
    date: "7/6/2026 0:00:00",
    method: PaymentMethod.CHECK,
    check_number: "922775385",
  },
};
