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
              We are reviewing your application.{" "}
            </span>
            We have everything we need. You don't need to do anything. Sit tight!
          </p>
          {/* <StepIndicator className="usa-step-indicator--counters margin-top-6">
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
          </StepIndicator> */}
          <hr></hr>
          <h2 className="font-heading-l">How the payout schedule works:</h2>
          <ol className="usa-process-list">
            <li className="usa-process-list__item">
              <h4 className="usa-process-list__heading font-sans-xl line-height-sans-1">
                Senior Freeze
              </h4>
              <p className="font-sans-lg margin-top-1 text-light">
                Senior Freeze payments start July 15, 2026
              </p>
              <details>
                <summary className="learn-more-link">
                  <a>Learn more about Senior Freeze</a>
                </summary>
                <div className="learn-more-content">
                  {/* step indicator for senior freeze */}
                  {/* <StepIndicator className="usa-step-indicator usa-step-indicator--counters">
                    <ol className="usa-step-indicator__segments margin-top-3">
                      <li className="usa-step-indicator__segment usa-step-indicator__segment--complete">
                        <span className="usa-step-indicator__segment-label">
                          PAS-1 application opens February 2026{" "}
                          <span className="usa-sr-only">completed</span>
                        </span>
                      </li>
                      <li
                        className="usa-step-indicator__segment usa-step-indicator__segment--complete"
                        aria-current="true"
                      >
                        <span className="usa-step-indicator__segment-label">
                          Application begin processing in July
                        </span>
                      </li>
                      <li
                        className="usa-step-indicator__segment usa-step-indicator__segment--complete"
                        aria-current="true"
                      >
                        <span className="usa-step-indicator__segment-label">
                          First check sent 7/15/2026{" "}
                        </span>
                      </li>
                      <li
                        className="usa-step-indicator__segment usa-step-indicator__segment--complete"
                        aria-current="true"
                      >
                        <span className="usa-step-indicator__segment-label">
                          Application closes 11/2/2026{" "}
                        </span>
                      </li>
                      <li
                        className="usa-step-indicator__segment usa-step-indicator__segment--complete"
                        aria-current="true"
                      >
                        <span className="usa-step-indicator__segment-label">
                          Last checks sent in February 2027{" "}
                        </span>
                      </li>
                    </ol>
                    <div></div>
                  </StepIndicator> */}
                  <p>
                    To qualify for the{" "}
                    <a
                      href="https://www.nj.gov/treasury/taxation/ptr/eligibility.shtml"
                      target="_blank"
                    >
                      Senior Freeze program
                    </a>
                    , you (or your spouse) must meet all the below requirements:
                  </p>
                  <ul>
                    <li>
                      Be 65 years or older on December 31st, 2025 (or receiving Social Security
                      Disability during 2025)
                    </li>
                    <li>Have owned and lived in your home since December 31, 2022</li>
                    <li>Paid property taxes</li>
                    <li>Total annual income for 2025 was $172,475 or less</li>
                  </ul>
                </div>
              </details>
            </li>{" "}
            <li className="usa-process-list__item">
              <h4 className="usa-process-list__heading font-sans-xl line-height-sans-1">ANCHOR</h4>
              <p className="font-sans-lg margin-top-1 text-light">
                ANCHOR payments begin September 2026
              </p>
              <details>
                <summary className="learn-more-link">
                  <a>Learn more about ANCHOR</a>
                </summary>
                <div className="learn-more-content">
                  {/* step indicator for ANCHOR */}
                  {/* <StepIndicator className="usa-step-indicator usa-step-indicator--counters">
                    <ol className="usa-step-indicator__segments margin-top-3">
                      <li className="usa-step-indicator__segment usa-step-indicator__segment--complete">
                        <span className="usa-step-indicator__segment-label">
                          PAS-1 application opens February 2026{" "}
                          <span className="usa-sr-only">completed</span>
                        </span>
                      </li>
                      <li
                        className="usa-step-indicator__segment usa-step-indicator__segment--complete"
                        aria-current="true"
                      >
                        <span className="usa-step-indicator__segment-label">
                          Application begin processing in July
                        </span>
                      </li>
                      <li
                        className="usa-step-indicator__segment usa-step-indicator__segment--complete"
                        aria-current="true"
                      >
                        <span className="usa-step-indicator__segment-label">
                          ANCHOR payments begin September 2026{" "}
                        </span>
                      </li>
                      <li
                        className="usa-step-indicator__segment usa-step-indicator__segment--complete"
                        aria-current="true"
                      >
                        <span className="usa-step-indicator__segment-label">
                          Application closes 11/2/2026{" "}
                        </span>
                      </li>
                      <li
                        className="usa-step-indicator__segment usa-step-indicator__segment--complete"
                        aria-current="true"
                      >
                        <span className="usa-step-indicator__segment-label">
                          Last checks sent in December 2027{" "}
                        </span>
                      </li>
                    </ol>
                    <div></div>
                  </StepIndicator> */}
                  <p>
                    To qualify for the{" "}
                    <a
                      href="https://www.nj.gov/treasury/taxation/anchor/eligibility.shtml"
                      target="_blank"
                    >
                      ANCHOR program
                    </a>
                    , you (or your spouse) must meet all the below requirements:
                  </p>
                  <ul>
                    <li>New Jersey resident in 2025</li>
                    <li>
                      Have owned or rented a home in New Jersey that was your main home on October
                      1, 2025
                    </li>
                    <li>Paid property taxes</li>
                    <li>
                      New Jersey gross income was $250,000 or less for homeowners (or $150,000 or
                      less for renters)
                    </li>
                  </ul>
                </div>
              </details>
            </li>{" "}
            <li className="usa-process-list__item">
              <h4 className="usa-process-list__heading font-sans-xl line-height-sans-1">Stay NJ</h4>
              <p className="font-sans-lg margin-top-1 text-light">
                Stay NJ payments begin February 2027
              </p>
              <details>
                <summary className="learn-more-link">
                  <a>Learn more about Stay NJ</a>
                </summary>
                <div className="learn-more-content">
                  {/* step indicator for Stay NJ */}
                  {/* <StepIndicator className="usa-step-indicator usa-step-indicator--counters">
                    <ol className="usa-step-indicator__segments margin-top-3">
                      <li className="usa-step-indicator__segment usa-step-indicator__segment--complete">
                        <span className="usa-step-indicator__segment-label">
                          PAS-1 application opens February 2026{" "}
                        </span>
                      </li>
                      <li className="usa-step-indicator__segment usa-step-indicator__segment--complete">
                        <span className="usa-step-indicator__segment-label">
                          Application closes 11/2/2026{" "}
                        </span>
                      </li>
                      <li className="usa-step-indicator__segment usa-step-indicator__segment--complete">
                        <span className="usa-step-indicator__segment-label">
                          Quarter 1 payments begin February 2027{" "}
                        </span>
                      </li>
                      <li className="usa-step-indicator__segment usa-step-indicator__segment--complete">
                        <span className="usa-step-indicator__segment-label">
                          Quarter 2 payments begin May 2027{" "}
                        </span>
                      </li>
                      <li className="usa-step-indicator__segment usa-step-indicator__segment--complete">
                        <span className="usa-step-indicator__segment-label">
                          Quarter 3 payments begin August 2027{" "}
                        </span>
                      </li>
                      <li className="usa-step-indicator__segment usa-step-indicator__segment--complete">
                        <span className="usa-step-indicator__segment-label">
                          Quarter 4 payments begin November 2027{" "}
                        </span>
                      </li>
                    </ol>
                    <div></div>
                  </StepIndicator> */}
                  <p>
                    To qualify for the{" "}
                    <a
                      href="https://www.nj.gov/treasury/taxation/staynj/index.shtml"
                      target="_blank"
                    >
                      Stay NJ program
                    </a>
                    , you (or your spouse) must meet all the below requirements:
                  </p>
                  <ul>
                    <li>Be 65 years or older on December 31st, 2025</li>
                    <li>New Jersey resident in 2025</li>
                    <li>
                      Have owned and lived in New Jersey for the entire year (January 1 to December
                      31, 2025)
                    </li>
                    <li>Paid property taxes</li>
                    <li>Total annual income less than $200,000</li>
                  </ul>
                </div>
              </details>
            </li>
          </ol>
          <div aria-label="progress" className="usa-step-indicator  usa-step-indicator--counters ">
            <ol className="usa-step-indicator__segments">
              <li className="usa-step-indicator__segment usa-step-indicator__segment--complete">
                <span className="usa-step-indicator__segment-label">
                  {"label"} <span className="usa-sr-only">completed</span>
                </span>
              </li>
              <li className="usa-step-indicator__segment usa-step-indicator__segment--complete">
                <span className="usa-step-indicator__segment-label">
                  {"label"} <span className="usa-sr-only">completed</span>
                </span>
              </li>
              <li
                className="usa-step-indicator__segment usa-step-indicator__segment--current"
                aria-current="true"
              >
                <span className="usa-step-indicator__segment-label">{"label"} </span>
              </li>
              <li className="usa-step-indicator__segment">
                <span className="usa-step-indicator__segment-label">
                  {"label"} <span className="usa-sr-only">not completed</span>
                </span>
              </li>
              <li className="usa-step-indicator__segment">
                <span className="usa-step-indicator__segment-label">
                  {"label"} <span className="usa-sr-only">not completed</span>
                </span>
              </li>
            </ol>
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
