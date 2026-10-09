"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDataStore } from "@/components/TaxReliefDataProvider";
import { IssueFlaggedType } from "@/components/types";
import { Alert } from "@trussworks/react-uswds";
import { TaxpayerInfoHeader } from "@/components/TaxpayerInfoHeader";
import { Trans, useTranslation } from "react-i18next";

const MoreInformationNeededPage = () => {
  const { t } = useTranslation(["moreInfo", "common"]);
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

  const { lastFourSsnDigits, zipCode, applicationDateString, issueFlagged } = dataStore;

  const createAlertContent = (alertType: IssueFlaggedType): ReactNode => {
    if (alertType === IssueFlaggedType.CONTACT_TAXATION) {
      return (
        <>
          <p>{t("contactAlert")}</p>
          <ul>
            <li>
              <Trans
                i18nKey={"call"}
                ns="common"
                components={{
                  1: <a href="tel:+18882381233" />,
                }}
              ></Trans>
            </li>
            <li>
              <Trans
                i18nKey={"email"}
                ns="common"
                components={{
                  1: <a href="mailto:nj.anchor@treas.nj.gov" />,
                }}
              ></Trans>{" "}
            </li>
            <li>
              <Trans
                i18nKey={"infoCenter"}
                ns="common"
                components={{
                  1: <a href="https://www.nj.gov/treasury/taxation/contact-office.shtml" />,
                }}
              ></Trans>
            </li>
          </ul>
        </>
      );
    } else if (alertType === IssueFlaggedType.PROPERTY_TAX_BILL_NEEDED) {
      return (
        <>
          <p>
            <Trans i18nKey={"propertyTaxBillAlert"} ns="moreInfo">
              <strong />
            </Trans>
          </p>
          <ul>
            <li>
              <Trans
                i18nKey={"uploadTaxBill"}
                ns="moreInfo"
                components={{
                  1: <a href="https://www.njportal.com/dor/onlinenotices/" />,
                }}
              ></Trans>
            </li>
            <li> {t("mailTaxBill")}</li>
            <li>
              <Trans
                i18nKey={"bringTaxBill"}
                ns="moreInfo"
                components={{
                  1: <a href="https://www.nj.gov/treasury/taxation/contact-office.shtml" />,
                }}
              ></Trans>
            </li>
          </ul>
        </>
      );
    }
  };

  return (
    <main id="main-content">
      <section className="usa-section">
        <div className="grid-container">
          <TaxpayerInfoHeader lastFourSsnDigits={lastFourSsnDigits} zipCode={zipCode} />
          {issueFlagged !== undefined && (
            <Alert type="warning">
              <h3 className="usa-alert__heading">{t("additionalInfoNeeded")}</h3>

              {createAlertContent(issueFlagged)}
            </Alert>
          )}
          <div className="margin-top-4">
            <h1 className="font-heading-xl">
              {t("common:appReceived", { date: applicationDateString })}
            </h1>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MoreInformationNeededPage;
