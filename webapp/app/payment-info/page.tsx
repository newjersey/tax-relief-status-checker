"use client";

import { JSX, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CurrentYear,
  DataType,
  useDataStore,
  YearRecord,
} from "@/components/TaxReliefDataProvider";
import { Button, Table } from "@trussworks/react-uswds";
import { formatDate } from "../utils/formatDate";
import { PASPaymentInfoFaqContent } from "@/app/payment-info/PASPaymentInfoFaqContent";
import { ANCPaymentInfoFaqContent } from "./ANCPaymentInfoFaqContent";
import { FaqSection } from "@/components/FaqSection";
import {
  Transaction,
  TaxProgram,
  PaymentMethod,
  TransactionStatus,
  FormCode,
  EstimatedEligibilityType,
} from "@/components/types";
import { TaxpayerInfoHeader } from "@/components/TaxpayerInfoHeader";
import { useTranslation, Trans } from "react-i18next";
import { PaymentInfoFaqContent2024 } from "./PaymentInfoFaqContent2024";
import { formatCheckAmount } from "../utils/formatCheckAmount";
import { shouldShowEstimatedTransaction } from "../utils/shouldShowEstimatedTransaction";

export const getEarliestTransaction = (transactions: Transaction[]) => {
  const valid = transactions.filter(
    (t) => t.status === TransactionStatus.PAYMENT_SENT && t.payment_details,
  );
  if (valid.length === 0) return null;
  if (valid.length === 1) return valid[0];

  let earliestTransaction = valid[0];
  for (let i = 1; i < valid.length; i++) {
    if (valid[i].payment_details != null) {
      if (
        new Date(valid[i].payment_details!.date) <
        new Date(earliestTransaction.payment_details!.date)
      ) {
        earliestTransaction = valid[i];
      }
    }
  }
  return earliestTransaction;
};

export const showRegularTransaction = (transaction: Transaction, taxProgram: TaxProgram) => {
  if (!transaction?.payment_details) return null;
  return (
    <tr>
      <td>{taxProgram}</td>
      {transaction.payment_details.method === PaymentMethod.CHECK ? (
        <td>
          <Trans
            i18nKey="payment.check"
            ns="paymentInfo"
            values={{ date: formatDate(transaction.payment_details.date) }}
          />
        </td>
      ) : (
        <td>
          <Trans
            i18nKey="payment.directDeposit"
            ns="paymentInfo"
            values={{ date: formatDate(transaction.payment_details.date) }}
          />
        </td>
      )}
      <td>${formatCheckAmount(transaction.payment_details.amount)}</td>
    </tr>
  );
};

export const showUpdatedTransaction = (
  transaction: Transaction,
  taxProgram: TaxProgram,
): JSX.Element | null => {
  if (!transaction?.payment_details) return null;
  return (
    <tr>
      <td>{taxProgram}</td>
      <td>
        <div className="transaction-table--payment-status">
          <Trans
            i18nKey="payment.update"
            ns="paymentInfo"
            values={{ date: formatDate(transaction.payment_details.date) }}
          />
        </div>
      </td>
      <td>${formatCheckAmount(transaction.payment_details.amount)}</td>
    </tr>
  );
};

export const showEstimatedTransaction = (
  taxProgram: TaxProgram,
  estimationAmount: number,
): JSX.Element | null => {
  if (taxProgram === TaxProgram.ANCHOR) {
    return (
      <tr>
        <td>{taxProgram}</td>
        <td>
          <div className="transaction-table--payment-status">
            <Trans i18nKey="anchorEstimatedPaymentStatus" ns="paymentInfo" />
          </div>
        </td>
        <td>
          <Trans
            i18nKey="estimatedAmount"
            ns="paymentInfo"
            values={{ amount: formatCheckAmount(estimationAmount) }}
          />
        </td>
      </tr>
    );
  }
  if (taxProgram === TaxProgram.STAY_NJ) {
    if (estimationAmount <= 100) {
      return (
        <tr>
          <td>{taxProgram}</td>
          <td>
            <div className="transaction-table--payment-status">
              <Trans i18nKey="stayNJChecksFebruary" ns="paymentInfo" />
            </div>
          </td>
          <td>
            <Trans
              i18nKey="estimatedAmount"
              ns="paymentInfo"
              values={{ amount: formatCheckAmount(estimationAmount) }}
            />
          </td>
        </tr>
      );
    } else {
      return (
        <>
          <tr>
            <td>{taxProgram}</td>
            <td>
              <div className="transaction-table--payment-status">
                <Trans i18nKey="stayNJChecksFebruary" ns="paymentInfo" />
              </div>
            </td>
            <td>
              <Trans
                i18nKey="estimatedAmount"
                ns="paymentInfo"
                values={{ amount: formatCheckAmount(estimationAmount / 4) }}
              />
            </td>
          </tr>
          <tr>
            <td>{taxProgram}</td>
            <td>
              <div className="transaction-table--payment-status">
                <Trans i18nKey="stayNJChecksMay" ns="paymentInfo" />
              </div>
            </td>
            <td>
              <Trans
                i18nKey="estimatedAmount"
                ns="paymentInfo"
                values={{ amount: formatCheckAmount(estimationAmount / 4) }}
              />
            </td>
          </tr>
          <tr>
            <td>{taxProgram}</td>
            <td>
              <div className="transaction-table--payment-status">
                <Trans i18nKey="stayNJPendingBudget" ns="paymentInfo" />
              </div>
            </td>
            <td>—</td>
          </tr>
          <tr>
            <td>{taxProgram}</td>
            <td>
              <div className="transaction-table--payment-status">
                <Trans i18nKey="stayNJPendingBudget" ns="paymentInfo" />
              </div>
            </td>
            <td>—</td>
          </tr>
        </>
      );
    }
  }
  return null;
};

export const showProgramTransactions = (transactions: Transaction[], taxProgram: TaxProgram) => {
  if (taxProgram === TaxProgram.PTR || taxProgram === TaxProgram.ANCHOR) {
    const earliest = getEarliestTransaction(transactions);
    if (!earliest?.payment_details) return null;
    const remainingTransactions = transactions.filter((transaction) => transaction !== earliest);

    return (
      <>
        {showRegularTransaction(earliest, taxProgram)}
        {remainingTransactions.map((transaction) =>
          showUpdatedTransaction(transaction, taxProgram),
        )}
      </>
    );
  } else if (taxProgram === TaxProgram.STAY_NJ) {
    return transactions.map((transaction) =>
      showRegularTransaction(transaction, TaxProgram.STAY_NJ),
    );
  }
};

export const PaymentFaq = ({
  formCode,
  hasPtrPayment,
  hasStayPayment,
  taxYear,
  records,
  setCurrentYear,
}: {
  formCode: FormCode | null;
  hasPtrPayment: boolean;
  hasStayPayment: boolean;
  taxYear: CurrentYear;
  records: Readonly<Partial<Record<CurrentYear, YearRecord>>>;
  setCurrentYear: (year: CurrentYear) => void;
}) => {
  const { t } = useTranslation("paymentInfo");
  const router = useRouter();

  if (taxYear === CurrentYear.YEAR2024) {
    return (
      <FaqSection
        items={PaymentInfoFaqContent2024()}
        titleHeadingLevel="h2"
        itemHeadingLevel="h3"
      />
    );
  }
  if (formCode === FormCode.ANC1 && !hasPtrPayment && !hasStayPayment) {
    return (
      <FaqSection items={ANCPaymentInfoFaqContent()} titleHeadingLevel="h2" itemHeadingLevel="h3" />
    );
  }

  return (
    <>
      <p>{t("pasPaymentSchedule")}</p>
      {records[CurrentYear.YEAR2024] &&
        records[CurrentYear.YEAR2024].stay_nj.some(
          (transaction) => transaction.status === TransactionStatus.PAYMENT_SENT,
        ) && (
          <>
            <p>
              {t("stayPayments2026")}
              <Button
                type="button"
                unstyled
                className="usa-link link-button"
                onClick={() => {
                  setCurrentYear(CurrentYear.YEAR2024);
                  router.refresh();
                }}
              >
                {t("taxYearPage2024")}
              </Button>
            </p>
          </>
        )}
      <FaqSection items={PASPaymentInfoFaqContent()} titleHeadingLevel="h2" itemHeadingLevel="h3" />
    </>
  );
};

const PaymentInfoPage = () => {
  const { t } = useTranslation(["paymentInfo", "common"]);
  const router = useRouter();
  const { dataStore, record, setCurrentYear } = useDataStore();
  if (!record) return null;

  useEffect(() => {
    if (!dataStore || dataStore.type !== DataType.STATUS) {
      router.replace("/");
    }
  }, [dataStore, router]);

  // Next.js prerenders client components during the build,
  // returning null here allows it to render only client-side
  if (!dataStore || dataStore.type !== DataType.STATUS) {
    return null;
  }

  const { lastFourSsnDigits, zipCode, currentYear, records } = dataStore;
  const { anchor, ptr, stay_nj, form_code, anchor_eligible_rebate, stay_eligible_rebate } = record;

  const hasPtrPayment = [...ptr].some(
    (transaction) => transaction.status === TransactionStatus.PAYMENT_SENT,
  );
  const hasStayPayment = [...stay_nj].some(
    (transaction) => transaction.status === TransactionStatus.PAYMENT_SENT,
  );

  const estimationEligibility = shouldShowEstimatedTransaction(record, currentYear);

  return (
    <main id="main-content">
      <section className="usa-section padding-top-0">
        <div className="grid-container">
          <TaxpayerInfoHeader lastFourSsnDigits={lastFourSsnDigits} zipCode={zipCode} />
          <div className="margin-top-4">
            <h1 className="font-heading-xl">
              <Trans i18nKey="paymentInfoHeader" ns="paymentInfo" values={{ year: currentYear }} />
            </h1>
          </div>
          <Table className="usa-table payment-table" bordered={false} scrollable={true}>
            <thead>
              <tr>
                <th className="width-card">{t("program")}</th>
                <th className="width-mobile">{t("paymentStatus")}</th>
                <th className="width-mobile">{t("amount")}</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                if (ptr.length === 0) return null;
                return showProgramTransactions(ptr, TaxProgram.PTR);
              })()}
              {(() => {
                if (anchor.length === 0) return null;
                if (
                  estimationEligibility === EstimatedEligibilityType.ANCHOR_ELIGIBLE ||
                  estimationEligibility === EstimatedEligibilityType.BOTH_ELIGIBLE
                ) {
                  return showEstimatedTransaction(TaxProgram.ANCHOR, anchor_eligible_rebate);
                }
                return showProgramTransactions(anchor, TaxProgram.ANCHOR);
              })()}
              {(() => {
                if (stay_nj.length === 0) return null;
                if (
                  estimationEligibility === EstimatedEligibilityType.STAY_ELIGIBLE ||
                  estimationEligibility === EstimatedEligibilityType.BOTH_ELIGIBLE
                ) {
                  return showEstimatedTransaction(TaxProgram.STAY_NJ, stay_eligible_rebate);
                }
                if (currentYear === CurrentYear.YEAR2024) {
                  return showProgramTransactions(stay_nj, TaxProgram.STAY_NJ);
                } else {
                  return null;
                }
              })()}
            </tbody>
          </Table>

          <PaymentFaq
            formCode={form_code}
            hasPtrPayment={hasPtrPayment}
            hasStayPayment={hasStayPayment}
            taxYear={currentYear}
            records={records}
            setCurrentYear={setCurrentYear}
          />
        </div>
      </section>
    </main>
  );
};

export default PaymentInfoPage;
