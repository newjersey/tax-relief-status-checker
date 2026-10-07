import { Table } from "@trussworks/react-uswds";
import { Trans, useTranslation } from "react-i18next";
import { fireEventWhenFaqOpened, type FaqItem } from "@/components/FaqSection";

export const LandingPageFaqContent = (): FaqItem[] => {
  const { t } = useTranslation("landing");
  return [
    {
      title: t("faq.whenCanIExpect.title"),
      content: <p>{t("faq.whenCanIExpect.content")}</p>,
      expanded: false,
      id: "faq_when_can_i_expect_my_application_status",
      handleToggle: () => fireEventWhenFaqOpened("faq_when_can_i_expect_my_application_status"),
    },
    {
      title: t("faq.no2025Application.title"),
      content: (
        <>
          <p>{t("faq.no2025Application.content.commonReasons")}</p>
          <ul>
            <li>
              <Trans i18nKey={"faq.no2025Application.content.identityMismatch"} ns="landing">
                <strong>Identity mismatch</strong>: The SSN/ITIN and ZIP code filed on your
                application is different than the one you just entered.
              </Trans>
            </li>
            <li>
              <Trans i18nKey={"faq.no2025Application.content.tooSoon"} ns="landing">
                <strong>It&apos;s too soon</strong>: For online applications, it can take up to
                three weeks. For paper applications, it can take up to 12 weeks.
              </Trans>
            </li>
            <li>
              <Trans i18nKey={"faq.no2025Application.content.forgotToSubmit"} ns="landing">
                <strong>Forgot to press submit</strong>: If you filed your 2025 application online,
                you should have received a Web Reference Number on the confirmation screen.
                Otherwise, your application was not successfully submitted. The filing deadline is
                November 2, 2026.
              </Trans>
            </li>
            <li>
              <Trans i18nKey={"faq.no2025Application.content.priorYears.text"} ns="landing">
                <strong>Prior year PAS-1 filers</strong>: If you applied for a prior tax year (2024
                or previous), check your{" "}
              </Trans>
              <Trans
                i18nKey={"faq.no2025Application.content.priorYears.link"}
                ns="landing"
                components={{
                  1: <a href="https://www1.state.nj.us/TYTR_Saver/jsp/common/HRInquiry.jsp" />,
                }}
              ></Trans>
            </li>
          </ul>
        </>
      ),
      expanded: false,
      id: "faq_no_2025_application_found",
      handleToggle: () => fireEventWhenFaqOpened("faq_no_2025_application_found"),
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
                ns="landing"
                components={{
                  1: <a href="tel:+18882381233" />,
                }}
              ></Trans>
            </li>
            <li>
              <Trans
                i18nKey={"email"}
                ns="landing"
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
    {
      title: t("faq.whenToExpectSeniorFreeze.title"),
      content: (
        <>
          <Table className="usa-table" bordered={true} scrollable={true}>
            <thead>
              <tr>
                <th className="width-card">{t("paymentPeriod")}</th>
                <th className="width-mobile">{t("seniorFreeze")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{t("faq.whenToExpectSeniorFreeze.content.julToSep.date")}</strong>
                </td>
                <td>{t("faq.whenToExpectSeniorFreeze.content.julToSep.text")}</td>
              </tr>
              <tr>
                <td>
                  <strong>{t("faq.whenToExpectSeniorFreeze.content.sepToOct.date")}</strong>
                </td>
                <td>{t("faq.whenToExpectSeniorFreeze.content.sepToOct.text")}</td>
              </tr>
              <tr>
                <td>
                  <strong>{t("faq.whenToExpectSeniorFreeze.content.nov.date")}</strong>
                </td>
                <td>{t("faq.whenToExpectSeniorFreeze.content.nov.text")}</td>
              </tr>
              <tr>
                <td>
                  <strong>{t("faq.whenToExpectSeniorFreeze.content.dec.date")}</strong>
                </td>
                <td>{t("faq.whenToExpectSeniorFreeze.content.dec.text")}</td>
              </tr>
            </tbody>
          </Table>
        </>
      ),
      expanded: false,
      id: "faq_when_can_i_expect_to_receive_senior_freeze_payments",
      handleToggle: () =>
        fireEventWhenFaqOpened("faq_when_can_i_expect_to_receive_senior_freeze_payments"),
    },
    {
      title: t("faq.whenToExpectAnchor.title"),
      content: (
        <>
          <Table className="usa-table" bordered={true} scrollable={true}>
            <thead>
              <tr>
                <th className="width-card">{t("paymentPeriod")}</th>
                <th className="width-mobile">{t("anchor")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{t("faq.whenToExpectAnchor.content.oct.date")}</strong>
                </td>
                <td>{t("faq.whenToExpectAnchor.content.oct.text")}</td>
              </tr>
            </tbody>
          </Table>
        </>
      ),
      expanded: false,
      id: "faq_when_can_i_expect_to_receive_anchor_payments",
      handleToggle: () =>
        fireEventWhenFaqOpened("faq_when_can_i_expect_to_receive_anchor_payments"),
    },
    {
      title: t("faq.whenToExpectStay.title"),
      content: (
        <>
          <p>{t("faq.whenToExpectStay.content.quarterly")}</p>
          <Table className="usa-table" bordered={true} scrollable={true}>
            <thead>
              <tr>
                <th className="width-card">{t("paymentPeriod")}</th>
                <th className="width-mobile">{t("stayNJ")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{t("faq.whenToExpectStay.content.feb.date")}</strong>
                </td>
                <td>{t("faq.whenToExpectStay.content.feb.text")}</td>
              </tr>
              <tr>
                <td>
                  <strong>{t("faq.whenToExpectStay.content.may.date")}</strong>
                </td>
                <td>{t("faq.whenToExpectStay.content.may.text")}</td>
              </tr>
              <tr>
                <td>
                  <strong>{t("faq.whenToExpectStay.content.aug.date")}</strong>
                </td>
                <td>{t("faq.whenToExpectStay.content.aug.text")}</td>
              </tr>
              <tr>
                <td>
                  <strong>{t("faq.whenToExpectStay.content.nov.date")}</strong>
                </td>
                <td>{t("faq.whenToExpectStay.content.nov.text")}</td>
              </tr>
            </tbody>
          </Table>
        </>
      ),
      expanded: false,
      id: "faq_when_can_i_expect_to_receive_stay_nj_payments",
      handleToggle: () =>
        fireEventWhenFaqOpened("faq_when_can_i_expect_to_receive_stay_nj_payments"),
    },
    {
      title: t("faq.appTakingTooLong.title"),
      content: (
        <>
          <p>{t("faq.appTakingTooLong.content")}</p>
          <ul>
            <li>
              <Trans
                i18nKey={"call"}
                ns="landing"
                components={{
                  1: <a href="tel:+18882381233" />,
                }}
              ></Trans>
            </li>
            <li>
              <Trans
                i18nKey={"email"}
                ns="landing"
                components={{
                  1: <a href="mailto:nj.anchor@treas.nj.gov" />,
                }}
              ></Trans>{" "}
            </li>
          </ul>
        </>
      ),
      expanded: false,
      id: "faq_application_taking_too_long",
      handleToggle: () => fireEventWhenFaqOpened("faq_application_taking_too_long"),
    },
  ];
};
