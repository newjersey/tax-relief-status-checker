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
                  <h3 className="usa-footer__logo-heading">Division of Taxation</h3>
                </div>
              </div>
              <div className="mobile-lg:grid-col-6 grid-col">
                <div className="usa-footer__contact-links">
                  <div className="usa-footer__social-links grid-row grid-gap-2">
                    <div className="grid-col-auto">
                      <a
                        className="usa-social-link usa-social-link--facebook"
                        href="https://www.facebook.com/njtaxation/"
                        style={{ borderRadius: "50%", backgroundColor: "black" }}
                      >
                        <svg
                          className="usa-social-link__icon"
                          focusable="false"
                          role="img"
                          width="40"
                          height="40"
                          fill="white"
                        >
                          <use href="/img/sprite.svg#facebook"></use>
                        </svg>
                      </a>
                    </div>
                    <div className="grid-col-auto">
                      <a
                        className="usa-social-link usa-social-link--twitter"
                        href="https://twitter.com/nj_taxation"
                        style={{ borderRadius: "50%", backgroundColor: "black" }}
                      >
                        <svg
                          className="usa-social-link__icon"
                          focusable="false"
                          role="img"
                          width="40"
                          height="40"
                          fill="white"
                        >
                          <use href="/img/sprite.svg#twitter"></use>
                        </svg>
                      </a>
                    </div>
                    <div className="grid-col-auto">
                      <a
                        className="usa-social-link usa-social-link--youtube"
                        href="https://www.youtube.com/channel/UCtN4NzI6i32MmP8Z2pdlD4Q"
                        style={{ borderRadius: "50%", backgroundColor: "black" }}
                      >
                        <svg
                          className="usa-social-link__icon"
                          focusable="false"
                          role="img"
                          width="40"
                          height="40"
                          fill="white"
                        >
                          <use href="/img/sprite.svg#youtube"></use>
                        </svg>
                      </a>
                    </div>
                    <div className="grid-col-auto">
                      <a
                        className="usa-social-link usa-social-link--instagram"
                        href="https://www.instagram.com/nj_taxation/"
                        style={{ borderRadius: "50%", backgroundColor: "black" }}
                      >
                        <svg
                          className="usa-social-link__icon"
                          focusable="false"
                          role="img"
                          width="40"
                          height="40"
                          fill="white"
                        >
                          <use href="/img/sprite.svg#instagram"></use>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p>PO Box 281</p>
                  <p className="margin-top-0">Trenton, NJ 08695-0281</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom padding-y-4" style={{ backgroundColor: "#1C1D1F" }}>
          <div className="grid-container">
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
                      href="https://nj.gov/governor/"
                      className="text-white"
                      target="_blank"
                      rel="noopener"
                    >
                      Governor Mikie Sherrill
                    </a>
                  </li>
                  <li className="margin-bottom-1">
                    <a
                      href="https://nj.gov/nj/gov/njgov/alphaserv.html"
                      className="text-white"
                      target="_blank"
                      rel="noopener"
                    >
                      Services A to Z
                    </a>
                  </li>
                  <li className="margin-bottom-1">
                    <a
                      href="https://nj.gov/privacy.html"
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
                      href="https://nj.gov/governor/admin/lt/"
                      className="text-white"
                      target="_blank"
                      rel="noopener"
                    >
                      Lt. Governor Dr. Dale G. Caldwell
                    </a>
                  </li>
                  <li className="margin-bottom-1">
                    <a
                      href="https://nj.gov/faqs/"
                      className="text-white"
                      target="_blank"
                      rel="noopener"
                    >
                      FAQs
                    </a>
                  </li>
                  <li className="margin-bottom-1">
                    <a
                      href="https://nj.gov/legal.html"
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
                    <a href="https://nj.gov" className="text-white" target="_blank" rel="noopener">
                      NJ Home
                    </a>
                  </li>
                  <li className="margin-bottom-1">
                    <a
                      href="https://nj.gov/nj/feedback.html"
                      className="text-white"
                      target="_blank"
                      rel="noopener"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li className="margin-bottom-1">
                    <a
                      href="https://nj.gov/nj/accessibility.html"
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
                  Copyright &copy; 2026 State of New Jersey,
                </p>
                <p className="margin-top-0 text-base-light">
                  Department of the Treasury, Division of Taxation
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
