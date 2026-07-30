"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDataStore } from "@/components/TaxReliefDataProvider";
import Link from "next/link";
import { StepIndicatorStep } from "@trussworks/react-uswds";
import { StepIndicator } from "@/components/StepIndicator";
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

  const { lastFourSsnDigits, zipCode, applicationDateString } = dataStore;
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
              We are reviewing your application.{" "}
            </span>
            We have everything we need. You don't need to do anything. Sit tight!
          </p>
          <StepIndicator className="usa-step-indicator--counters margin-top-6">
            <ol className="usa-step-indicator__segments">
              <li className="usa-step-indicator__segment usa-step-indicator__segment--complete">
                <span className="usa-step-indicator__segment-label">
                  Application received on {applicationDateString}{" "}
                  <span className="usa-sr-only">completed</span>
                </span>
              </li>
              <li
                className="usa-step-indicator__segment usa-step-indicator__segment--current"
                aria-current="true"
              >
                <span className="usa-step-indicator__segment-label">
                  Reviewing your application. <br />
                  <span style={{ fontWeight: "normal" }}>Last updated on {currentDate}</span>
                </span>
              </li>
              <li className="usa-step-indicator__segment">
                <span className="usa-step-indicator__segment-label">
                  Approving your benefit(s) <span className="usa-sr-only">not completed</span>
                </span>
              </li>
              <li className="usa-step-indicator__segment">
                <span className="usa-step-indicator__segment-label">
                  Sending out payment(s) <span className="usa-sr-only">not completed</span>
                </span>
              </li>
            </ol>
            <div></div>
          </StepIndicator>
          <hr></hr>
          <h2 className="font-heading-l">How the payout schedule works:</h2>
          <ul className="usa-card-group grid-row">
            <li className="usa-card tablet:grid-col-4">
              <div className="usa-card__container">
                <div className="usa-card__header">
                  <h4 className="usa-card__heading">Senior Freeze</h4>
                </div>
                <div className="usa-card__body">
                  <p>
                    <b>July 15th to February 2027</b>
                  </p>
                  <p>Formerly, known as the Property Tax Reimbursement</p>
                </div>
                <div className="usa-card__footer">
                  {/* button modal */}
                  <a href="#" className="usa-button">
                    Learn More
                  </a>
                </div>
              </div>
            </li>
            <li className="usa-card tablet:grid-col-4">
              <div className="usa-card__container">
                <div className="usa-card__header">
                  <h4 className="usa-card__heading">ANCHOR</h4>
                </div>
                <div className="usa-card__body">
                  <p>
                    <b>September 15th to December 31</b>
                  </p>
                  <p>
                    ANCHOR stands for Affordable New Jersey Communities for Homeowners and
                    Renters.{" "}
                  </p>
                </div>
                <div className="usa-card__footer">
                  <a href="#" className="usa-button">
                    Learn More
                  </a>
                </div>
              </div>
            </li>
            <li className="usa-card tablet:grid-col-4">
              <div className="usa-card__container">
                <div className="usa-card__header">
                  <h4 className="usa-card__heading">Stay NJ</h4>
                </div>
                <div className="usa-card__body">
                  <p>
                    <b>Quarterly starting February 2027</b>
                  </p>
                  <p>Stay NJ is paid out in 4 installments.</p>
                </div>
                <div className="usa-card__footer">
                  <a href="#" className="usa-button">
                    Learn More
                  </a>
                </div>
              </div>
            </li>
          </ul>
          <div className="margin-y-3">
            <a
              href="#example-modal-2"
              className="usa-button"
              aria-controls="example-modal-2"
              data-open-modal
            >
              Open large modal
            </a>
            <div
              className="usa-modal usa-modal--lg"
              id="example-modal-2"
              aria-labelledby="modal-2-heading"
              aria-describedby="modal-2-description"
            >
              <div className="usa-modal__content">
                <div className="usa-modal__main">
                  <h2 className="usa-modal__heading" id="modal-2-heading">
                    Are you sure you want to continue?
                  </h2>
                  <div className="usa-prose">
                    <p id="modal-2-description">You have unsaved changes that will be lost.</p>
                  </div>
                  <div className="usa-modal__footer">
                    <ul className="usa-button-group">
                      <li className="usa-button-group__item">
                        <button type="button" className="usa-button" data-close-modal>
                          Continue without saving
                        </button>
                      </li>
                      <li className="usa-button-group__item">
                        <button
                          type="button"
                          className="usa-button usa-button--unstyled padding-105 text-center"
                          data-close-modal
                        >
                          Go back
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <button
                  type="button"
                  className="usa-button usa-modal__close"
                  aria-label="Close this window"
                  data-close-modal
                >
                  <svg className="usa-icon" aria-hidden="true" focusable="false" role="img">
                    <use href="/assets/img/sprite.svg#close"></use>
                  </svg>
                </button>
              </div>
            </div>
          </div>
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
