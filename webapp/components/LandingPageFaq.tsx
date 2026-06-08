import { Accordion, type HeadingLevel, type AccordionProps } from "@trussworks/react-uswds";

/** Expands a USWDS accordion item by ID and scrolls it into view. */
export const expandFaqAccordionItem = (itemId: string) => {
  const button = document.querySelector<HTMLButtonElement>(`button[aria-controls="${itemId}"]`);
  if (!button) return;

  if (button.getAttribute("aria-expanded") !== "true") {
    button.click();
  }

  button.scrollIntoView({ behavior: "smooth", block: "start" });
};

type AccordionItemProps = AccordionProps["items"][number];

/** Props for the LandingPageFaq component. */
interface LandingPageFaqProps {
  /** Heading level to use for each FAQ item title. */
  readonly headingLevel: HeadingLevel;
}

/** Accordion-style FAQ section for the landing page. */
export const LandingPageFaq = (props: LandingPageFaqProps) => {
  const faqContent: AccordionItemProps[] = [
    {
      title: "When can I expect my paper application to show up in this online tool?",
      content: (
        <p>
          For online applications, it can take up to 3 weeks before a status shows up. For paper
          applications, it can take up to 12 weeks before a status shows up.
        </p>
      ),
      expanded: false,
      id: "faq_when_paper_application_viewable",
      headingLevel: props.headingLevel,
    },
    {
      title: "I applied but I keep getting \u201CNo 2025 application found\u201D. Why?",
      content: (
        <>
          <p>Some common reasons this might be happening:</p>
          <ul>
            <li>
              <strong>Identity mismatch</strong>: The SSN/ITIN and zip code you filed on your
              application is different than the one you entered in this tool.
            </li>
            <li>
              <strong>It&apos;s too soon</strong>: For online applications, it can take up to 3
              weeks. For paper applications, it can take up to 12 weeks. For ANCHOR-only applicants,
              check back in the Fall.
            </li>
            <li>
              <strong>Forgot to press submit</strong>: If you filed your 2025 application online you
              should have received a Web Reference Number on the confirmation screen. Otherwise,
              your application was not successfully submitted. The filing deadline is November 2,
              2026.
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
      headingLevel: props.headingLevel,
    },
    {
      title: "What if I need to update something after I\u2019ve submitted my application?",
      content: (
        <>
          <p>
            To update your application after submitting, reach out to us directly via phone or
            email. In order for us to locate your record, be ready to provide your full name and the
            full address of the property you applied for:
          </p>
          <ul>
            <li>
              Call: <a href="tel:18882381233">1-888-238-1233</a> (Mondays to Fridays 8:30 a.m. to
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
      headingLevel: props.headingLevel,
    },
    {
      title: "When can I expect to receive payments?",
      content: (
        <>
          <p>
            Even though PAS-1 combines all 3 programs into 1 application, each program has a
            different payment schedule. The table below outlines when you can expect to receive your
            payment(s) from each program. Your payment will be delayed if there is an issue with
            your application, or if we need additional information from you.
          </p>
          <table className="usa-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Senior Freeze</th>
                <th>ANCHOR</th>
                <th>Stay NJ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong className="text-uppercase">July-September</strong>
                </td>
                <td>
                  Payments start going out on July 15. If you applied before May 1, you can expect
                  to get your payment between July 15 and September 15.
                </td>
                <td></td>
                <td>
                  Timing and amount are subject to the{" "}
                  <a href="https://reportcard.nj.gov/">Fiscal Year 2027 State Budget</a>, which the
                  state legislature is expected to finalize by July 1. Payments start going out next
                  year in February (2027). They are paid out quarterly.
                </td>
              </tr>
              <tr>
                <td>
                  <strong className="text-uppercase">September-October</strong>
                </td>
                <td>
                  If you applied between May 1 and June 1, you can expect to get your payment
                  between September 1 and October 1.
                </td>
                <td>
                  Payments start going out on September 1. You can expect to get your payment before
                  December 1.
                </td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <strong className="text-uppercase">November</strong>
                </td>
                <td>
                  If you applied between June 2 and September 1, you can expect to get your payment
                  between November 2 and January 2, 2027.
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <strong className="text-uppercase">December</strong>
                </td>
                <td>
                  If you applied between September 2 and October 31, you can expect to get your
                  payment between December 2, 2026 and February 2, 2027.
                </td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </>
      ),
      expanded: false,
      id: "faq_when_can_i_expect_to_receive_payments",
      headingLevel: props.headingLevel,
    },
    {
      title: "My application is taking too long. Who do I contact?",
      content: (
        <p>
          If you have any questions or if processing has taken longer than expected, call our help
          line at <a href="tel:18882381233">1-888-238-1233</a> (Mondays to Fridays 8:30 a.m. to 5:30
          p.m.) or visit a Regional Information Center (RIC),{" "}
          <a href="https://nj.gov/treasury/taxation/contact-office.shtml#:~:text=We%20can%20assist%20you%20or%20your%20businesses%20with,assistance%20from%208%3A30%20a.m.%20to%204%3A30%20p.m.%2C%20Monday-Friday.">
            find a location
          </a>{" "}
          near you.
        </p>
      ),
      expanded: false,
      id: "faq_application_taking_too_long",
      headingLevel: props.headingLevel,
    },
  ];

  return <Accordion multiselectable={true} items={faqContent} />;
};
