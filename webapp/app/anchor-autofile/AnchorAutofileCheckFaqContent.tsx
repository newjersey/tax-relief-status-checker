import { fireEventWhenFaqOpened, type FaqItem } from "@/components/FaqSection";

export const AnchorAutofileCheckFaqContent: FaqItem[] = [
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
    id: "faq_anchor_check_did_not_receive_confirmation_in_mail",
    handleToggle: () =>
      fireEventWhenFaqOpened("faq_anchor_check_did_not_receive_confirmation_in_mail"),
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
    id: "faq_anchor_check_need_to_change_banking",
    handleToggle: () => fireEventWhenFaqOpened("faq_anchor_check_need_to_change_banking"),
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
    id: "faq_anchor_check_need_to_change_banking",
    handleToggle: () => fireEventWhenFaqOpened("faq_anchor_check_need_to_change_banking"),
  },
];
