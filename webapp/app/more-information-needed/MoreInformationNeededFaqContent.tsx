import { Trans, useTranslation } from "react-i18next";
import { fireEventWhenFaqOpened, type FaqItem } from "@/components/FaqSection";

export const MoreInformationNeededFaqContent = (): FaqItem[] => {
  const { t } = useTranslation(["moreInfo", "common"]);
  return [
    {
      title: t("faq.appTakingTooLong.title"),
      content: (
        <>
          <p>
            <Trans
              i18nKey={"faq.appTakingTooLong.content"}
              ns="moreInfo"
              components={{
                1: <a href={t("faq.appTakingTooLong.link")} target="_blank" />,
              }}
            ></Trans>
          </p>
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
          </ul>
        </>
      ),
      expanded: false,
      id: "faq_update_after_submission",
      handleToggle: () => fireEventWhenFaqOpened("faq_update_after_submission"),
    },
  ];
};
