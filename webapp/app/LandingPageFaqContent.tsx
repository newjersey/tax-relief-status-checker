import { Table } from "@trussworks/react-uswds";

import { fireEventWhenFaqOpened, type FaqItem } from "@/components/FaqSection";

export const LandingPageFaqContent: FaqItem[] = [
  {
    title: "When can I expect my application to show up?",
    content: (
      <p>
        For online applications, it can take up to three weeks for an application to show up on this
        website. For paper applications, it can take up to 12 weeks.
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
            <strong>Identity mismatch</strong>: The SSN/ITIN and ZIP code filed on your application
            is different than the one you just entered.
          </li>
          <li>
            <strong>It&apos;s too soon</strong>: For online applications, it can take up to three
            weeks. For paper applications, it can take up to 12 weeks.
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
    title: "When can I expect to receive a Senior Freeze payment?",
    content: (
      <>
        <Table className="usa-table" bordered={true} scrollable={true}>
          <thead>
            <tr>
              <th className="width-card">Payment period</th>
              <th className="width-mobile">Senior Freeze</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>July 2026-September 2026</strong>
              </td>
              <td>
                If you applied before May 1, you can expect to receive your payment between July 15
                and September 15.
              </td>
            </tr>
            <tr>
              <td>
                <strong>September 2026-October 2026</strong>
              </td>
              <td>
                If you applied between May 1 and June 1, you can expect to receive your payment
                between September 1 and October 1.
              </td>
            </tr>
            <tr>
              <td>
                <strong>November 2026</strong>
              </td>
              <td>
                If you applied between June 2 and September 1, you can expect to receive your
                payment between November 2 and January 2, 2027.
              </td>
            </tr>
            <tr>
              <td>
                <strong>December 2026</strong>
              </td>
              <td>
                If you applied between September 2 and October 31, you can expect to receive your
                payment between December 2, 2026 and February 2, 2027.
              </td>
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
    title: "When can I expect to receive an ANCHOR payment?",
    content: (
      <>
        <Table className="usa-table" bordered={true} scrollable={true}>
          <thead>
            <tr>
              <th className="width-card">Payment period</th>
              <th className="width-mobile">ANCHOR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>October 2026</strong>
              </td>
              <td>
                Payments start going out October 1, 2026. In some cases, payments will be made after
                2026.
              </td>
            </tr>
          </tbody>
        </Table>
      </>
    ),
    expanded: false,
    id: "faq_when_can_i_expect_to_receive_anchor_payments",
    handleToggle: () => fireEventWhenFaqOpened("faq_when_can_i_expect_to_receive_anchor_payments"),
  },
  {
    title: "When can I expect to receive a Stay NJ payment?",
    content: (
      <>
        <p>Stay NJ payments are paid out quarterly</p>
        <Table className="usa-table" bordered={true} scrollable={true}>
          <thead>
            <tr>
              <th className="width-card">Payment period</th>
              <th className="width-mobile">Stay NJ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>February 2027</strong>
              </td>
              <td>Payments start going out next year in February of next year.</td>
            </tr>
            <tr>
              <td>
                <strong>May 2027</strong>
              </td>
              <td>The second payment starts going out in May of next year.</td>
            </tr>
            <tr>
              <td>
                <strong>August 2027</strong>
              </td>
              <td>The third payment starts going out in August of next year.</td>
            </tr>
            <tr>
              <td>
                <strong>November 2027</strong>
              </td>
              <td>The fourth payment starts going out in November of next year.</td>
            </tr>
          </tbody>
        </Table>
      </>
    ),
    expanded: false,
    id: "faq_when_can_i_expect_to_receive_stay_nj_payments",
    handleToggle: () => fireEventWhenFaqOpened("faq_when_can_i_expect_to_receive_stay_nj_payments"),
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
