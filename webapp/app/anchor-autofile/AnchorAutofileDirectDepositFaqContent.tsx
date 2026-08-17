import { fireEventWhenFaqOpened, type FaqItem } from "@/components/FaqSection";

export const AnchorAutofileDirectDepositFaqContent: FaqItem[] = [
  {
    title: "What if I did not receive a ANCHOR Benefit Confirmation Letter in the mail?",
    content: (
      <>
        <p>
          In your case, the Division is filing on your behalf. You do not need to file an ANCHOR
          application.
        </p>
      </>
    ),
    expanded: false,
    id: "faq_anchor_dd_did_not_receive_confirmation_in_mail",
    handleToggle: () =>
      fireEventWhenFaqOpened("faq_anchor_dd_did_not_receive_confirmation_in_mail"),
  },
  {
    title: "What if I need to update my banking information?",
    content: (
      <>
        <p>
          To update your banking information you must file a{" "}
          <a
            href="https://propertytaxreliefapp.nj.gov/File/Eligibility"
            target="_blank"
            rel="noopener noreferrer"
          >
            web application
          </a>
          .
        </p>
      </>
    ),
    expanded: false,
    id: "faq_anchor_dd_need_to_update_banking",
    handleToggle: () => fireEventWhenFaqOpened("faq_anchor_dd_need_to_update_banking"),
  },
  {
    title: "How can I switch from a direct deposit payment to a physical check?",
    content: (
      <>
        <p>
          To update your payment method you must file a{" "}
          <a
            href="https://propertytaxreliefapp.nj.gov/File/Eligibility"
            target="_blank"
            rel="noopener noreferrer"
          >
            web application
          </a>
          .
        </p>
      </>
    ),
    expanded: false,
    id: "faq_anchor_dd_need_to_switch_to_check",
    handleToggle: () => fireEventWhenFaqOpened("faq_anchor_dd_need_to_switch_to_check"),
  },
  {
    title: "I know I'm no longer eligible for ANCHOR anymore. How do I opt out?",
    content: (
      <>
        <p>
          If your eligibility has changed since last year, you must{" "}
          <a
            href="https://propertytaxreliefapp.nj.gov/ANCHOROptOut"
            target="_blank"
            rel="noopener noreferrer"
          >
            opt out
          </a>{" "}
          before September 16, 2026. This lets the Division know not to file on your behalf and
          avoids you having to repay those funds if you're not eligible this year.
        </p>
      </>
    ),
    expanded: false,
    id: "faq_anchor_dd_no_longer_eligible_for_anchor",
    handleToggle: () => fireEventWhenFaqOpened("faq_anchor_dd_no_longer_eligible_for_anchor"),
  },
  {
    title: "What happens if I submitted an application on my own?",
    content: (
      <>
        <p>
          The application you filed replaces the version we filed on your behalf. However, it must
          be filed before September 16, 2026, when the Division files applications.
        </p>
        <p>If you miss the deadline, contact the Division:</p>
        <ul>
          <li>
            Call: <a href="tel:+18882381233">1-888-238-1233</a> (Monday to Friday 8:30 a.m. to 5:30
            p.m.)
          </li>
          <li>
            Or email: <a href="mailto:nj.anchor@treas.nj.gov">nj.anchor@treas.nj.gov</a>
          </li>
          <li>
            Or visit one of our{" "}
            <a
              href="https://www.nj.gov/treasury/taxation/contact-office.shtml"
              target="_blank"
              rel="noopener noreferrer"
            >
              Regional Information Centers
            </a>
          </li>
        </ul>
      </>
    ),
    expanded: false,
    id: "faq_anchor_dd_submitted_own_application",
    handleToggle: () => fireEventWhenFaqOpened("faq_anchor_dd_submitted_own_application"),
  },
];
