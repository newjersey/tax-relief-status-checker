import { Alert, Logo } from "@trussworks/react-uswds";
import { Link } from "react-router-dom";

export const StatusPage = () => (
  <>
    <main id="main-content">
      <Alert type="info" slim={true} headingLevel="h2" noIcon={true}>
        The status was updated on April, 14, 2026 at 8:45am. Please allow 24 hours for system
        updates.
      </Alert>
      <section className="usa-section">
        <div className="grid-container">
          <div style={{ textAlign: "right" }}>
            <Link className="usa-button usa-button--outline margin-right-3 margin-top-3" to="/">
              <svg focusable="false" role="img" width="20" height="20" fill="#005ea2">
                <use href="/img/sprite.svg#logout"></use>
              </svg>
              Log out
            </Link>
          </div>
          <div>
            <div>
              <Logo
                size="slim"
                image={
                  <img src="/img/treasury_seal.jpg" width={100} height={100} alt="Treasury logo" />
                }
              ></Logo>
              <h1 className="font-heading-3xl">
                Property Tax Relief
                <br />
                Status Checker
              </h1>
            </div>
            <div className="grid-row">
              <div className="tablet:grid-col-3">
                <p>
                  SSN/ITIN: <strong>****-**-6789</strong>
                </p>
              </div>
              <div className="tablet:grid-col-3">
                <p>
                  Zip Code: <strong>07199</strong>
                </p>
              </div>
              <div className="tablet:grid-col-6 grid-row">
                <p>Tax Year:</p>
                <Link className="usa-button usa-button--unstyled" to="#">
                  2025
                </Link>
                <Link className="usa-button usa-button--unstyled" to="#">
                  2024
                </Link>
                <Link className="usa-button usa-button--unstyled" to="#">
                  2021
                </Link>
              </div>
            </div>
          </div>
          <div className="margin-top-4">
            <p className="font-heading-xl">Your application was received on 4/14/2025.</p>
            <p>
              Please allow time for our agents to review and process your application. Check back in
              2 weeks for an update.
            </p>
          </div>
        </div>
      </section>
    </main>
  </>
);
