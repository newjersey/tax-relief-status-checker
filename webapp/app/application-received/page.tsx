"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDataStore } from "@/components/TaxReliefDataProvider";
import { ProcessList, ProcessListHeading, ProcessListItem } from "@trussworks/react-uswds";
import { ApplicationReceivedFaqContent } from "./ApplicationReceivedFaqContent";
import { FaqSection } from "@/components/FaqSection";
import { TaxpayerInfoHeader } from "@/components/TaxpayerInfoHeader";
import { useTranslation } from "react-i18next";

const ApplicationReceivedPage = () => {
  const { t } = useTranslation(["appRec", "common"]);
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

  const { lastFourSsnDigits, zipCode, applicationDateString } = dataStore;

  return (
    <main id="main-content">
      <section className="usa-section">
        <div className="grid-container">
          <TaxpayerInfoHeader lastFourSsnDigits={lastFourSsnDigits} zipCode={zipCode} />
          <div className="margin-top-4">
            <h1 className="font-heading-xl">
              {t("common:appReceived", { date: applicationDateString })}
            </h1>
            <p>{t("appUnderReview")}</p>
            <ProcessList>
              <ProcessListItem>
                <ProcessListHeading type="p">{t("common:seniorFreeze")}</ProcessListHeading>
                <p>{t("seniorFreezePayments")}</p>
              </ProcessListItem>
              <ProcessListItem>
                <ProcessListHeading type="p">{t("common:anchor")}</ProcessListHeading>
                <p>{t("anchorPayments")}</p>
              </ProcessListItem>
              <ProcessListItem>
                <ProcessListHeading type="p">{t("common:stayNJ")}</ProcessListHeading>
                <p>{t("stayPayments")}</p>
              </ProcessListItem>
            </ProcessList>
          </div>
          <FaqSection
            items={ApplicationReceivedFaqContent()}
            titleHeadingLevel="h2"
            itemHeadingLevel="h3"
          />
        </div>
      </section>
    </main>
  );
};

export default ApplicationReceivedPage;
