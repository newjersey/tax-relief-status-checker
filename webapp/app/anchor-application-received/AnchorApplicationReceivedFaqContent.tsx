import { fireEventWhenFaqOpened, type FaqItem } from "@/components/FaqSection";
import { Trans, useTranslation } from "react-i18next";

export const AnchorApplicationReceivedFaqContent = (): FaqItem[] => {
  const { t } = useTranslation(["ancAppRec", "common"]);
  return [
    {
      title: t("faq.appTakingTooLong.title"),
      content: (
        <>
          <p>{t("faq.appTakingTooLong.content")}</p>
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
          </ul>
        </>
      ),
      expanded: false,
      id: "faq_application_taking_too_long",
      handleToggle: () => fireEventWhenFaqOpened("faq_application_taking_too_long"),
    },
    {
      title: t("faq.updateAfterSubmission.title"),
      content: (
        <>
          <p>{t("faq.updateAfterSubmission.content")}</p>
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
          </ul>
        </>
      ),
      expanded: false,
      id: "faq_update_after_submission",
      handleToggle: () => fireEventWhenFaqOpened("faq_update_after_submission"),
    },
  ];
};
