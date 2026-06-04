import { Logo } from "@trussworks/react-uswds";

export const NjFooter = () => {
  return (
    <>
      <footer className="usa-footer">
        <div className="grid-container usa-footer__return-to-top">
          <a href="#">Return to top</a>
        </div>
        <div className="footer-social padding-5" style={{ backgroundColor: "#E5C53C" }}>
          <div className="grid-container">
            <div className="grid-row">
              <div className="usa-footer__logo grid-row mobile-lg:grid-col-6 mobile-lg:grid-gap-2">
                <div className="mobile-lg:grid-col-auto">
                  <h3 className="usa-footer__logo-heading">
                    <a
                      href="https://www.nj.gov/treasury/taxation/"
                      target="_blank"
                      rel="noopener"
                      className="text-black"
                    >
                      Division of Taxation
                    </a>
                  </h3>
                </div>
              </div>
              <div className="mobile-lg:grid-col-6 grid-col">
                <div style={{ textAlign: "right" }}>
                  <p>Division of Taxation</p>
                  <p className="margin-top-0">PO Box 281</p>
                  <p className="margin-top-0">Trenton, NJ 08695-0281</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom padding-y-4" style={{ backgroundColor: "#1C1D1F" }}>
          <div className="grid-container">
            <Logo size="slim" image={<img src="/img/nj_logo.svg" alt="NJ logo" />}></Logo>
            <p className="text-bold text-white">
              An official website of{" "}
              <a href="https://nj.gov" className="text-white" target="_blank" rel="noopener">
                the State of New Jersey
              </a>
            </p>
            <div className="grid-row grid-gap margin-top-3">
              <div className="grid-col-4">
                <ul className="usa-list usa-list--unstyled">
                  <li className="margin-bottom-1">
                    <a
                      href="https://www.nj.gov/governor/"
                      className="text-white"
                      target="_blank"
                      rel="noopener"
                    >
                      Governor Mikie Sherrill
                    </a>
                  </li>
                  <li className="margin-bottom-1">
                    <a
                      href="https://www.nj.gov/nj/gov/deptserv/alphaserv.shtml"
                      className="text-white"
                      target="_blank"
                      rel="noopener"
                    >
                      Services A to Z
                    </a>
                  </li>
                  <li className="margin-bottom-1">
                    <a
                      href="https://nj.gov/nj/privacy.shtml"
                      className="text-white"
                      target="_blank"
                      rel="noopener"
                    >
                      Privacy Notice
                    </a>
                  </li>
                </ul>
              </div>
              <div className="grid-col-4">
                <ul className="usa-list usa-list--unstyled">
                  <li className="margin-bottom-1">
                    <a
                      href="https://www.nj.gov/governor/"
                      className="text-white"
                      target="_blank"
                      rel="noopener"
                    >
                      Lt. Governor Dr. Dale G. Caldwell
                    </a>
                  </li>
                  <li className="margin-bottom-1">
                    <a
                      href="https://nj.gov/nj/faqs/"
                      className="text-white"
                      target="_blank"
                      rel="noopener"
                    >
                      FAQs
                    </a>
                  </li>
                  <li className="margin-bottom-1">
                    <a
                      href="https://nj.gov/nj/legal.shtml"
                      className="text-white"
                      target="_blank"
                      rel="noopener"
                    >
                      Legal Statement &amp; Disclaimers
                    </a>
                  </li>
                </ul>
              </div>
              <div className="grid-col-4">
                <ul className="usa-list usa-list--unstyled">
                  <li className="margin-bottom-1">
                    <a href="https://nj.gov/" className="text-white" target="_blank" rel="noopener">
                      NJ Home
                    </a>
                  </li>
                  <li className="margin-bottom-1">
                    <a
                      href="https://nj.gov/nj/feedback.shtml"
                      className="text-white"
                      target="_blank"
                      rel="noopener"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li className="margin-bottom-1">
                    <a
                      href="https://nj.gov/nj/accessibility.shtml"
                      className="text-white"
                      target="_blank"
                      rel="noopener"
                    >
                      Accessibility Statement
                    </a>
                  </li>
                </ul>
              </div>
              <div className="grid-col-12">
                <p className="margin-top-3 text-base-light">
                  Copyright &copy; 2026 State of New Jersey, Department of the Treasury
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
