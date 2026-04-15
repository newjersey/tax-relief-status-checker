import njStateSeal from "@newjersey/njwds/dist/img/nj_state_seal.png";

export const NjHeader = () => {
  return <>
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
                            <use href={`/img/sprite.svg#mail`}></use>
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
  </>;
};
