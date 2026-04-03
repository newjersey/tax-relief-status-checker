import { Label, TextInput, TextInputMask } from "@trussworks/react-uswds";

/**
 * Renders the full landing page for the NJ Property Tax Relief status checker.
 *
 * The page introduces the application-review process to residents and displays
 * a USWDS step indicator so they can orient themselves within that process
 * before checking their individual application status.
 */
export const LandingPage = () => (
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
);
