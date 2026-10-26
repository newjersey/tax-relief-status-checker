"use client";
import { Alert, Logo } from "@trussworks/react-uswds";
import { useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";

/** Property Tax Relief Status Checker and logo */
export const ApplicationFoundHeader = () => {
  const { t } = useTranslation("common");

  useEffect(() => {
    const menuButton = document.querySelector(".usa-menu-btn");
    const closeButton = document.querySelector(".usa-nav__close");
    const overlay = document.querySelector(".usa-overlay");
    const nav = document.querySelector(".usa-nav");

    const openMenu = () => {
      nav?.classList.add("is-visible");
      overlay?.classList.add("is-visible");
      document.body.classList.add("usa-js-mobile-nav--active");
    };

    const closeMenu = () => {
      nav?.classList.remove("is-visible");
      overlay?.classList.remove("is-visible");
      document.body.classList.remove("usa-js-mobile-nav--active");
    };

    menuButton?.addEventListener("click", openMenu);
    closeButton?.addEventListener("click", closeMenu);
    overlay?.addEventListener("click", closeMenu);

    return () => {
      menuButton?.removeEventListener("click", openMenu);
      closeButton?.removeEventListener("click", closeMenu);
      overlay?.removeEventListener("click", closeMenu);
    };
  }, []);

  return (
    <>
      <div className="usa-overlay"></div>
      <header className="usa-header usa-header--basic">
        <Alert className="margin-0" id="beta-banner" type="info" noIcon={true}>
          <Trans i18nKey={"statusCheckerHeader.betaAlert"} ns="common">
            <strong />
          </Trans>
        </Alert>
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <div
              className="usa-logo display-flex flex-align-center"
              id="basic-logo"
              style={{ gap: "1rem" }}
            >
              <div className="logo-wrapper" style={{ display: "flex", alignItems: "center" }}>
                <Logo
                  size="slim"
                  image={
                    <img
                      src="/img/nj_taxation_logo.png"
                      width={75}
                      height={75}
                      alt="New Jersey Divison of Taxation logo"
                      style={{ display: "block", verticalAlign: "middle" }}
                    />
                  }
                />
              </div>
              <em
                className="usa-logo__text"
                style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}
              >
                <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                  {t("appFoundHeader.ptr")}
                </span>
                <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                  {t("appFoundHeader.statusChecker")}
                </span>
              </em>
            </div>
            <button className="usa-menu-btn">{t("appFoundHeader.menu")}</button>
          </div>
          <nav aria-label="Primary navigation" className="usa-nav">
            <button className="usa-nav__close" aria-label="Close navigation">
              <svg className="usa-icon" aria-hidden="true" focusable="false" role="img">
                <use href="./img/sprite.svg#close"></use>
              </svg>
            </button>

            <ul className="usa-nav__primary usa-accordion">
              <li className="usa-nav__primary-item">
                <a
                  className="usa-nav__link usa-current"
                  style={{ color: "#005ea2", pointerEvents: "none", fontSize: "1.25rem" }}
                >
                  <span>2025</span>
                </a>
              </li>
              <li className="usa-nav__primary-item">
                <a className="usa-nav__link" href="/" style={{ fontSize: "1.25rem" }}>
                  <span className="padding-right-1">{t("appFoundHeader.logout")}</span>
                  <svg focusable="true" role="img" width="20" height="20" fill="currentColor">
                    <use href="/img/sprite.svg#logout"></use>
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};
