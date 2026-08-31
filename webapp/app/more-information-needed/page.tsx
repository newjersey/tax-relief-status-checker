"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataType, useDataStore } from "@/components/TaxReliefDataProvider";
import { IssueFlaggedType } from "@/components/types";
import { Alert } from "@trussworks/react-uswds";
import { TaxpayerInfoHeader } from "@/components/TaxpayerInfoHeader";

const MoreInformationNeededPage = () => {
  const router = useRouter();
  const { dataStore } = useDataStore();

  useEffect(() => {
    if (!dataStore || dataStore.type !== DataType.STATUS) {
      router.replace("/");
    }
  }, [dataStore, router]);

  // Next.js prerenders client components during the build,
  // returning null here allows it to render only client-side
  if (!dataStore || dataStore.type !== DataType.STATUS) {
    return null;
  }

  const { lastFourSsnDigits, zipCode, applicationDateString, issueFlagged } = dataStore;

  const createAlertContent = (alertType: IssueFlaggedType): ReactNode => {
    if (alertType === IssueFlaggedType.CONTACT_TAXATION) {
      return (
        <>
          <p>
            We need additional information to continue processing your application. Please contact
            the Division by using one of the following:
          </p>
          <ul>
            <li>
              Call: <a href="tel:+18882381233">1-888-238-1233</a> (Monday to Friday 8:30 a.m. to
              5:30 p.m.)
            </li>
            <li>
              Email: <a href="mailto:nj.anchor@treas.nj.gov">nj.anchor@treas.nj.gov</a>
            </li>
            <li>
              Visit one of our{" "}
              <a href="https://www.nj.gov/treasury/taxation/contact-office.shtml">
                Regional Information Centers
              </a>
            </li>
          </ul>
        </>
      );
    } else if (alertType === IssueFlaggedType.PROPERTY_TAX_BILL_NEEDED) {
      return (
        <>
          <p>
            We need additional information to continue processing your application.{" "}
            <strong>Please send us a copy of your final property tax bill</strong> by using one of
            the following:
          </p>
          <ul>
            <li>
              Upload using{" "}
              <a href="https://www.njportal.com/dor/onlinenotices/">
                the secure NJ Online Notice Response Service (ONRS)
              </a>
            </li>
            <li> Mail to: PO Box 900, Trenton, NJ 08646-0900</li>
            <li>
              Bring to one of our{" "}
              <a href="https://www.nj.gov/treasury/taxation/contact-office.shtml">
                Regional Information Centers
              </a>
            </li>
          </ul>
        </>
      );
    }
  };

  return (
    <main id="main-content">
      <section className="usa-section">
        <div className="grid-container">
          <TaxpayerInfoHeader lastFourSsnDigits={lastFourSsnDigits} zipCode={zipCode} />
          {issueFlagged !== undefined && (
            <Alert type="warning">
              <h3 className="usa-alert__heading">Additional information needed</h3>

              {createAlertContent(issueFlagged)}
            </Alert>
          )}
          <div className="margin-top-4">
            <h1 className="font-heading-xl">
              Your application was received on {applicationDateString}
            </h1>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MoreInformationNeededPage;
