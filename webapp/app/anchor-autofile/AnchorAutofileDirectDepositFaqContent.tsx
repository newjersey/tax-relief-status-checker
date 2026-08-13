import { fireEventWhenFaqOpened, type FaqItem } from "@/components/FaqSection";

export const AnchorAutofileDirectDepositFaqContent: FaqItem[] = [
  {
    title: "What if I did not receive a ANCHOR Benefit Confirmation Letter in the mail?",
    content: (
      <>
        <p>
          That's okay, nothing's wrong. The State is autofiling on your behalf regardless of whether
          you received a letter. If you need to change your payment method or mailing address,
          you'll need to file an application manually{" "}
          <a href="https://propertytaxreliefapp.nj.gov/">online</a> or by mailing{" "}
          <a href="https://www.nj.gov/treasury/taxation/propertyreliefforms.shtml">
            a paper application
          </a>{" "}
          to:{" "}
        </p>
        <p>NJ Division of Taxation</p>
        <p>Revenue Processing Center Property</p>
        <p>Tax Relief Application</p>
        <p>PO Box 636</p>
        <p>Trenton, NJ 08646-0636</p>
      </>
    ),
    expanded: false,
    id: "faq_anchor_dd_did_not_receive_confirmation_in_mail",
    handleToggle: () =>
      fireEventWhenFaqOpened("faq_anchor_dd_did_not_receive_confirmation_in_mail"),
  },
  {
    title: "What if I need to change my banking information?",
    content: (
      <>
        <p>
          You'll need to file an application manually to change your banking information. Otherwise,
          your benefit will go to the bank account on file from last year.
        </p>
        <p>
          To file an application manually, you can do it
          <a href="https://propertytaxreliefapp.nj.gov/">online</a> or by mailing{" "}
          <a href="https://www.nj.gov/treasury/taxation/propertyreliefforms.shtml">
            a paper application
          </a>{" "}
          to:{" "}
        </p>
        <p>NJ Division of Taxation</p>
        <p>Revenue Processing Center Property</p>
        <p>Tax Relief Application</p>
        <p>PO Box 636</p>
        <p>Trenton, NJ 08646-0636</p>
      </>
    ),
    expanded: false,
    id: "faq_anchor_dd_need_to_change_banking",
    handleToggle: () => fireEventWhenFaqOpened("faq_anchor_dd_need_to_change_banking"),
  },
  {
    title: "How can I switch from a direct deposit payment to a physical check?",
    content: (
      <>
        <p>
          You'll need to file an application manually to change your payment method. Otherwise, your
          benefit will be directly deposited.
        </p>
        <p>
          To file an application manually, you can do it
          <a href="https://propertytaxreliefapp.nj.gov/">online</a> or by mailing{" "}
          <a href="https://www.nj.gov/treasury/taxation/propertyreliefforms.shtml">
            a paper application
          </a>{" "}
          to:{" "}
        </p>
        <p>NJ Division of Taxation</p>
        <p>Revenue Processing Center Property</p>
        <p>Tax Relief Application</p>
        <p>PO Box 636</p>
        <p>Trenton, NJ 08646-0636</p>
      </>
    ),
    expanded: false,
    id: "faq_anchor_dd_need_to_switch_to_check",
    handleToggle: () => fireEventWhenFaqOpened("faq_anchor_dd_need_to_switch_to_check"),
  },
  {
    title: "I know I'm no longer eligible for ANCHOR anymore. What do I need to do?",
    content: (
      <>
        <p>
          If your eligibility has changed since last year, you can{" "}
          <a href="https://propertytaxreliefapp.nj.gov/ANCHOROptOut">opt out of autofiling</a>. This
          lets the State know not to file on your behalf, so you won't be autofiled for a benefit
          you may no longer qualify for.
        </p>
      </>
    ),
    expanded: false,
    id: "faq_anchor_dd_no_longer_eligible_for_anchor",
    handleToggle: () => fireEventWhenFaqOpened("faq_anchor_dd_no_longer_eligible_for_anchor"),
  },
  {
    title: "What happens if I submit a manual application?",
    content: (
      <>
        <p>
          A manual application overrides the autofiled version. However, it must be submitted before
          September 15, when the State files autofiled applications. Submitting after that date will
          be too late to make changes. To manually submit an application, you can do it{" "}
          <a href="https://propertytaxreliefapp.nj.gov/">online</a> or by mailing{" "}
          <a href="https://www.nj.gov/treasury/taxation/propertyreliefforms.shtml">
            a paper application
          </a>{" "}
          to:
        </p>

        <p>NJ Division of Taxation</p>
        <p>Revenue Processing Center Property</p>
        <p>Tax Relief Application</p>
        <p>PO Box 636</p>
        <p>Trenton, NJ 08646-0636</p>

        <p>
          If your check is sent to the wrong address, or your direct deposit goes to the wrong
          account, contact the Division to have it corrected using one of the following:
        </p>
        <ul>
          <li>Call: 1-888-238-1233 (Monday to Friday 8:30 a.m. to 5:30 p.m.)</li>
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
    id: "faq_anchor_dd_no_longer_eligible_for_anchor",
    handleToggle: () => fireEventWhenFaqOpened("faq_anchor_dd_no_longer_eligible_for_anchor"),
  },
];
