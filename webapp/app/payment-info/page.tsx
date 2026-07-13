"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDataStore } from "@/components/TaxReliefDataProvider";
import Link from "next/link";
import { Table } from "@trussworks/react-uswds";
import { formatDate } from "../utils/formatDate";
import { expandFaqAccordionItem, LandingPageFaq } from "@/components/LandingPageFaq";

const getEarliestTransaction = (transactions: any[]) => {
  const valid = transactions.filter((t) => t.status === "payment_sent" && t.payment_details?.date);
  if (valid.length === 0) return;
  return valid.reduce((earliest, current) =>
    new Date(current.payment_details.date) < new Date(earliest.payment_details.date)
      ? current
      : earliest,
  );
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

  const { lastFourSsnDigits, zipCode, anchor, ptr } = dataStore;

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
                const transaction = getEarliestTransaction(ptr);
                if (!transaction) return null;
                return (
                  <tr>
                    <td>Senior Freeze</td>
                    {transaction.payment_details.method === "check" ? (
                      <td>Check issued on {formatDate(transaction.payment_details.date)}</td>
                    ) : (
                      <td>Direct deposit made on {formatDate(transaction.payment_details.date)}</td>
                    )}
                    <td>${transaction.payment_details.amount}</td>
                  </tr>
                );
              })()}
              {(() => {
                const transaction = getEarliestTransaction(anchor);
                if (!transaction) return null;
                return (
                  <tr>
                    <td>ANCHOR</td>
                    {transaction.payment_details.method === "check" ? (
                      <td>Check issued on {formatDate(transaction.payment_details.date)}</td>
                    ) : (
                      <td>Direct deposit made on {formatDate(transaction.payment_details.date)}</td>
                    )}
                    <td>${transaction.payment_details.amount}</td>
                  </tr>
                );
              })()}
            </tbody>
          </Table>
          <div className="grid-row grid-gap margin-top-5">
            <h2 className="font-heading-l">Frequently Asked Questions (FAQs)</h2>
            <LandingPageFaq headingLevel="h3" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default PaymentInfoPage;
