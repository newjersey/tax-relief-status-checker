"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enANCAppRec from "../content/en-US/anchor-app-received.json";
import enAppRec from "../content/en-US/app-received.json";
import enLanding from "../content/en-US/landing.json";
import enMoreInfo from "../content/en-US/more-information-needed.json";
import enPaymentInfo from "../content/en-US/payment-info.json";
import { DEFAULT_LOCALE } from "../i18n/locales";

await i18n.use(initReactI18next).init({
  resources: {
    "en-US": {
      ancAppRec: enANCAppRec,
      appRec: enAppRec,
      landing: enLanding,
      moreInfo: enMoreInfo,
      paymentInfo: enPaymentInfo,
    },
  },
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
