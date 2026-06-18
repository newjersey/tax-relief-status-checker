import { v4 as uuidv4 } from "uuid";

type FaqAccordionId =
  | "faq_when_can_i_expect_my_application_status"
  | "faq_no_2025_application_found"
  | "faq_update_after_submission"
  | "faq_when_can_i_expect_to_receive_payments"
  | "faq_application_taking_too_long";

export type CustomGAEvent = `${FaqAccordionId}_clicked`;

interface EventParams {
  user_session_id?: string;
  timestamp: number;
}

export const setSessionId = (): void => {
  if (sessionStorage.getItem("intakeSessionId") == null) {
    sessionStorage.setItem("intakeSessionId", uuidv4());
  }
};

export const addAdditionalParams = (params: {}): EventParams => {
  return {
    ...params,
    user_session_id: sessionStorage.getItem("sessionId") || undefined,
    timestamp: Date.now(),
  };
};

export const logGAEvent = (eventName: CustomGAEvent): void => {
  const allParams: EventParams = addAdditionalParams(params);

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, allParams);
  }

  console.log("Analytics Event:", eventName, allParams);
};
