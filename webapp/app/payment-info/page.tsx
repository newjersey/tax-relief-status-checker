"use client";

import { JSX, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataType, useDataStore } from "@/components/TaxReliefDataProvider";
import { Table } from "@trussworks/react-uswds";
import { formatDate } from "../utils/formatDate";
import { PaymentInfoFaqContent } from "@/app/payment-info/PaymentInfoFaqContent";
import { FaqSection, expandFaqAccordionItem } from "@/components/FaqSection";
import { Transaction, TaxProgram, PaymentMethod, TransactionStatus } from "@/components/types";
import { TaxpayerInfoHeader } from "@/components/TaxpayerInfoHeader";

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

export const showEarliestTransaction = (transaction: Transaction, taxProgram: TaxProgram) => {
  if (!transaction?.payment_details) return null;
  return (
    <tr>
      <td>{taxProgram}</td>
      {transaction.payment_details.method === PaymentMethod.CHECK ? (
        <td>Check issued on {formatDate(transaction.payment_details.date)}</td>
      ) : (
        <td>Direct deposit made on {formatDate(transaction.payment_details.date)}</td>
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
          Your benefit amount was adjusted. A check was sent on{" "}
          {formatDate(transaction.payment_details.date)}
        </div>
      </td>
      <td>${transaction.payment_details.amount}</td>
    </tr>
  );
};

export const showProgramTransactions = (transactions: Transaction[], taxProgram: TaxProgram) => {
  const earliest = getEarliestTransaction(transactions);
  if (!earliest?.payment_details) return null;

  const remainingTransactions = transactions.filter((transaction) => transaction !== earliest);

  return (
    <>
      {showEarliestTransaction(earliest, taxProgram)}
      {remainingTransactions.map((transaction) => showUpdatedTransaction(transaction, taxProgram))}
    </>
  );
};

const PaymentInfoPage = () => {
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

  const { lastFourSsnDigits, zipCode, anchor, ptr } = dataStore;

  return (
    <main id="main-content">
      <section className="usa-section">
        <div className="grid-container">
          <TaxpayerInfoHeader lastFourSsnDigits={lastFourSsnDigits} zipCode={zipCode} />
          <div className="margin-top-4">
            <h1 className="font-heading-xl">You are eligible for benefits</h1>
          </div>
          <Table className="usa-table payment-table" bordered={false} scrollable={true}>
            <thead>
              <tr>
                <th className="width-card">Program</th>
                <th className="width-mobile">Payment Status</th>
                <th className="width-mobile">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                if (ptr.length === 0) return null;
                return showProgramTransactions(ptr, TaxProgram.PTR);
              })()}
            </tbody>
          </Table>
          <p>
            You must be eligible for a program to receive payment. To find out when to expect
            payment from ANCHOR or Stay NJ, review the{" "}
            <a
              href="#faq_when_can_i_expect_to_receive_payments"
              onClick={(e) => {
                e.preventDefault();
                expandFaqAccordionItem("faq_when_can_i_expect_to_receive_payments");
              }}
            >
              full program payment table
            </a>
            {"."}
          </p>
          <div className="grid-row grid-gap margin-top-5">
            <FaqSection
              items={PaymentInfoFaqContent}
              titleHeadingLevel="h2"
              itemHeadingLevel="h3"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default PaymentInfoPage;
