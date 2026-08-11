"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDataStore } from "@/components/TaxReliefDataProvider";
import Link from "next/link";
//import { StepIndicator } from "@trussworks/react-uswds";
import { LandingPageFaq } from "@/components/LandingPageFaq";

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

  const { applicationDateString } = dataStore;
  const currentDate = new Date().toLocaleDateString();
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
          <h1>Your Application Journey</h1>
          <p className="font-heading-lg">
            <span style={{ color: "#005EA2", fontWeight: "bold" }}>
              We received your application on {applicationDateString}.{" "}
            </span>
            We have everything we need. You don't need to do anything. Sit tight!
          </p>
          <div
            aria-label="progress"
            className="usa-step-indicator  usa-step-indicator--counters usa-step-indicator--counters-sm"
          >
            <ol className="usa-step-indicator__segments">
              <li className="usa-step-indicator__segment usa-step-indicator__segment--complete">
                <span className="usa-step-indicator__segment-label">
                  {`Application received on ${applicationDateString}`}{" "}
                  <span className="usa-sr-only">completed</span>
                </span>
              </li>
              <li
                className="usa-step-indicator__segment usa-step-indicator__segment--current"
                aria-current="true"
              >
                <span className="usa-step-indicator__segment-label">
                  {"Reviewing your application"}{" "}
                </span>
              </li>
              <li className="usa-step-indicator__segment">
                <span className="usa-step-indicator__segment-label">
                  {"Approving your benefit(s)"} <span className="usa-sr-only">not completed</span>
                </span>
              </li>
              <li className="usa-step-indicator__segment">
                <span className="usa-step-indicator__segment-label">
                  {"Sending out payments"} <span className="usa-sr-only">not completed</span>
                </span>
              </li>
            </ol>
            <div className="usa-step-indicator__header">
              <h2 className="usa-step-indicator__heading">
                <span className="usa-step-indicator__heading-counter">
                  <span className="usa-sr-only">Step</span>
                  <span className="usa-step-indicator__current-step">2</span>
                  <span className="usa-step-indicator__total-steps padding-left-1">of 4</span>
                </span>
                <span className="usa-step-indicator__heading-text">{`Last updated on ${currentDate}`}</span>
              </h2>
            </div>
          </div>
          <hr></hr>
          <h2 className="font-heading-l">How the payout schedule works:</h2>
          <h3 style={{ marginBottom: 0 }}>Senior Freeze</h3>
          <p style={{ marginTop: 1 }}>Senior Freeze payments start July 15, 2026</p>
          <details style={{ marginTop: 1, marginBottom: 50 }}>
            <summary className="learn-more-link">
              <a>Learn more about Senior Freeze</a>
            </summary>
            <div className="learn-more-content">
              <ol className="usa-process-list">
                <li className="usa-process-list__item">
                  <h4 className="usa-process-list__heading ">
                    Starting in July, PAS-1 applications are reviewed for Senior Freeze eligibility
                  </h4>
                </li>{" "}
                <li className="usa-process-list__item">
                  <h4 className="usa-process-list__heading ">
                    If approved, payments start going out on 7/15/2026
                  </h4>
                  <p className="">Payments are made on an ongoing basis</p>
                </li>{" "}
                <li className="usa-process-list__item">
                  <h4 className="usa-process-list__heading ">
                    Most taxpayers can expect to get a payment by 9/15/26
                  </h4>
                  <p className="">
                    If you haven't gotten your check by 9/15/26, you should contact the State
                  </p>
                </li>
              </ol>
            </div>
          </details>
          <h3 style={{ marginBottom: 0 }}>ANCHOR</h3>
          <p style={{ marginTop: 1 }}>ANCHOR payments start September 15, 2026</p>
          <details style={{ marginTop: 1, marginBottom: 50 }}>
            <summary className="learn-more-link">
              <a>Learn more about ANCHOR</a>
            </summary>
            <div className="learn-more-content">
              <ol className="usa-process-list">
                <li className="usa-process-list__item">
                  <h4 className="usa-process-list__heading ">
                    Starting in July, PAS-1 applications are reviewed for ANCHOR eligibility
                  </h4>
                </li>{" "}
                <li className="usa-process-list__item">
                  <h4 className="usa-process-list__heading ">
                    If approved, payments start going out on 9/15/2026
                  </h4>
                  <p className="">Payments are made on an ongoing basis</p>
                </li>{" "}
                <li className="usa-process-list__item">
                  <h4 className="usa-process-list__heading ">
                    Most taxpayers can expect to get a payment by 12/31/26
                  </h4>
                  <p className="">
                    If you haven't gotten your check by 12/31/26, you should contact the State
                  </p>
                </li>
              </ol>
            </div>
          </details>
          <h3 style={{ marginBottom: 0 }}>Stay NJ</h3>
          <p style={{ marginTop: 1 }}>Stay NJ payments start February 2027</p>
          <details style={{ marginTop: 1 }}>
            <summary className="learn-more-link">
              <a>Learn more about Stay NJ</a>
            </summary>
            <div className="learn-more-content">
              <ol className="usa-process-list">
                <li className="usa-process-list__item">
                  <h4 className="usa-process-list__heading ">
                    Starting in XXX, PAS-1 applications are reviewed for Stay NJ eligibility
                  </h4>
                </li>
                <li className="usa-process-list__item">
                  <h4 className="usa-process-list__heading ">
                    If approved, Quarter 1 payments begin February 2027
                  </h4>
                </li>
                <li className="usa-process-list__item">
                  <h4 className="usa-process-list__heading ">Quarter 2 payments begin May 2027 </h4>
                </li>
                <li className="usa-process-list__item">
                  <h4 className="usa-process-list__heading ">
                    Quarter 3 payments begin August 2027
                  </h4>
                </li>
                <li className="usa-process-list__item">
                  <h4 className="usa-process-list__heading ">
                    Quarter 4 payments begin November 2027
                  </h4>
                </li>
              </ol>
            </div>
          </details>
          <div className="grid-row grid-gap margin-top-5">
            <h2 className="font-heading-l">Frequently Asked Questions (FAQs)</h2>
            <LandingPageFaq headingLevel="h3" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ApplicationReceivedPage;
