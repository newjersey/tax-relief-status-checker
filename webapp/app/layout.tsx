import type { Metadata } from "next";
import { NjHeader } from "@/components/NjHeader";
import { NjFooter } from "@/components/NjFooter";
import { StatusCheckerHeader } from "@/components/StatusCheckerHeader";
import "@newjersey/njwds/dist/css/styles.css";
import "./globals.css";
import Script from "next/script";

const TRACKING_ID = process.env.STAGE == "production" ? "G-KMSDMG9NFN" : "G-DEV";

/** {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata} */
export const metadata: Metadata = {
  title: "NJ Property Tax Relief — Application Status",
  description: "Track the status of your application for NJ property tax relief programs.",
};

/** Root layout wrapping all pages with the NJ header, beta banner, and footer. */
const RootLayout = ({ children }: { readonly children: React.ReactNode }) => (
  <html lang="en">
    <head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-KMSDMG9NFN"
        strategy="afterInteractive"
      />
      <Script strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-KMSDMG9NFN');
        `}
      </Script>
    </head>
    <body>
      <NjHeader />
      <StatusCheckerHeader />
      {children}
      <NjFooter />
    </body>
  </html>
);

export default RootLayout;
