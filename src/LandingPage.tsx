import { Label, TextInputMask } from "@trussworks/react-uswds";
import njStateSeal from "@newjersey/njwds/dist/img/nj_state_seal.png";

/**
 * Renders the full landing page for the NJ Property Tax Relief status checker.
 *
 * The page introduces the application-review process to residents and displays
 * a USWDS step indicator so they can orient themselves within that process
 * before checking their individual application status.
 */
export const LandingPage = () => (
  <>
      <a className="usa-skipnav" href="#main-content">
        Skip to main content
      </a>
      <header className="nj-banner" aria-label="Official government website">
        <div className="nj-banner__header">
          <div className="grid-container">
            <div className="nj-banner__inner">
              <div>
                <img src={njStateSeal} className="nj-banner__header-seal" alt="NJ flag" />
              </div>
              <div className="grid-col-fill">
                <a href="https://nj.gov" target="_blank" rel="noopener">
                  <span className="usa-sr-only">opens in a new tab.</span>
                  Official Site of the State of New Jersey
                </a>
              </div>
              <div className="grid-col-auto">
                <div className="text-white">
                  <ul>
                    <li>
                      <a href="https://nj.gov/governor/" target="_blank" rel="noopener">
                        Governor Mikie Sherrill &bull; Lt. Governor Dr. Dale G. Caldwell
                      </a>
                    </li>
                    <li>
                      <a href="https://nj.gov/subscribe/" target="_blank" rel="noopener">
                        <svg
                          className="usa-icon nj-banner__mail-icon bottom-neg-2px margin-right-05"
                          aria-hidden="true"
                          focusable="false"
                          role="img"
                        >
                          <use href={`/public/img/sprite.svg#mail`}></use>
                        </svg>
                        <span className="usa-sr-only">opens in a new tab.</span>
                        Get Updates
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
  <main id="main-content">
    <section className="usa-section">
      <div className="grid-container">
        <h1>NJ Property Tax Relief Status Checker</h1>
          <Label htmlFor="ssn" requiredMarker={true}>Social Security Number</Label>
          <TextInputMask name="ssn" id="ssn" type="text" mask="___-__-____" pattern="\d{3}-\d{2}-\d{4}" required={true}></TextInputMask>

          <Label htmlFor="zipCode" requiredMarker={true}>Zip code</Label>
          <TextInputMask name="zipCode" id="zipCode" type="text" mask="_____" pattern="\d{5}" required={true}></TextInputMask>
        <div className="grid-row grid-gap margin-top-5">
          <div className="tablet:grid-col-6">
            <a href="#check-status" className="usa-button usa-button--big">
              Check My Application Status
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>
  </>
);
