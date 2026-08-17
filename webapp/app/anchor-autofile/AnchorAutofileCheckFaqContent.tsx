import { fireEventWhenFaqOpened, type FaqItem } from "@/components/FaqSection";

export const AnchorAutofileCheckFaqContent: FaqItem[] = [
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
    id: "faq_anchor_check_did_not_receive_confirmation_in_mail",
    handleToggle: () =>
      fireEventWhenFaqOpened("faq_anchor_check_did_not_receive_confirmation_in_mail"),
  },
  {
    title: "What if I need to change my mailing address?",
    content: (
      <>
        <p>
          To update your mailing address you must file a{" "}
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
    id: "faq_anchor_check_need_to_change_mailing_address",
    handleToggle: () => fireEventWhenFaqOpened("faq_anchor_check_need_to_change_mailing_address"),
  },
  {
    title: "What if I want to switch from a physical check to a direct deposit payment?",
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
    id: "faq_anchor_check_switch_physical_check_to_deposit",
    handleToggle: () => fireEventWhenFaqOpened("faq_anchor_check_switch_physical_check_to_deposit"),
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
    id: "faq_anchor_check_no_longer_eligible_opt_out",
    handleToggle: () => fireEventWhenFaqOpened("faq_anchor_check_no_longer_eligible_opt_out"),
  },
  {
    title: "What happens if I submitted an application on my own?",
    content: (
      <>
        <p>
          If you file an application on your own before September 16, 2026, we will not file an
          application on your behalf.
        </p>
      </>
    ),
    expanded: false,
    id: "faq_anchor_check_submitted_own_application",
    handleToggle: () => fireEventWhenFaqOpened("faq_anchor_check_submitted_own_application"),
  },
];
