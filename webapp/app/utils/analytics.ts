declare global {
  interface Window {
    gtag: (command: string, eventName: string, params: EventParams) => void;
  }
}

interface EventParams {
  timestamp: number;
}

export const addParams = (): EventParams => {
  return {
    timestamp: Date.now(),
  };
};

export const logGAEvent = (eventName: string): void => {
  const params: EventParams = addParams();

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
};
