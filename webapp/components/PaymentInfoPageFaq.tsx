import { logGAEvent } from "@/app/utils/analytics";
import { Accordion, type HeadingLevel, type AccordionProps, Table } from "@trussworks/react-uswds";

export const expandFaqAccordionItem = (itemId: string) => {
  const button = document.querySelector<HTMLButtonElement>(`button[aria-controls="${itemId}"]`);
  if (!button) return;

  if (button.getAttribute("aria-expanded") !== "true") {
    button.click();
  }

  button.scrollIntoView({ behavior: "smooth", block: "start" });
};

const fireEventWhenFaqOpened = (faqId: string) => {
  const button = document.querySelector<HTMLButtonElement>(`button[aria-controls="${faqId}"]`);
  const isExpanded = button?.getAttribute("aria-expanded") === "true";
  if (!isExpanded) {
    logGAEvent(`${faqId}_opened`);
  }
};

type AccordionItemContent = Omit<AccordionItemProps, "headingLevel">;

type AccordionItemProps = AccordionProps["items"][number];

interface PaymentInfoPageFaqProps {
  readonly headingLevel: HeadingLevel;
}

export const PaymentInfoPageFaq = (props: PaymentInfoPageFaqProps) => {
  const faqProps: AccordionItemProps[] = FaqContent.map((faqItem) => {
    return {
      ...faqItem,
      headingLevel: props.headingLevel,
    };
  });
  return <Accordion multiselectable={true} items={faqProps} />;
};

export const FaqContent: AccordionItemContent[] = [
  {
    title: "When can I expect to receive payments?",
    content: (
      <>
        <p>
          Even though PAS-1 combines all three programs into one application, each program has a
          different payment schedule. The table below outlines when you can expect to receive your
          payment(s) from each program. Your payment will be delayed if there is an issue with your
          application, or if we need additional information from you.
        </p>
        <Table className="usa-table" bordered={true} scrollable={true}>
          <thead>
            <tr>
              <th className="width-card">Month</th>
              <th className="width-mobile">Senior Freeze</th>
              <th className="width-mobile">ANCHOR</th>
              <th className="width-mobile">Stay NJ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong className="text-uppercase">July-September</strong>
              </td>
              <td>
                Payments start going out on July 15, 2026. If you applied before May 1, 2026, you
                can expect to get your payment between July 15, 2026 and September 15, 2026.
              </td>
              <td></td>
              <td>
                Stay NJ is paid in quarterly installments. The 2025 benefit will be paid in February
                and May of 2027.
              </td>
            </tr>
            <tr>
              <td>
                <strong className="text-uppercase">September-October</strong>
              </td>
              <td>
                If you applied between May 1, 2026 and June 1, 2026, you can expect to get your
                payment between September 1, 2026 and October 1, 2026.
              </td>
              <td>
                Payments start going out on September 15, 2026. You can expect to get your payment
                before December 1, 2026.
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                <strong className="text-uppercase">November</strong>
              </td>
              <td>
                If you applied between June 2, 2026 and September 1, 2026, you can expect to get
                your payment between November 2, 2026 and January 2, 2027.
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>
                <strong className="text-uppercase">December</strong>
              </td>
              <td>
                If you applied between September 2, 2026 and October 31, 2026, you can expect to get
                your payment between December 2, 2026 and February 2, 2027.
              </td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </Table>
      </>
    ),
    expanded: false,
    id: "faq_when_can_i_expect_to_receive_payments",
    handleToggle: () => fireEventWhenFaqOpened("faq_when_can_i_expect_to_receive_payments"),
  },
  {
    title: "A check amount is different than what I expected. Who can I contact?",
    content: (
      <>
        <p>Please contact the Division using ONLY ONE of the following:</p>
        <ul>
          <li>
            Call: <a href="tel:+18882381233">1-888-238-1233</a> (Monday to Friday 8:30 a.m. to 5:30
            p.m.)
          </li>
          <li>
            Email: <a href="mailto:nj.anchor@treas.nj.gov">nj.anchor@treas.nj.gov</a>
          </li>
          <li>
            Visit one of our{" "}
            <a href="https://www.nj.gov/treasury/taxation/contact-office.shtml">
              Regional Information Centers
            </a>
          </li>
        </ul>
      </>
    ),
    expanded: false,
    id: "faq_check_amount_different_than_expected",
    handleToggle: () => fireEventWhenFaqOpened("faq_check_amount_different_than_expected"),
  },
  {
    title: "I have not received my check in the mail. What should I do next?",
    content: (
      <>
        <p>Please contact the Division using ONLY ONE of the following:</p>
        <ul>
          <li>
            Call: <a href="tel:+18882381233">1-888-238-1233</a> (Monday to Friday 8:30 a.m. to 5:30
            p.m.)
          </li>
          <li>
            Email: <a href="mailto:nj.anchor@treas.nj.gov">nj.anchor@treas.nj.gov</a>
          </li>
          <li>
            Visit one of our{" "}
            <a href="https://www.nj.gov/treasury/taxation/contact-office.shtml">
              Regional Information Centers
            </a>
          </li>
        </ul>
      </>
    ),
    expanded: false,
    id: "faq_have_not_received_check_next_steps",
    handleToggle: () => fireEventWhenFaqOpened("faq_have_not_received_check_next_steps"),
  },
];
