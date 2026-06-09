import type { Metadata } from "next";
import { Alert } from "@trussworks/react-uswds";
import { NjHeader } from "@/components/NjHeader";
import { NjFooter } from "@/components/NjFooter";
import "@newjersey/njwds/dist/css/styles.css";
import "./globals.css";

/** {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata} */
export const metadata: Metadata = {
  title: "NJ Property Tax Relief — Application Status",
  description: "Track the status of your application for NJ property tax relief programs.",
};

/** Root layout wrapping all pages with the NJ header, beta banner, and footer. */
const RootLayout = ({ children }: { readonly children: React.ReactNode }) => (
  <html lang="en">
    <body>
      <NjHeader />
      <Alert className="margin-0" id="beta-banner" type="info" noIcon={true} headingLevel="h1">
        <strong>This tool is in beta.</strong> This means it is actively being worked on with new
        features coming soon.
      </Alert>
      {children}
      <NjFooter />
    </body>
  </html>
);

export default RootLayout;
