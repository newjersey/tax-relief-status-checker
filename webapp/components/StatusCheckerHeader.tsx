import { Logo } from "@trussworks/react-uswds";
import { Alert } from "@trussworks/react-uswds";

/** Property Tax Relief Status Checker and logo */
export const StatusCheckerHeader = () => (
  <>
    <header>
      <Alert className="margin-0" id="beta-banner" type="info" noIcon={true} headingLevel="h1">
        <strong>This website is in beta.</strong> This means it is actively being worked on with new
        features coming soon.
      </Alert>
      <div className="grid-container">
        <div className="tablet:grid-col-6 padding-top-8">
          <Logo
            size="slim"
            image={
              <img src="/img/nj_taxation_logo.png" width={120} height={120} alt="Treasury logo" />
            }
          />
          <p className="font-heading-2xl text-bold line-height-sans-1">
            Property Tax Relief Status Checker
          </p>
        </div>
      </div>
    </header>
  </>
);
