"use client";

import { JSX, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDataStore } from "@/components/TaxReliefDataProvider";
import Link from "next/link";
import { Table } from "@trussworks/react-uswds";
import { formatDate } from "../utils/formatDate";
import { expandFaqAccordionItem, PaymentInfoPageFaq } from "@/components/PaymentInfoPageFaq";
import { Transaction } from "@/components/types";

const ptrString = "Senior Freeze";
const anchorString = "ANCHOR";
const stayNJString = "Stay NJ";

export const getEarliestTransaction = (transactions: Transaction[]) => {
  const valid = transactions.filter((t) => t.status === "payment_sent" && t.payment_details);
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

export const showEarliestTransaction = (transaction: Transaction, category: string) => {
  if (!transaction?.payment_details) return null;
  return (
    <tr>
      <td>{category}</td>
      {transaction.payment_details.method === "check" ? (
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
  category: string,
): JSX.Element | null => {
  if (!transaction?.payment_details) return null;
  return (
    <tr>
      <td>{category}</td>
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

export const showAllTransactions = (transactions: Transaction[], category: string) => {
  const earliest = getEarliestTransaction(transactions);
  if (!earliest?.payment_details) return null;

  if (transactions.length === 1) {
    return showEarliestTransaction(earliest, category);
  }

  const rest = transactions.filter((transaction) => transaction !== earliest);

  return (
    <>
      {showEarliestTransaction(earliest, category)}
      {rest.map((transaction) => showUpdatedTransaction(transaction, category))}
    </>
  );
};

export const sortStayNJTransactions = (transactions: Transaction[]) => {
  const sortedStayNJ: Transaction[][] = [[], [], [], []];
  for (const transaction of transactions) {
    if (!transaction.payment_details) continue;
    const currentDate = new Date(transaction.payment_details.date);
    if (currentDate >= new Date("01/01/27") && currentDate <= new Date("04/30/27 23:59:59")) {
      sortedStayNJ[0].push(transaction);
    } else if (
      currentDate > new Date("4/30/27 23:59:59") &&
      currentDate <= new Date("07/31/27 23:59:59")
    ) {
      sortedStayNJ[1].push(transaction);
    } else if (
      currentDate > new Date("07/31/27 23:59:59") &&
      currentDate <= new Date("10/31/27 23:59:59")
    ) {
      sortedStayNJ[2].push(transaction);
    } else if (
      currentDate > new Date("10/31/27 23:59:59") &&
      currentDate <= new Date("12/31/27 23:59:59")
    ) {
      sortedStayNJ[3].push(transaction);
    }
  }
  console.log(sortedStayNJ);
  return sortedStayNJ;
};

const PaymentInfoPage = () => {
  const router = useRouter();
  const { dataStore } = useDataStore();

  useEffect(() => {
    if (!dataStore) {
      router.replace("/");
    }
  }, [dataStore, router]);

  // Next.js prerenders client components during the build,
  // returning null here allows it to render only client-side
  if (!dataStore) {
    return null;
  }

  const { lastFourSsnDigits, zipCode, anchor, ptr, stay_nj } = dataStore;

  return (
    <main id="main-content">
      <section className="usa-section">
        <div className="grid-container">
          <div style={{ textAlign: "right" }}>
            <Link className="usa-button usa-button--outline margin-right-3 margin-top-3" href="/">
              <svg focusable="false" role="img" width="20" height="20" fill="#005ea2">
                <use href="/img/sprite.svg#logout"></use>
              </svg>
              Log out
            </Link>
          </div>
          <div>
            <div className="grid-row">
              <div className="tablet:grid-col-3">
                <p>
                  SSN/ITIN: <strong>***-**-{lastFourSsnDigits}</strong>
                </p>
              </div>
              <div className="tablet:grid-col-3">
                <p>
                  Zip Code: <strong>{zipCode}</strong>
                </p>
              </div>{" "}
              <div className="tablet:grid-col-3">
                <p>
                  Tax Year: <strong>2025</strong>
                </p>
              </div>
            </div>
          </div>
          <div className="margin-top-4">
            <h1 className="font-heading-xl">You are eligible for benefits</h1>
            <p className="usa-alert__text">
              To find out when to expect payment on all programs, review the{" "}
              <a
                href="#faq_when_can_i_expect_to_receive_payments"
                onClick={(e) => {
                  e.preventDefault();
                  expandFaqAccordionItem("faq_when_can_i_expect_to_receive_payments");
                }}
              >
                program payment table
              </a>
              {"."}
            </p>
          </div>
          <Table className="usa-table" bordered={false} scrollable={true}>
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

                const earliest = getEarliestTransaction(ptr);
                if (!earliest?.payment_details) return null;

                if (ptr.length === 1) {
                  return showEarliestTransaction(earliest, ptrString);
                }

                const rest = ptr.filter((transaction) => transaction !== earliest);

                return (
                  <>
                    {showEarliestTransaction(earliest, ptrString)}
                    {rest.map((transaction) => showUpdatedTransaction(transaction, ptrString))}
                  </>
                );
              })()}
              {(() => {
                if (anchor.length === 0) return null;

                const earliest = getEarliestTransaction(anchor);
                if (!earliest?.payment_details) return null;

                if (anchor.length === 1) {
                  return showEarliestTransaction(earliest, anchorString);
                }

                const rest = anchor.filter((transaction) => transaction !== earliest);

                return (
                  <>
                    {showEarliestTransaction(earliest, anchorString)}
                    {rest.map((transaction) => showUpdatedTransaction(transaction, anchorString))}
                  </>
                );
              })()}
              {(() => {
                if (stay_nj.length === 0) return null;

                const sortedStayNJ = sortStayNJTransactions(stay_nj);
                for (const quarter of sortedStayNJ) {
                  const earliest = getEarliestTransaction(quarter);
                  if (!earliest?.payment_details) return null;

                  if (quarter.length === 1) {
                    return showEarliestTransaction(earliest, stayNJString);
                  }

                  const rest = quarter.filter((transaction) => transaction !== earliest);

                  return (
                    <>
                      {showEarliestTransaction(earliest, stayNJString)}
                      {rest.map((transaction) => showUpdatedTransaction(transaction, stayNJString))}
                    </>
                  );
                }
              })()}
            </tbody>
          </Table>
          <div className="grid-row grid-gap margin-top-5">
            <h2 className="font-heading-l">Frequently Asked Questions (FAQs)</h2>
            <PaymentInfoPageFaq headingLevel="h3" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default PaymentInfoPage;
