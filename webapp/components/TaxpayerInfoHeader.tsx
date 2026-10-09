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
  const colSize = "tablet:grid-col-4";
  const { t } = useTranslation("common");
  return (
    <div>
      <div className="grid-row">
        <div className={colSize}>
          <p>
            {t("taxpayerInfoHeader.ssn")} <strong>***-**-{lastFourSsnDigits}</strong>
          </p>
        </div>
        <div className={colSize}>
          <p>
            {t("taxpayerInfoHeader.zip")} <strong>{zipCode}</strong>
          </p>
        </div>
        <div className={colSize}>
          <p>
            {t("taxpayerInfoHeader.taxYear")} <strong>2025</strong>
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
