import { render } from "@testing-library/react";
import { expect } from "vitest";
import { TaxpayerInfoHeader } from "./TaxpayerInfoHeader";

describe("header component", () => {
  it("renders the header with no payment method", () => {
    render(<TaxpayerInfoHeader lastFourSsnDigits="0123" zipCode="12345" />);
    expect(document.body.textContent).toContain("SSN/ITIN: ***-**-0123");
    expect(document.body.textContent).toContain("ZIP Code: 12345");
    expect(document.body.textContent).toContain("Tax Year: 2025");
    expect(document.body.textContent).not.toContain("Payment Type");
  });

  it("renders the header with a check payment method", () => {
    render(<TaxpayerInfoHeader lastFourSsnDigits="0123" zipCode="12345" paymentType="Check" />);
    expect(document.body.textContent).toContain("SSN/ITIN: ***-**-0123");
    expect(document.body.textContent).toContain("ZIP Code: 12345");
    expect(document.body.textContent).toContain("Tax Year: 2025");
    expect(document.body.textContent).toContain("Payment Type: Check");
  });

  it("renders the header with a direct deposit payment method", () => {
    render(
      <TaxpayerInfoHeader lastFourSsnDigits="0123" zipCode="12345" paymentType="Direct Deposit" />,
    );
    expect(document.body.textContent).toContain("SSN/ITIN: ***-**-0123");
    expect(document.body.textContent).toContain("ZIP Code: 12345");
    expect(document.body.textContent).toContain("Tax Year: 2025");
    expect(document.body.textContent).toContain("Payment Type: Direct Deposit");
  });
});
