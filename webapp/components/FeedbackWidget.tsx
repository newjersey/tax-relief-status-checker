"use client";

import { type ReactElement } from "react";
import dynamic from "next/dynamic";

// NJ: Tells TypeScript that <feedback-widget> is a valid custom element.
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "feedback-widget": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

// Allows us to render this dynamically to prevent server side rendering
const FeedbackWidgetClientOnly = (): ReactElement => {
  import("@newjersey/feedback-widget/feedback-widget.min.js");

  return (
    <>
      <section aria-label="Leave Feedback">
        <feedback-widget
          contact-link="https://www.nj.gov/treasury/taxation/contact.shtml?open=email"
          only-save-rating-to-analytics="true"
        ></feedback-widget>
      </section>
    </>
  );
};

export const FeedbackWidget = dynamic(() => Promise.resolve(FeedbackWidgetClientOnly), {
  ssr: false,
});
