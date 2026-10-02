import { fireEventWhenFaqOpened, type FaqItem } from "@/components/FaqSection";

export const AnchorApplicationReceivedFaqContent: FaqItem[] = [
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
];
