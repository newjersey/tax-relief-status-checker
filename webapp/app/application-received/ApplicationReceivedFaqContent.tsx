import { fireEventWhenFaqOpened, type FaqItem } from "@/components/FaqSection";
import { Trans, useTranslation } from "react-i18next";

export const ApplicationReceivedFaqContent = (): FaqItem[] => {
  const { t } = useTranslation(["appRec", "common"]);
  return [
    {
      title: t("faq.noPayment.title"),
      content: (
        <>
          <p>{t("faq.noPayment.content")}</p>
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
                i18nKey={"faq.noPayment.email"}
                ns="appRec"
                components={{
                  1: <a href="mailto:nj.anchor@treas.nj.gov" />,
                }}
              ></Trans>
            </li>
            <li>
              <Trans
                i18nKey={"faq.noPayment.infoCenter"}
                ns="appRec"
                components={{
                  1: <a href="https://www.nj.gov/treasury/taxation/contact-office.shtml" />,
                }}
              ></Trans>
            </li>
          </ul>
        </>
      ),
      expanded: false,
      id: "faq_missing_payment",
      handleToggle: () => fireEventWhenFaqOpened("faq_missing_payment"),
    },
  ];
};
