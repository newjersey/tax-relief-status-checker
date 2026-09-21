import { fireEventWhenFaqOpened, type FaqItem } from "@/components/FaqSection";

export const ApplicationReceivedFaqContent: FaqItem[] = [
  {
    title: "What if I didn't receive a payment yet?",
    content: (
      <>
        <p>
          We are currently processing thousands of applications, and your application could still be
          processing. To check on the status of a payment, contact the Division:
        </p>
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
            <a href="https://www.nj.gov/treasury/taxation/contact-office.shtml">
              Regional Information Centers
            </a>
          </li>
        </ul>
      </>
    ),
    expanded: false,
    id: "faq_missing_payment",
    handleToggle: () => fireEventWhenFaqOpened("faq_missing_payment"),
  },
];
