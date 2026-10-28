"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataType, useDataStore } from "@/components/TaxReliefDataProvider";
import { MissedMailerFaqContent } from "./MissedMailerFaqContent";
import { FaqSection } from "@/components/FaqSection";
import { TaxpayerInfoHeader } from "@/components/TaxpayerInfoHeader";
import { useTranslation, Trans } from "react-i18next";

const MissedMailerPage = () => {
  const { t } = useTranslation(["missedMailer", "common"]);

  const router = useRouter();
  const { dataStore } = useDataStore();

  useEffect(() => {
    if (!dataStore || dataStore.type !== DataType.MISSED_MAILER) {
      router.replace("/");
    }
  }, [dataStore, router]);

  // Next.js prerenders client components during the build,
  // returning null here allows it to render only client-side
  if (!dataStore || dataStore.type !== DataType.MISSED_MAILER) {
    return null;
  }

  const { lastFourSsnDigits, zipCode } = dataStore;

  return (
    <main id="main-content">
      <section className="usa-section padding-top-0">
        <div className="grid-container">
          <div className="padding-bottom-3">
            <div role="alert" className="usa-alert usa-alert--error usa-alert--no-icon">
              <div className="usa-alert__body">
                <h3 className="usa-alert__heading">{t("alert.status")}</h3>
                <p className="usa-alert__text">{t("alert.text")}</p>
              </div>
            </div>
          </div>

          <TaxpayerInfoHeader lastFourSsnDigits={lastFourSsnDigits} zipCode={zipCode} />
          <div className="margin-top-4">
            <h1 className="font-sans-2xl margin-top-0 margin-bottom-10 text-normal">
              <Trans
                i18nKey="mustFile"
                ns="missedMailer"
                components={{
                  bold: <strong />,
                  1: <a href={t("applicationURL")} />,
                }}
              />
            </h1>
            <FaqSection
              items={MissedMailerFaqContent()}
              titleHeadingLevel="h2"
              itemHeadingLevel="h3"
            />
          </div>
        </div>
      </section>
      <div className="grid-container usa-footer__return-to-top">
        <a href="#nj-header">{t("common:returnToTop")}</a>
      </div>
    </main>
  );
};

export default MissedMailerPage;
