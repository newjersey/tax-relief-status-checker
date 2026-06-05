import njStateSeal from "@newjersey/njwds/dist/img/nj_state_seal.png";

export const NjHeader = () => {
  return (
    <>
      <a className="usa-skipnav" href="#main-content">
        Skip to main content
      </a>
      <header className="nj-banner" aria-label="Official government website" id="nj-header">
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
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
