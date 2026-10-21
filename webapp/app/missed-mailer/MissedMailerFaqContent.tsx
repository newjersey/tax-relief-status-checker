import { fireEventWhenFaqOpened, type FaqItem } from "@/components/FaqSection";
import { useTranslation } from "react-i18next";

export const MissedMailerFaqContent = (): FaqItem[] => {
  const { t } = useTranslation(["missedMailer", "common"]);
  return [
    {
      title: t("faq.notAutofiled.title"),
      content: (
        <>
          <p>{t("faq.notAutofiled.content")}</p>
        </>
      ),
      expanded: false,
      id: "faq_why_not_autofiled",
      handleToggle: () => fireEventWhenFaqOpened("faq_why_not_autofiled"),
    },
    {
      title: t("faq.recentlyApplied.title"),
      content: (
        <>
          <p>{t("faq.recentlyApplied.content")}</p>
        </>
      ),
      expanded: false,
      id: "faq_recently_applied_anchor",
      handleToggle: () => fireEventWhenFaqOpened("faq_recently_applied_anchor"),
    },
  ];
};
