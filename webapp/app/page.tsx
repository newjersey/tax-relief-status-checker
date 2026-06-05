"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Logo, TextInputMask, Form, Button } from "@trussworks/react-uswds";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { HorizontalDivider } from "@/components/HorizontalDivider";
import { LandingPageFaq } from "@/components/LandingPageFaq";

/** Form data collected from the user. */
interface UserData {
  /** Social Security Number in ###-##-#### format. */
  readonly ssn: string;
  /** Five-digit ZIP code the user filed with. */
  readonly zipCode: string;
}

/** Response shape returned by the status API proxy. */
interface StatusRecord {
  /** Tax year the record applies to. */
  readonly return_year: number;
  /** Date the application was received. */
  readonly application_date: string;
}

/** Masks the SSN for display — shows only the last four digits. */
const maskSsn = (ssn: string): string => {
  const digits = ssn.replace(/\D/g, "");
  return `***-**-${digits.slice(5)}`;
};

/** Landing page with the SSN + ZIP lookup form. */
const LandingPage = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>({
    defaultValues: {
      ssn: "",
      zipCode: "",
    },
    shouldFocusError: false,
  });

  const onSubmit: SubmitHandler<UserData> = async (data) => {
    setApiError(null);

    try {
      const response = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ssn: data.ssn, zip: data.zipCode }),
      });

      if (!response.ok) {
        setApiError("Something went wrong while checking your status. Please try again.");
        return;
      }

      const body = (await response.json()) as {
        records: readonly StatusRecord[];
      };

      const record2025 = body.records.find((r) => r.return_year === 2025);

      if (!record2025) {
        setApiError("No 2025 application found for the SSN and ZIP code provided.");
        return;
      }

      const maskedSsn = maskSsn(data.ssn);
      const params = new URLSearchParams({
        ssn: maskedSsn,
        date: record2025.application_date,
      });

      router.push(`/status?${params.toString()}`);
    } catch {
      setApiError("Something went wrong while checking your status. Please try again.");
    }
  };

  return (
    <main id="main-content">
      <section className="usa-section">
        <div className="grid-container">
          <div className="tablet:grid-col-6">
            <Logo
              size="slim"
              image={
                <img src="/img/nj_taxation_logo.png" width={90} height={90} alt="Treasury logo" />
              }
            />
            <h1 className="font-heading-2xl">Property Tax Relief Status Checker</h1>
          </div>
          <div className="grid-row grid-gap margin-top-5 margin-bottom-10">
            <div className="tablet:grid-col-6">
              <Form onSubmit={handleSubmit(onSubmit)} className="maxw-full" noValidate>
                <h2>
                  Enter your Social Security Number (SSN) and Zip Code to check your 2025 Property
                  Tax Relief application status
                </h2>

                {apiError && (
                  <div
                    className="usa-alert usa-alert--error usa-alert--slim margin-bottom-3"
                    role="alert"
                  >
                    <div className="usa-alert__body">
                      <p className="usa-alert__text">{apiError}</p>
                    </div>
                  </div>
                )}

                <Label htmlFor="ssn" requiredMarker={true}>
                  SSN or Individual Taxpayer Identification Number (ITIN)
                </Label>
                <div className="tablet:grid-col-10">
                  <TextInputMask
                    id="ssn"
                    type="text"
                    mask="###-##-####"
                    pattern="\d{3}-\d{2}-\d{4}"
                    required={true}
                    aria-invalid={errors.ssn ? "true" : "false"}
                    {...register("ssn", {
                      required: "This question is required",
                      pattern: {
                        value: /\d{3}-\d{2}-\d{4}/,
                        message: "Entered value does not match social security number format",
                      },
                    })}
                  />
                  {errors.ssn && (
                    <span id="ssnErrorMessage" className="usa-error-message" role="alert">
                      {errors.ssn.message}
                    </span>
                  )}
                </div>

                <Label htmlFor="zipCode" requiredMarker={true}>
                  Zip code you filed with
                </Label>
                <div className="tablet:grid-col-10">
                  <TextInputMask
                    id="zipCode"
                    type="text"
                    mask="#####"
                    pattern="\d{5}"
                    required={true}
                    aria-invalid={errors.zipCode ? "true" : "false"}
                    {...register("zipCode", {
                      required: "This question is required",
                      minLength: {
                        value: 5,
                        message: "Zip code must have five digits",
                      },
                    })}
                  />
                  {errors.zipCode && (
                    <span id="zipCodeErrorMessage" className="usa-error-message" role="alert">
                      {errors.zipCode.message}
                    </span>
                  )}
                </div>
                <Button
                  type="submit"
                  className="usa-button usa-button--small margin-top-5 margin-bottom-3"
                >
                  Check Status
                </Button>
              </Form>
            </div>
          </div>
          <HorizontalDivider />
          <div className="grid-row grid-gap margin-top-5">
            <h2 className="font-heading-l">Frequently Asked Questions (FAQs)</h2>
            <LandingPageFaq headingLevel="h3" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
