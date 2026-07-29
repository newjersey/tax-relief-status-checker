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
    title: "When can I expect my application to show up?",
    content: (
      <p>
        For online applications, it can take up to three weeks for an application to show up on this
        website. For paper applications, it can take up to 12 weeks. For ANCHOR-only applicants,
        check back in the fall of 2026.
      </p>
    ),
    expanded: false,
    id: "faq_when_can_i_expect_my_application_status",
    handleToggle: () => fireEventWhenFaqOpened("faq_when_can_i_expect_my_application_status"),
  },
  {
    title: "A check amount is different than what I expected. Who can I contact?",
    content: (
      <>
        <p>Please contact the Division using ONLY ONE of the following:</p>
        <ul>
          <li>
            Call: <a href="tel:+18882381233">1-888-2388-1233</a> (Monday to Friday 8:30 a.m. to 5:30
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
            Call: <a href="tel:+18882381233">1-888-2388-1233</a> (Monday to Friday 8:30 a.m. to 5:30
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
