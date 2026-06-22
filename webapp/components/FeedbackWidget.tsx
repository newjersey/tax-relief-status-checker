"use client";

import { useRef, type ReactElement } from "react";
import "@newjersey/feedback-widget/feedback-widget.min.js";

// NJ: Tells TypeScript that <feedback-widget> is a valid custom element.
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "feedback-widget": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export const FeedbackWidget = (): ReactElement => {
  const widgetRef = useRef<HTMLElement>(null);

  return (
    <>
      <section aria-label="Leave Feedback">
        <feedback-widget
          ref={widgetRef}
          contact-link="https://www.nj.gov/treasury/taxation/contact.shtml?open=email"
        ></feedback-widget>
      </section>
    </>
  );
};
