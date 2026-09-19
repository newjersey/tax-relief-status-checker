"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataType, useDataStore } from "@/components/TaxReliefDataProvider";
import { AnchorApplicationReceivedFaqContent } from "./AnchorApplicationReceivedFaqContent";
import { FaqSection } from "@/components/FaqSection";
import { TaxpayerInfoHeader } from "@/components/TaxpayerInfoHeader";

const AnchorApplicationReceivedPage = () => {
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

  const { lastFourSsnDigits, zipCode, applicationDateString } = dataStore;

  return (
    <main id="main-content">
      <section className="usa-section">
        <div className="grid-container">
          <TaxpayerInfoHeader lastFourSsnDigits={lastFourSsnDigits} zipCode={zipCode} />
          <div className="margin-top-4">
            <h1 className="font-heading-xl">
              We have your 2025 ANCHOR application on file as of {applicationDateString}
            </h1>
            <p>
              Your 2025 ANCHOR application is being processed. If you're eligible for benefits,
              payments start going out October 1, 2026. In some cases, payments will be made after
              2026.
            </p>
            <FaqSection
              items={AnchorApplicationReceivedFaqContent}
              titleHeadingLevel="h2"
              itemHeadingLevel="h3"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default AnchorApplicationReceivedPage;
