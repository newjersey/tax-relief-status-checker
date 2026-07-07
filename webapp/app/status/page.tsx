"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDataStore } from "@/components/TaxReliefDataProvider";
import Link from "next/link";
import { Table } from "@trussworks/react-uswds";
import { formatDate } from "../utils/formatDate";
import { expandFaqAccordionItem } from "@/components/LandingPageFaq";

const StatusPage = () => {
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

  const { lastFourSsnDigits, zipCode, applicationDateString, anchor, ptr, stay_nj } = dataStore;

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
              <a href="/" target="_blank">
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
              {ptr.map((transaction) => {
                if (
                  transaction.status == "Payment Sent" &&
                  transaction.payment_details?.date &&
                  transaction.payment_details.amount
                )
                  return (
                    <tr>
                      <td>Senior Freeze</td>
                      <td>Check issued on {formatDate(transaction.payment_details.date)}</td>
                      <td>${transaction.payment_details.amount}</td>
                    </tr>
                  );
              })}
              {anchor.map((transaction) => {
                if (
                  transaction.status == "Payment Sent" &&
                  transaction.payment_details?.date &&
                  transaction.payment_details.amount
                )
                  return (
                    <tr>
                      <td>ANCHOR</td>
                      <td>Check issued on {formatDate(transaction.payment_details.date)}</td>
                      <td>${transaction.payment_details.amount}</td>
                    </tr>
                  );
              })}
              {stay_nj.map((transaction) => {
                if (
                  transaction.status == "Payment Sent" &&
                  transaction.payment_details?.date &&
                  transaction.payment_details.amount
                )
                  return (
                    <tr>
                      <td>Stay NJ</td>
                      <td>Check issued on {formatDate(transaction.payment_details.date)}</td>
                      <td>${transaction.payment_details.amount}</td>
                    </tr>
                  );
              })}
            </tbody>
          </Table>
        </div>
      </section>
    </main>
  );
};

export default StatusPage;
