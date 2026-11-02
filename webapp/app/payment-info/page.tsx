"use client";

import { JSX, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CurrentYear, DataType, useDataStore } from "@/components/TaxReliefDataProvider";
import { Table } from "@trussworks/react-uswds";
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
} from "@/components/types";
import { TaxpayerInfoHeader } from "@/components/TaxpayerInfoHeader";
import { useTranslation, Trans } from "react-i18next";
import { PaymentInfoFaqContent2024 } from "./PaymentInfoFaqContent2024";

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
      <td>${transaction.payment_details.amount}</td>
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
      <td>${transaction.payment_details.amount}</td>
    </tr>
  );
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
  form_code,
  hasPtrPayment,
  hasStayPayment,
  taxYear,
}: {
  form_code: FormCode | null;
  hasPtrPayment: boolean;
  hasStayPayment: boolean;
  taxYear: CurrentYear;
}) => {
  const { t } = useTranslation("paymentInfo");

  if (taxYear === CurrentYear.YEAR2024) {
    return (
      <FaqSection
        items={PaymentInfoFaqContent2024()}
        titleHeadingLevel="h2"
        itemHeadingLevel="h3"
      />
    );
  }
  if (form_code === FormCode.ANC1 && !hasPtrPayment && !hasStayPayment) {
    return (
      <FaqSection items={ANCPaymentInfoFaqContent()} titleHeadingLevel="h2" itemHeadingLevel="h3" />
    );
  }

  return (
    <>
      <p>{t("pasPaymentSchedule")}</p>
      <FaqSection items={PASPaymentInfoFaqContent()} titleHeadingLevel="h2" itemHeadingLevel="h3" />
    </>
  );
};

const PaymentInfoPage = () => {
  const { t } = useTranslation(["paymentInfo", "common"]);
  const router = useRouter();
  const { dataStore } = useDataStore();

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

  const { lastFourSsnDigits, zipCode, records, currentYear } = dataStore;
  const record = records[currentYear];
  if (!record) {
    router.replace("/");
  }
  const { anchor, ptr, stay_nj, form_code } = record!;

  const hasPtrPayment = [...ptr].some(
    (transaction) => transaction.status === TransactionStatus.PAYMENT_SENT,
  );
  const hasStayPayment = [...stay_nj].some(
    (transaction) => transaction.status === TransactionStatus.PAYMENT_SENT,
  );

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
                return showProgramTransactions(anchor, TaxProgram.ANCHOR);
              })()}
              {(() => {
                if (!(process.env.NEXT_PUBLIC_ENABLE_STAY == "true") || stay_nj.length === 0)
                  return null;
                return showProgramTransactions(stay_nj, TaxProgram.STAY_NJ);
              })()}
            </tbody>
          </Table>

          <PaymentFaq
            form_code={form_code}
            hasPtrPayment={hasPtrPayment}
            hasStayPayment={hasStayPayment}
            taxYear={currentYear}
          />
        </div>
      </section>
    </main>
  );
};

export default PaymentInfoPage;
