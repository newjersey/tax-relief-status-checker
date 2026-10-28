"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataType, useDataStore } from "@/components/TaxReliefDataProvider";
import { AnchorApplicationReceivedFaqContent } from "./AnchorApplicationReceivedFaqContent";
import { FaqSection } from "@/components/FaqSection";
import { TaxpayerInfoHeader } from "@/components/TaxpayerInfoHeader";
import { useTranslation, Trans } from "react-i18next";

const AnchorApplicationReceivedPage = () => {
  const { t } = useTranslation(["ancAppRec", "common"]);

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
      <section className="usa-section padding-top-0">
        <div className="grid-container">
          <TaxpayerInfoHeader lastFourSsnDigits={lastFourSsnDigits} zipCode={zipCode} />
          <div className="margin-top-4">
            <h1 className="font-heading-xl">
              <Trans i18nKey={"ancAppReceived"} ns="ancAppRec" values={{ applicationDateString }}>
                We have your 2025 <abbr>ANCHOR</abbr> application on file as of{" "}
                {applicationDateString}
              </Trans>
            </h1>
            <p>{t("appBeingProcessed")}</p>
            <FaqSection
              items={AnchorApplicationReceivedFaqContent()}
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
