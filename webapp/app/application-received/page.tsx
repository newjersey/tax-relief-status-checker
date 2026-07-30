"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IssueType, useDataStore } from "@/components/TaxReliefDataProvider";
import Link from "next/link";
import { Alert } from "@trussworks/react-uswds";

const ApplicationReceivedPage = () => {
  const router = useRouter();
  const { dataStore } = useDataStore();

  useEffect(() => {
    if (!dataStore) {
      router.replace("/");
    }
  }, [dataStore, router]);

  // Next.js prerenders client components during the build,
  // returning null here allows it to render only client-side
  if (!dataStore) {
    return null;
  }

  const { lastFourSsnDigits, zipCode, applicationDateString, issueFlagged } = dataStore;

  const createAlertContent = (alertType: IssueType): ReactNode => {
    if (alertType == IssueType.CONTACT_TAXATION) {
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
    } else if (alertType == IssueType.PROPERTY_TAX_BILL_NEEDED) {
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
          <div style={{ textAlign: "right" }}>
            <Link className="usa-button usa-button--outline margin-right-3 margin-top-3" href="/">
              <svg focusable="false" role="img" width="20" height="20" fill="#005ea2">
                <use href="/img/sprite.svg#logout"></use>
              </svg>
              Log out
            </Link>
          </div>
          <div>
            <div className="grid-row">
              <div className="tablet:grid-col-3">
                <p>
                  SSN/ITIN: <strong>***-**-{lastFourSsnDigits}</strong>
                </p>
              </div>
              <div className="tablet:grid-col-3">
                <p>
                  ZIP Code: <strong>{zipCode}</strong>
                </p>
              </div>{" "}
              <div className="tablet:grid-col-3">
                <p>
                  Tax Year: <strong>2025</strong>
                </p>
              </div>
            </div>
          </div>
          {issueFlagged && (
            <Alert type="warning" headingLevel="h2" heading="Additional information needed">
              {createAlertContent(issueFlagged)}
            </Alert>
          )}
          <div className="margin-top-4">
            <p className="font-heading-xl">
              Your application was received on {applicationDateString}
            </p>
            <p>
              Your application is being reviewed. No action is needed right now. If you applied
              early this year, please check back in early summer.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ApplicationReceivedPage;
