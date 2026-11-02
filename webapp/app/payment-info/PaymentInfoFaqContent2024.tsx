import { fireEventWhenFaqOpened, type FaqItem } from "@/components/FaqSection";
import { Trans, useTranslation } from "react-i18next";

export const PaymentInfoFaqContent2024 = (): FaqItem[] => {
  const { t } = useTranslation(["paymentInfo", "common"]);
  return [
    {
      title: t("faq.dontSeeEligibleBenefits.title"),
      content: (
        <>
          <p>{t("faq.dontSeeEligibleBenefits.contact")}</p>
          <ul>
            <li>
              <Trans
                i18nKey={"call"}
                ns="common"
                components={{
                  1: <a href={t("common:callNumber")} />,
                }}
              ></Trans>
            </li>
            <li>
              <Trans
                i18nKey={"email"}
                ns="common"
                components={{
                  1: <a href={t("common:emailURL")} />,
                }}
              ></Trans>
            </li>
            <li>
              <Trans
                i18nKey={"infoCenter"}
                ns="common"
                components={{
                  1: <a href={t("common:infoCenterURL")} />,
                }}
              ></Trans>
            </li>
          </ul>
        </>
      ),
      expanded: false,
      id: "faq_missing_eligible_benefits_2024",
      handleToggle: () => fireEventWhenFaqOpened("faq_missing_eligible_benefits_2024"),
    },
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
                  1: <a href={t("common:callNumber")} />,
                }}
              ></Trans>
            </li>
            <li>
              <Trans
                i18nKey={"email"}
                ns="common"
                components={{
                  1: <a href={t("common:emailURL")} />,
                }}
              ></Trans>
            </li>
            <li>
              <Trans
                i18nKey={"infoCenter"}
                ns="common"
                components={{
                  1: <a href={t("common:infoCenterURL")} />,
                }}
              ></Trans>
            </li>
          </ul>
        </>
      ),
      expanded: false,
      id: "faq_check_amount_different_than_expected_2024",
      handleToggle: () => fireEventWhenFaqOpened("faq_check_amount_different_than_expected_2024"),
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
                  1: <a href={t("common:callNumber")} />,
                }}
              ></Trans>
            </li>
            <li>
              <Trans
                i18nKey={"email"}
                ns="common"
                components={{
                  1: <a href={t("common:emailURL")} />,
                }}
              ></Trans>
            </li>
            <li>
              <Trans
                i18nKey={"infoCenter"}
                ns="common"
                components={{
                  1: <a href={t("common:infoCenterURL")} />,
                }}
              ></Trans>
            </li>
          </ul>
        </>
      ),
      expanded: false,
      id: "faq_have_not_received_check_next_steps_2024",
      handleToggle: () => fireEventWhenFaqOpened("faq_have_not_received_check_next_steps_2024"),
    },
  ];
};
