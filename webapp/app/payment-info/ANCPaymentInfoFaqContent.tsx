import { fireEventWhenFaqOpened, type FaqItem } from "@/components/FaqSection";

export const ANCPaymentInfoFaqContent: FaqItem[] = [
  {
    title: "A check amount is different than what I expected. Who can I contact?",
    content: (
      <>
        <p>Please contact the Division using one of the following:</p>
        <ul>
          <li>
            Call: <a href="tel:+18882381233">1-888-238-1233</a> (Monday to Friday 8:30 a.m. to 5:30
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
        <p>Please contact the Division using one of the following:</p>
        <ul>
          <li>
            Call: <a href="tel:+18882381233">1-888-238-1233</a> (Monday to Friday 8:30 a.m. to 5:30
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
