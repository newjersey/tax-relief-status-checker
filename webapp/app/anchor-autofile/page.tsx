"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataType, useDataStore } from "@/components/TaxReliefDataProvider";
import Link from "next/link";
import { ProcessList, ProcessListHeading, ProcessListItem } from "@trussworks/react-uswds";
import { FaqSection } from "@/components/FaqSection";
import { PaymentMethod } from "@/components/types";
import { AnchorAutofileCheckFaqContent } from "./AnchorAutofileCheckFaqContent";
import { AnchorAutofileDirectDepositFaqContent } from "./AnchorAutofileDirectDepositFaqContent";

const AnchorAutofilePage = () => {
  const router = useRouter();
  const { dataStore } = useDataStore();

  useEffect(() => {
    if (!dataStore || dataStore.kind !== DataType.AUTOFILE) {
      router.replace("/");
    }
  }, [dataStore, router]);

  // Next.js prerenders client components during the build,
  // returning null here allows it to render only client-side
  if (!dataStore || dataStore.kind !== DataType.AUTOFILE) {
    return null;
  }

  const { lastFourSsnDigits, zipCode, paymentMethod } = dataStore;
  const paymentMethodString = paymentMethod === PaymentMethod.CHECK ? "Check" : "Direct Deposit";

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
              <div className="tablet:grid-col-4">
                <p>
                  SSN/ITIN: <strong>***-**-{lastFourSsnDigits}</strong>
                </p>
              </div>
              <div className="tablet:grid-col-4">
                <p>
                  ZIP Code: <strong>{zipCode}</strong>
                </p>
              </div>{" "}
              <div className="tablet:grid-col-4">
                <p>
                  Tax Year: <strong>2025</strong>
                </p>
              </div>
            </div>
            <div className="grid-row">
              <div className="tablet:grid-col-6">
                <p>
                  Payment Type: <strong>{paymentMethodString}</strong>
                </p>
              </div>
            </div>
          </div>
          <div className="margin-top-4">
            <h1 className="font-heading-xl">
              A 2025 ANCHOR application will be filed on your behalf on September 15, 2026.
            </h1>
            <p>
              Our records show that you are eligible for the ANCHOR benefit. Below are next steps
              you can expect:
            </p>
            <ProcessList>
              <ProcessListItem>
                <ProcessListHeading type="p">
                  ANCHOR Benefit Confirmation Letters were sent on August 10, 2026
                </ProcessListHeading>
              </ProcessListItem>
              <ProcessListItem>
                <ProcessListHeading type="p">
                  ANCHOR application will be filed on September 15, 2026
                </ProcessListHeading>
                <p>
                  This is automatically filed for you unless you submit a paper or web application
                  yourself before this date.
                </p>
              </ProcessListItem>
              <ProcessListItem>
                <ProcessListHeading type="p">
                  Payments will be made starting October 1, 2026
                </ProcessListHeading>
                <p>In some cases, payments will be made after 2026</p>
              </ProcessListItem>
            </ProcessList>
          </div>

          {paymentMethod === PaymentMethod.CHECK && (
            <FaqSection
              items={AnchorAutofileCheckFaqContent}
              titleHeadingLevel="h2"
              itemHeadingLevel="h3"
            />
          )}

          {paymentMethod === PaymentMethod.DIRECT_DEPOSIT && (
            <FaqSection
              items={AnchorAutofileDirectDepositFaqContent}
              titleHeadingLevel="h2"
              itemHeadingLevel="h3"
            />
          )}
        </div>
      </section>
    </main>
  );
};

export default AnchorAutofilePage;
