"use client";
import { Logo } from "@trussworks/react-uswds";
import { Alert } from "@trussworks/react-uswds";
import { LogoutButton } from "./LogoutButton";
import { useTranslation, Trans } from "react-i18next";

/** Property Tax Relief Status Checker and logo */
export const StatusCheckerHeader = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <header>
        <Alert className="margin-0" id="beta-banner" type="info" noIcon={true}>
          <Trans i18nKey={"statusCheckerHeader.betaAlert"} ns="common">
            <strong />
          </Trans>
        </Alert>
        <LogoutButton />
        <div className="grid-container">
          <div className="tablet:grid-col-6 padding-top-8">
            <Logo
              size="slim"
              image={
                <img
                  src="/img/nj_taxation_logo.png"
                  width={90}
                  height={90}
                  alt="New Jersey Divison of Taxation logo"
                />
              }
            />
            <p className="font-heading-2xl text-bold line-height-sans-1">
              {t("statusCheckerHeader.ptrStatusChecker")}
            </p>
          </div>
        </div>
      </header>
    </>
  );
};
