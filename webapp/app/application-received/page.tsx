"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataType, useDataStore } from "@/components/TaxReliefDataProvider";
import { ProcessList, ProcessListHeading, ProcessListItem } from "@trussworks/react-uswds";
import { ApplicationReceivedFaqContent } from "./ApplicationReceivedFaqContent";
import { ApplicationReceivedFaqContent2024 } from "./ApplicationReceivedFaqContent2024";
import { FaqSection } from "@/components/FaqSection";
import { TaxpayerInfoHeader } from "@/components/TaxpayerInfoHeader";
import { Trans, useTranslation } from "react-i18next";
import { CurrentYear } from "@/components/TaxReliefDataProvider";

export const ApplicationReceivedFaq = ({ currentYear }: { currentYear: CurrentYear }) => {
  if (currentYear === CurrentYear.YEAR2024) {
    return (
      <FaqSection
        items={ApplicationReceivedFaqContent2024()}
        titleHeadingLevel="h2"
        itemHeadingLevel="h3"
      />
    );
  }

  return (
    <>
      <FaqSection
        items={ApplicationReceivedFaqContent()}
        titleHeadingLevel="h2"
        itemHeadingLevel="h3"
      />
    </>
  );
};

const ApplicationReceivedPage = () => {
  const { t } = useTranslation(["appRec", "common"]);
  const router = useRouter();
  const { dataStore, record } = useDataStore();
  if (!record) return null;

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

  const { lastFourSsnDigits, zipCode, currentYear } = dataStore;
  const { application_date } = record;

  return (
    <main id="main-content">
      <section className="usa-section padding-top-0">
        <div className="grid-container">
          <TaxpayerInfoHeader lastFourSsnDigits={lastFourSsnDigits} zipCode={zipCode} />
          <div className="margin-top-4">
            {currentYear === CurrentYear.YEAR2025 ? (
              <>
                <h1 className="font-heading-xl">
                  <Trans
                    i18nKey="appReceivedPAS"
                    ns="appRec"
                    values={{ date: application_date, year: currentYear }}
                  />
                </h1>
                <p>{t("appUnderReview")}</p>{" "}
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
              </>
            ) : (
              <>
                <h1 className="font-heading-xl">
                  <Trans
                    i18nKey="appReceived"
                    ns="common"
                    values={{ date: application_date, year: currentYear }}
                  />
                </h1>
                <p className="margin-bottom-10">{t("appProcessing")}</p>{" "}
              </>
            )}
          </div>
          <ApplicationReceivedFaq currentYear={currentYear} />
        </div>
      </section>
    </main>
  );
};

export default ApplicationReceivedPage;
