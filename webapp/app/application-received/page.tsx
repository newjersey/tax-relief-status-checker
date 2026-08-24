"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataType, useDataStore } from "@/components/TaxReliefDataProvider";
import { ProcessList, ProcessListHeading, ProcessListItem } from "@trussworks/react-uswds";
import { ApplicationReceivedFaqContent } from "./ApplicationReceivedFaqContent";
import { FaqSection } from "@/components/FaqSection";
import { TaxpayerInfoHeader } from "@/components/TaxpayerInfoHeader";

const ApplicationReceivedPage = () => {
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
              Your application was received on {applicationDateString}
            </h1>
            <p>
              Your application is being reviewed for three property tax relief programs: Senior
              Freeze, ANCHOR, and Stay NJ. Each program makes payments on different timelines, and
              not everyone qualifies for all three programs.
            </p>
            <ProcessList>
              <ProcessListItem>
                <ProcessListHeading type="p">Senior Freeze</ProcessListHeading>
                <p>Senior Freeze payments start July 15, 2026.</p>
              </ProcessListItem>
              <ProcessListItem>
                <ProcessListHeading type="p">ANCHOR</ProcessListHeading>
                <p>ANCHOR payments begin September 2026.</p>
              </ProcessListItem>
              <ProcessListItem>
                <ProcessListHeading type="p">Stay NJ</ProcessListHeading>
                <p>Stay NJ quarterly payments begin February 2027.</p>
              </ProcessListItem>
            </ProcessList>
          </div>
          <FaqSection
            items={ApplicationReceivedFaqContent}
            titleHeadingLevel="h2"
            itemHeadingLevel="h3"
          />
        </div>
      </section>
    </main>
  );
};

export default ApplicationReceivedPage;
