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

  return (
    <div>
      <div className="grid-row">
        <div className={colSize}>
          <p>
            SSN/ITIN: <strong>***-**-{lastFourSsnDigits}</strong>
          </p>
        </div>
        <div className={colSize}>
          <p>
            ZIP Code: <strong>{zipCode}</strong>
          </p>
        </div>{" "}
        <div className={colSize}>
          <p>
            Tax Year: <strong>2025</strong>
          </p>
        </div>
      </div>
      {paymentType && (
        <div className="grid-row">
          <div className="tablet:grid-col-6">
            <p>
              Payment Type: <strong>{paymentType}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
