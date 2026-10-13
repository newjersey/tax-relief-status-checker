"use client";
import { Logo } from "@trussworks/react-uswds";
import { useTranslation } from "react-i18next";

/** Site-wide footer with Division of Taxation contact info and NJ links. */
export const NjFooter = () => {
  const { t } = useTranslation("njFooter");
  return (
    <footer className="usa-footer">
      <div className="footer-social padding-5" style={{ backgroundColor: "#E5C53C" }}>
        <div className="grid-container">
          <div className="grid-row">
            <div className="usa-footer__logo grid-row mobile-lg:grid-col-6 mobile-lg:grid-gap-2">
              <div className="mobile-lg:grid-col-auto">
                <p className="usa-footer__logo-heading">
                  <a href={t("taxationURL")} target="_blank" rel="noopener" className="text-black">
                    {t("divisionOfTaxation")}
                  </a>
                </p>
              </div>
            </div>
            <div className="mobile-lg:grid-col-6 grid-col">
              <div style={{ textAlign: "right" }}>
                <p>{t("divisionOfTaxation")}</p>
                <p className="margin-top-0">{t("taxationPOBox")}</p>
                <p className="margin-top-0">{t("taxationAddress")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom padding-y-4" style={{ backgroundColor: "#1C1D1F" }}>
        <div className="grid-container">
          <Logo size="slim" image={<img src="/img/nj_logo.svg" alt="NJ logo" />} />
          <p className="text-bold text-white">
            {t("officialWebsite")}
            <a href={t("stateURL")} className="text-white" target="_blank" rel="noopener">
              {t("stateOfNJ")}
            </a>
          </p>
          <div className="grid-row grid-gap margin-top-3">
            <div className="grid-col-4">
              <ul className="usa-list usa-list--unstyled">
                <li className="margin-bottom-1">
                  <a href={t("governorURL")} className="text-white" target="_blank" rel="noopener">
                    {t("governor")}
                  </a>
                </li>
                <li className="margin-bottom-1">
                  <a href={t("servicesURL")} className="text-white" target="_blank" rel="noopener">
                    {t("services")}
                  </a>
                </li>
                <li className="margin-bottom-1">
                  <a href={t("privacyURL")} className="text-white" target="_blank" rel="noopener">
                    {t("privacy")}
                  </a>
                </li>
              </ul>
            </div>
            <div className="grid-col-4">
              <ul className="usa-list usa-list--unstyled">
                <li className="margin-bottom-1">
                  <a href={t("faqsURL")} className="text-white" target="_blank" rel="noopener">
                    {t("faqs")}
                  </a>
                </li>
                <li className="margin-bottom-1">
                  <a href={t("legalURL")} className="text-white" target="_blank" rel="noopener">
                    {t("legal")}
                  </a>
                </li>
              </ul>
            </div>
            <div className="grid-col-4">
              <ul className="usa-list usa-list--unstyled">
                <li className="margin-bottom-1">
                  <a href={t("stateURL")} className="text-white" target="_blank" rel="noopener">
                    {t("home")}
                  </a>
                </li>
                <li className="margin-bottom-1">
                  <a href={t("contactURL")} className="text-white" target="_blank" rel="noopener">
                    {t("contact")}
                  </a>
                </li>
                <li className="margin-bottom-1">
                  <a
                    href={t("accessibilityURL")}
                    className="text-white"
                    target="_blank"
                    rel="noopener"
                  >
                    {t("accessibility")}
                  </a>
                </li>
              </ul>
            </div>
            <div className="grid-col-12">
              <p className="margin-top-3 text-base-light">
                {t("copyright")} &copy; {t("deptOfTreasury")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
