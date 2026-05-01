import { Accordion, type HeadingLevel } from "@trussworks/react-uswds";
import type { AccordionItemProps } from "/node_modules/@trussworks/react-uswds/lib/components/Accordion/Accordion";

export const LandingPageFaq = (props: { headingLevel: HeadingLevel }) => {
  const faqContent: AccordionItemProps[] = [
    {
      title: "When can I expect my paper application to show up in this online tool?",
      content: <p>Placeholder</p>,
      expanded: false,
      id: "faq_when_paper_application_viewable",
      headingLevel: props.headingLevel,
    },
    {
      title: "When do payments start getting issued?",
      content: <p>Placeholder2</p>,
      expanded: false,
      id: "faq_when_payments_issued",
      headingLevel: props.headingLevel,
    },
    {
      title: "Why are 2022 and 2023 missing from the tax year selection?",
      content: <p>Placeholder3</p>,
      expanded: false,
      id: "faq_missing_tax_years",
      headingLevel: props.headingLevel,
    },
    {
      title: "What if I need to update something after I’ve submitted my application?",
      content: <p>Placeholder4</p>,
      expanded: false,
      id: "faq_update_after_submission",
      headingLevel: props.headingLevel,
    },
    {
      title:
        "My application has been sitting in processing longer than expected, who should I reach out to?",
      content: <p>Placeholder5</p>,
      expanded: false,
      id: "faq_application_processing_longer_than_expected",
      headingLevel: props.headingLevel,
    },
  ];

  return <Accordion multiselectable={true} items={faqContent} />;
};
