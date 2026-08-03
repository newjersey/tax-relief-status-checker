import { fireEventWhenFaqOpened, type FaqItem } from "@/components/FaqSection";

export const ApplicationReceivedFaqContent: FaqItem[] = [
  {
    title: "What if I don't receive a Senior Freeze payment on July 15?",
    content: (
      <>
        <p>If you do not receive a Senior Freeze payment on July 15, it may mean:</p>
        <ul>
          <li>Your application is still being processed.</li>
          <li>
            You may not be eligible for Senior Freeze, specifically. You may still be eligible for
            ANCHOR or Stay NJ.
          </li>
          <li>
            You will not get a separate Senior Freeze check because your ANCHOR benefit, which is
            calculated first, already covers the full amount of property taxes you paid. Across all
            three programs, the State can only reimburse you up to that amount.
          </li>
        </ul>
      </>
    ),
    expanded: false,
    id: "faq_missing_senior_freeze_payment_july_15",
    handleToggle: () => fireEventWhenFaqOpened("faq_missing_senior_freeze_payment_july_15"),
  },
];
