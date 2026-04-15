import { Label, Logo, TextInputMask } from "@trussworks/react-uswds";
import { HorizontalDivider } from "./components/HorizontalDivider";
import { LandingPageFaq } from "./components/LandingPageFaq";

export const LandingPage = () => (
  <>
    <main id="main-content">
      <section className="usa-section">
        <div className="grid-container">
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
          <div className="grid-row grid-gap margin-top-5 margin-bottom-10">
            <div className="tablet:grid-col-5 border border-dashed">
              <h2 className="font-heading-l">Enter your Social Security Number and Zip Code</h2>
              <Label htmlFor="ssn" requiredMarker={true}>
                SSN/ITIN
              </Label>
              <div className="tablet:grid-col-10">
                <TextInputMask
                  name="ssn"
                  id="ssn"
                  type="text"
                  mask="___-__-____"
                  pattern="\d{3}-\d{2}-\d{4}"
                  required={true}
                ></TextInputMask>
              </div>

              <Label htmlFor="zipCode" requiredMarker={true}>
                Zip Code
              </Label>
              <div className="tablet:grid-col-10">
                <TextInputMask
                  name="zipCode"
                  id="zipCode"
                  type="text"
                  mask="_____"
                  pattern="\d{5}"
                  required={true}
                ></TextInputMask>
              </div>
              <a
                href="status"
                className="usa-button usa-button--small margin-top-5 margin-bottom-3"
              >
                Check Status
              </a>
            </div>
            <div className="tablet:grid-col-1"></div>
            <div className="tablet:grid-col-5">
              <h2 className="font-heading-md">
                Check your application status and access other property tax resources
              </h2>
              <div className="display-flex flex-align-center margin-bottom-3">
                <img
                  className="margin-right-3"
                  src="/img/clock_rewind.svg"
                  alt=""
                  aria-hidden="true"
                  width={40}
                  height={40}
                />
                <p className="margin-y-0">
                  <strong>Application status:</strong> Check your claim status and identity
                  verification status
                </p>
              </div>
              <div className="display-flex flex-align-center margin-bottom-3">
                <img
                  className="margin-right-3"
                  src="/img/dollar_sign.svg"
                  alt=""
                  aria-hidden="true"
                  width={40}
                  height={40}
                />
                <p className="margin-y-0">
                  <strong>Check tracer:</strong> Request for a check to be stopped due to fraud or
                  change of mailing address
                </p>
              </div>
              <div className="display-flex flex-align-center margin-bottom-3">
                <img
                  className="margin-right-3"
                  src="/img/folder.svg"
                  alt=""
                  aria-hidden="true"
                  width={40}
                  height={40}
                />
                <p className="margin-y-0">
                  <strong>Prior year tax records:</strong> Find previous property tax year records
                </p>
              </div>
              <div className="display-flex flex-align-center margin-bottom-3">
                <img
                  className="margin-right-3"
                  src="/img/upload.svg"
                  alt=""
                  aria-hidden="true"
                  width={40}
                  height={40}
                />
                <p className="margin-y-0">
                  <strong>Upload documents:</strong> Send in requested documents to progress your
                  application
                </p>
              </div>
            </div>
          </div>
          <HorizontalDivider />
          <div className="grid-row grid-gap margin-top-5">
            <h2 className="font-heading-l">Frequently Asked Questions (FAQs)</h2>
            <LandingPageFaq headingLevel="h3" />
          </div>
        </div>
      </section>
    </main>
  </>
);
