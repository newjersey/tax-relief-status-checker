import { fireEventWhenFaqOpened, type FaqItem } from "@/components/FaqSection";
import { Trans, useTranslation } from "react-i18next";

export const ANCPaymentInfoFaqContent = (): FaqItem[] => {
  const { t } = useTranslation(["paymentInfo", "common"]);
  return [
    {
      title: t("faq.checkAmountDifferent.title"),
      content: (
        <>
          <p>{t("common:contactDivision")}</p>
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
              ></Trans>
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
      ),
      expanded: false,
      id: "faq_check_amount_different_than_expected_anc1",
      handleToggle: () => fireEventWhenFaqOpened("faq_check_amount_different_than_expected_anc1"),
    },
    {
      title: t("faq.notReceivedCheck.title"),
      content: (
        <>
          <p>{t("common:contactDivision")}</p>
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
              ></Trans>
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
      ),
      expanded: false,
      id: "faq_have_not_received_check_next_steps_anc1",
      handleToggle: () => fireEventWhenFaqOpened("faq_have_not_received_check_next_steps_anc1"),
    },
  ];
};
