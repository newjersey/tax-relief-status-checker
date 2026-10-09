import { Table } from "@trussworks/react-uswds";

import { fireEventWhenFaqOpened, type FaqItem } from "@/components/FaqSection";
import { Trans, useTranslation } from "react-i18next";

export const PASPaymentInfoFaqContent = (): FaqItem[] => {
  const { t } = useTranslation(["paymentInfo", "common"]);

  return [
    {
      title: t("faq.whenCanIExpect.title"),
      content: (
        <>
          <p>{t("faq.whenCanIExpect.content.text1")}</p>

          <p>{t("faq.whenCanIExpect.content.text2")}</p>
          <Table className="usa-table" bordered={true} scrollable={true}>
            <thead>
              <tr>
                <th className="width-card">{t("faq.whenCanIExpect.content.month")}</th>
                <th className="width-mobile">{t("common:seniorFreeze")}</th>
                <th className="width-mobile">{t("common:anchor")}</th>
                <th className="width-mobile">{t("common:stayNJ")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong className="text-uppercase">
                    {t("faq.whenCanIExpect.content.julToSep.date")}
                  </strong>
                </td>
                <td>{t("faq.whenCanIExpect.content.julToSep.text1")}</td>
                <td></td>
                <td>{t("faq.whenCanIExpect.content.julToSep.text2")}</td>
              </tr>
              <tr>
                <td>
                  <strong className="text-uppercase">
                    {t("faq.whenCanIExpect.content.sepToOct.date")}
                  </strong>
                </td>
                <td>{t("faq.whenCanIExpect.content.sepToOct.text1")}</td>
                <td>{t("faq.whenCanIExpect.content.sepToOct.text2")}</td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <strong className="text-uppercase">
                    {t("faq.whenCanIExpect.content.nov.date")}
                  </strong>
                </td>
                <td>{t("faq.whenCanIExpect.content.nov.text")}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <strong className="text-uppercase">
                    {t("faq.whenCanIExpect.content.dec.date")}
                  </strong>
                </td>
                <td>{t("faq.whenCanIExpect.content.dec.text")}</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </>
      ),
      expanded: false,
      id: "faq_when_can_i_expect_to_receive_payments_pas1",
      handleToggle: () => fireEventWhenFaqOpened("faq_when_can_i_expect_to_receive_payments_pas1"),
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
      id: "faq_check_amount_different_than_expected_pas1",
      handleToggle: () => fireEventWhenFaqOpened("faq_check_amount_different_than_expected_pas1"),
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
      id: "faq_have_not_received_check_next_steps_pas1",
      handleToggle: () => fireEventWhenFaqOpened("faq_have_not_received_check_next_steps_pas1"),
    },
  ];
};
