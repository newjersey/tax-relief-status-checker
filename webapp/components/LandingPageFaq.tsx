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

interface LandingPageFaqProps {
  readonly headingLevel: HeadingLevel;
}

export const LandingPageFaq = (props: LandingPageFaqProps) => {
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
    title: "When can I expect my application to show up?",
    content: (
      <p>
        It can take up to three weeks after you submit your application to see that we've received
        it here. Paper applications can take up to 12 weeks.
      </p>
    ),
    expanded: false,
    id: "faq_when_can_i_expect_my_application_status",
    handleToggle: () => fireEventWhenFaqOpened("faq_when_can_i_expect_my_application_status"),
  },
  {
    title: "I applied, but I keep getting \u201CNo 2025 application found.\u201D Why?",
    content: (
      <>
        <p>Some common reasons this might be happening:</p>
        <ul>
          <li>
            <strong>Identity mismatch</strong>: The SSN/ITIN and ZIP code you filed on your
            application is different than the one you just entered.
          </li>
          <li>
            <strong>It&apos;s too soon</strong>: For online applications, it can take up to three
            weeks. For paper applications, it can take up to 12 weeks. For ANCHOR-only applicants,
            check back in the fall.
          </li>
          <li>
            <strong>Forgot to press submit</strong>: If you filed your 2025 application online, you
            should have received a Web Reference Number on the confirmation screen. Otherwise, your
            application was not successfully submitted. The filing deadline is November 2, 2026.
          </li>
          <li>
            <strong>Prior year PAS-1 filers</strong>: If you applied for a prior tax year (2024 or
            previous), check your{" "}
            <a href="https://www1.state.nj.us/TYTR_Saver/jsp/common/HRInquiry.jsp">
              application status
            </a>{" "}
            on this page.
          </li>
        </ul>
      </>
    ),
    expanded: false,
    id: "faq_no_2025_application_found",
    handleToggle: () => fireEventWhenFaqOpened("faq_no_2025_application_found"),
  },
  {
    title: "What if I need to update something after I\u2019ve submitted my application?",
    content: (
      <>
        <p>
          To update your application after submitting, reach out to us directly via phone or email.
          In order for us to locate your record, be ready to provide your full name and the full
          address of the property you applied for:
        </p>
        <ul>
          <li>
            Call: <a href="tel:+18882381233">1-888-238-1233</a> (Mondays to Fridays 8:30 a.m. to
            5:30 p.m.)
          </li>
          <li>
            Email: <a href="mailto:nj.anchor@treas.nj.gov">nj.anchor@treas.nj.gov</a>
          </li>
        </ul>
      </>
    ),
    expanded: false,
    id: "faq_update_after_submission",
    handleToggle: () => fireEventWhenFaqOpened("faq_update_after_submission"),
  },
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
    title: "My application is taking too long. Who do I contact?",
    content: (
      <>
        <p>
          If you have any questions or if processing has taken longer than expected, reach out to us
          directly via phone or email. In order for us to locate your record, be ready to provide
          your full name and the full address of the property you applied for:
        </p>
        <ul>
          <li>
            Call: <a href="tel:+18882381233">1-888-238-1233</a> (Mondays to Fridays 8:30 a.m. to
            5:30 p.m.)
          </li>
          <li>
            Email: <a href="mailto:nj.anchor@treas.nj.gov">nj.anchor@treas.nj.gov</a>
          </li>
        </ul>
      </>
    ),
    expanded: false,
    id: "faq_application_taking_too_long",
    handleToggle: () => fireEventWhenFaqOpened("faq_application_taking_too_long"),
  },
];
