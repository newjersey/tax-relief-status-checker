"use client";
import { Alert, Logo } from "@trussworks/react-uswds";
import { useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  useDataStore,
  CurrentYear,
  DataType,
  YearRecord,
} from "@/components/TaxReliefDataProvider";
import { useRouter } from "next/navigation";
import { determineRoute } from "@/app/utils/determineRoute";

export const YearSelector = ({
  currentYear,
  setCurrentYear,
  records,
}: {
  currentYear: CurrentYear;
  setCurrentYear: (year: CurrentYear) => void;
  records: Readonly<Partial<Record<CurrentYear, YearRecord>>>;
}) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const selectYear = (year: CurrentYear) => {
    const record = records[year];
    if (!record) return;

    setCurrentYear(year);
    router.push(determineRoute(record, year));
  };

  if (currentYear === CurrentYear.YEAR2024) {
    return (
      <>
        <button
          className="usa-accordion__button usa-nav__link usa-current"
          style={{ fontSize: "1.25rem", color: "#005ea2" }}
          aria-expanded="false"
          aria-controls="basic-nav-section-one-acc-99bd76fa-64bc-4adc-be98-8947e5e9703b"
        >
          <span>{t("year2024")}</span>
        </button>
        <ul
          className="usa-nav__submenu"
          hidden={true}
          id="basic-nav-section-one-acc-99bd76fa-64bc-4adc-be98-8947e5e9703b"
        >
          <li className="usa-nav__submenu-item">
            <a
              href="#2025"
              onClick={(e) => {
                e.preventDefault();
                selectYear(CurrentYear.YEAR2025);
                document
                  .querySelector(".usa-accordion__button")
                  ?.setAttribute("aria-expanded", "false");
                document.querySelector(".usa-nav__submenu")?.setAttribute("hidden", "true");
              }}
              className=""
              style={{ fontSize: "1.25rem" }}
            >
              {t("year2025")}
            </a>
          </li>
        </ul>
      </>
    );
  }
  return (
    <>
      <button
        className="usa-accordion__button usa-nav__link"
        style={{ fontSize: "1.25rem" }}
        aria-expanded="false"
        aria-controls="basic-nav-section-one-acc-99bd76fa-64bc-4adc-be98-8947e5e9703b"
      >
        <span>{t("priorTaxYears")}</span>
      </button>
      <ul
        className="usa-nav__submenu"
        hidden={true}
        id="basic-nav-section-one-acc-99bd76fa-64bc-4adc-be98-8947e5e9703b"
      >
        <li className="usa-nav__submenu-item">
          <a
            href="#2024"
            onClick={(e) => {
              e.preventDefault();
              selectYear(CurrentYear.YEAR2024);
              document
                .querySelector(".usa-accordion__button")
                ?.setAttribute("aria-expanded", "false");
              document.querySelector(".usa-nav__submenu")?.setAttribute("hidden", "true");
            }}
            className=""
            style={{ fontSize: "1.25rem" }}
          >
            {" "}
            {t("year2024")}
          </a>
        </li>
      </ul>
    </>
  );
};

//new name?
export const CurrentYearLink = ({
  currentYear,
  setCurrentYear,
  records,
}: {
  currentYear: CurrentYear;
  setCurrentYear: (year: CurrentYear) => void;
  records: Readonly<Partial<Record<CurrentYear, YearRecord>>>;
}) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const selectYear = (year: CurrentYear) => {
    const record = records[year];
    if (!record) return;

    setCurrentYear(year);
    router.push(determineRoute(record, year));
  };

  //has 2024 + 2025 record
  if (records[CurrentYear.YEAR2024] && records[CurrentYear.YEAR2025]) {
    if (currentYear === CurrentYear.YEAR2025) {
      return (
        <>
          <a
            className="usa-nav__link usa-current"
            style={{ color: "#005ea2", pointerEvents: "none", fontSize: "1.25rem" }}
          >
            <span>{t("year2025")}</span>
          </a>
        </>
      );
    } else if (currentYear === CurrentYear.YEAR2024) {
      return (
        <>
          <a
            href="#2025"
            onClick={(e) => {
              e.preventDefault();
              selectYear(CurrentYear.YEAR2025);
            }}
            className="usa-nav__link"
            style={{ fontSize: "1.25rem" }}
          >
            <span>{t("year2025")}</span>
          </a>
        </>
      );
    }

    //has only 2024 record
  } else if (records[CurrentYear.YEAR2024]) {
    return (
      <>
        <a
          className="usa-nav__link usa-current"
          style={{ color: "#005ea2", pointerEvents: "none", fontSize: "1.25rem" }}
        >
          <span>{t("year2024")}</span>
        </a>
      </>
    );
  }

  //has only 2025 record
  return (
    <>
      <a
        className="usa-nav__link usa-current"
        style={{ color: "#005ea2", pointerEvents: "none", fontSize: "1.25rem" }}
      >
        <span>{t("year2025")}</span>
      </a>
    </>
  );
};

/** Property Tax Relief Status Checker and logo */
export const SessionHeader = () => {
  const { t } = useTranslation("common");
  const { setCurrentYear, dataStore } = useDataStore();
  const router = useRouter();
  useEffect(() => {
    if (!dataStore || dataStore.type !== DataType.STATUS) {
      router.replace("/");
    }
  }, [dataStore, router]);

  if (!dataStore || dataStore.type !== DataType.STATUS) {
    return null;
  }

  const { currentYear, records } = dataStore;

  useEffect(() => {
    const menuButton = document.querySelector(".usa-menu-btn");
    const closeButton = document.querySelector(".usa-nav__close");
    const overlay = document.querySelector(".usa-overlay");
    const nav = document.querySelector(".usa-nav");
    const subMenu = document.querySelector(".usa-nav__submenu");
    const yearsNavigator = document.querySelector(".usa-accordion__button");

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

    const toggleSubMenu = () => {
      const isOpen = yearsNavigator?.getAttribute("aria-expanded") === "true";
      if (isOpen) closeSubMenu();
      else openSubMenu();
    };

    const openSubMenu = () => {
      yearsNavigator?.setAttribute("aria-expanded", "true");
      subMenu?.removeAttribute("hidden");
    };

    const closeSubMenu = () => {
      yearsNavigator?.setAttribute("aria-expanded", "false");
      subMenu?.setAttribute("hidden", "true");
    };

    const closeOnOutsideClick = (e: MouseEvent) => {
      if (subMenu && !subMenu.contains(e.target as Node)) {
        closeSubMenu();
      }
    };

    menuButton?.addEventListener("click", openMenu);
    closeButton?.addEventListener("click", closeMenu);
    overlay?.addEventListener("click", closeMenu);
    yearsNavigator?.addEventListener("click", toggleSubMenu);
    document.addEventListener("mousedown", closeOnOutsideClick);

    return () => {
      menuButton?.removeEventListener("click", openMenu);
      closeButton?.removeEventListener("click", closeMenu);
      overlay?.removeEventListener("click", closeMenu);
      yearsNavigator?.removeEventListener("click", toggleSubMenu);
      document.removeEventListener("mousedown", closeOnOutsideClick);
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
                  {t("appFoundHeader.propertyTaxRelief")}
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
                <CurrentYearLink
                  currentYear={currentYear}
                  setCurrentYear={setCurrentYear}
                  records={records}
                />
              </li>
              {records[CurrentYear.YEAR2024] && records[CurrentYear.YEAR2025] && (
                <li className="usa-nav__primary-item">
                  <YearSelector
                    currentYear={currentYear}
                    setCurrentYear={setCurrentYear}
                    records={records}
                  />
                </li>
              )}

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
