import { v4 as uuidv4 } from "uuid";

declare global {
  interface Window {
    gtag: (command: string, eventName: string, params: EventParams) => void;
  }
}

interface EventParams {
  user_session_id?: string;
  timestamp: number;
}

export const setSessionId = (): void => {
  if (sessionStorage.getItem("sessionId") == null) {
    sessionStorage.setItem("sessionId", uuidv4());
  }
};

export const addParams = (): EventParams => {
  return {
    user_session_id: sessionStorage.getItem("sessionId") || undefined,
    timestamp: Date.now(),
  };
};

export const logGAEvent = (eventName: string): void => {
  const params: EventParams = addParams();

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
};
