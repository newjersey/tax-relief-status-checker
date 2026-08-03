import { logGAEvent } from "@/app/utils/analytics";
import { Accordion, type HeadingLevel, type AccordionProps } from "@trussworks/react-uswds";

type AccordionItemProps = AccordionProps["items"][number];

// FaqSectionProps supplies heading level for all AccordionItems
export type FaqItem = Omit<AccordionItemProps, "headingLevel">;

interface FaqSectionProps {
  readonly items: FaqItem[];
  readonly titleHeadingLevel: HeadingLevel;
  readonly itemHeadingLevel: HeadingLevel;
}

export const FaqSection = (props: FaqSectionProps) => {
  const { items, titleHeadingLevel, itemHeadingLevel } = props;

  const FaqHeaderTag = titleHeadingLevel;

  const accordionItems: AccordionItemProps[] = items.map((faqItem) => ({
    ...faqItem,
    headingLevel: itemHeadingLevel,
  }));

  return (
    <>
      <FaqHeaderTag className="font-heading-l">Frequently Asked Questions (FAQs)</FaqHeaderTag>
      <Accordion multiselectable={true} items={accordionItems} />
    </>
  );
};

export const expandFaqAccordionItem = (itemId: string) => {
  const button = document.querySelector<HTMLButtonElement>(`button[aria-controls="${itemId}"]`);
  if (!button) return;

  if (button.getAttribute("aria-expanded") !== "true") {
    button.click();
  }

  button.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const fireEventWhenFaqOpened = (faqId: string) => {
  const button = document.querySelector<HTMLButtonElement>(`button[aria-controls="${faqId}"]`);
  const isExpanded = button?.getAttribute("aria-expanded") === "true";
  if (!isExpanded) {
    logGAEvent(`${faqId}_opened`);
  }
};
