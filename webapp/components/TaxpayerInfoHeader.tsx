import { useTranslation } from "react-i18next";

export interface TaxpayerInfoHeaderProps {
  readonly lastFourSsnDigits: string;
  readonly zipCode: string;
  readonly paymentType?: string;
}

export const TaxpayerInfoHeader = ({
  lastFourSsnDigits,
  zipCode,
  paymentType,
}: TaxpayerInfoHeaderProps) => {
  const colSize = "tablet:grid-col-3";
  const { t } = useTranslation("common");
  return (
    <div>
      <div className="grid-row padding-top-4">
        <div className={colSize}>
          <p style={{ color: "#71767A", marginRight: "1rem", fontSize: "1.25rem" }}>
            <abbr
              title={t("taxpayerInfoHeader.ssnTitle")}
              style={{ textDecoration: "none", borderBottom: "none" }}
            >
              {t("taxpayerInfoHeader.ssn")}
            </abbr>{" "}
            <strong>***-**-{lastFourSsnDigits}</strong>
          </p>
        </div>
        <div className={colSize}>
          <p style={{ color: "#71767A", fontSize: "1.25rem" }}>
            {t("taxpayerInfoHeader.zip")} <strong>{zipCode}</strong>
          </p>
        </div>
      </div>
      {paymentType && (
        <div className="grid-row">
          <div className="tablet:grid-col-6">
            <p>
              {t("taxpayerInfoHeader.paymentType")} <strong>{paymentType}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
