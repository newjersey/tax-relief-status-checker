"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataType, useDataStore } from "@/components/TaxReliefDataProvider";
import { ProcessList, ProcessListHeading, ProcessListItem } from "@trussworks/react-uswds";
import { FaqSection } from "@/components/FaqSection";
import { PaymentMethod } from "@/components/types";
import { TaxpayerInfoHeader } from "@/components/TaxpayerInfoHeader";
import { AnchorAutofileCheckFaqContent } from "./AnchorAutofileCheckFaqContent";
import { AnchorAutofileDirectDepositFaqContent } from "./AnchorAutofileDirectDepositFaqContent";

const AnchorAutofilePage = () => {
  const router = useRouter();
  const { dataStore } = useDataStore();

  useEffect(() => {
    if (!dataStore || dataStore.type !== DataType.AUTOFILE) {
      router.replace("/");
    }
  }, [dataStore, router]);

  // Next.js prerenders client components during the build,
  // returning null here allows it to render only client-side
  if (!dataStore || dataStore.type !== DataType.AUTOFILE) {
    return null;
  }

  const { lastFourSsnDigits, zipCode, paymentMethod } = dataStore;
  const paymentMethodString = paymentMethod === PaymentMethod.CHECK ? "Check" : "Direct Deposit";

  return (
    <main id="main-content">
      <section className="usa-section">
        <div className="grid-container">
          <TaxpayerInfoHeader
            lastFourSsnDigits={lastFourSsnDigits}
            zipCode={zipCode}
            paymentType={paymentMethodString}
          />
          <div className="margin-top-4">
            <h1 className="font-heading-xl">
              A 2025 ANCHOR application will be filed on your behalf.
            </h1>
            <p>
              Our records show that you are eligible for the ANCHOR benefit based on information
              from your 2024 application. Below are next steps you can expect:
            </p>
            <ProcessList>
              <ProcessListItem>
                <ProcessListHeading type="p" className="text-normal">
                  Your ANCHOR Benefit Confirmation Letter was sent on August 10, 2026
                </ProcessListHeading>
              </ProcessListItem>
              <ProcessListItem>
                <ProcessListHeading type="p" className="text-normal">
                  The Division will start processing applications September 16, 2026
                </ProcessListHeading>
                <p>
                  This will happen automatically unless you{" "}
                  <a
                    href="https://propertytaxreliefapp.nj.gov/ANCHOROptOut"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    opt out
                  </a>{" "}
                  before this date
                </p>
              </ProcessListItem>
              <ProcessListItem>
                <ProcessListHeading type="p" className="text-normal">
                  ANCHOR payments will go out starting October 1, 2026
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
