"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Logo, TextInputMask, Form, Button } from "@trussworks/react-uswds";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { LandingPageFaq, expandFaqAccordionItem } from "@/components/LandingPageFaq";
import { maskSsn } from "@/app/utils/maskSsn";
import { formatDate } from "@/app/utils/formatDate";

/** Form data collected from the user. */
interface UserData {
  readonly ssn: string;
  readonly zipCode: string;
}

/** Response shape returned by the status API. */
interface StatusRecord {
  readonly return_year: string;
  readonly application_date: string;
}

const LandingPage = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState<ReactNode | null>(null);

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
        setApiError(
          <p className="usa-alert__text maxw-tablet">
            We are having an issue checking on your application status. Please try again later.
          </p>,
        );
        return;
      }

      const body = (await response.json()) as {
        records: readonly StatusRecord[];
      };

      const record2025 = body.records.find((r) => r.return_year === "2025");

      if (!record2025) {
        setApiError(
          <>
            <h2 className="usa-alert__heading">No 2025 application found</h2>
            <p className="usa-alert__text">
              We couldn't find any records matching the SSN or ITIN and zip code you entered. Some
              reasons why:
            </p>
            <ul>
              <li>
                <strong>Identity mismatch</strong>: The SSN/ITIN and zip code you filed on your
                application is different than the one you entered in this tool.
              </li>
              <li>
                <strong>It's too soon</strong>: For online applications, it can take up to 3 weeks
                for an application to show up on this website. For paper applications, it can take
                up to 12 weeks. For ANCHOR-only applicants, check back in the fall of 2026.
              </li>
            </ul>
            <p className="usa-alert__text">
              Find the{" "}
              <a
                href="#faq_no_2025_application_found"
                onClick={(e) => {
                  e.preventDefault();
                  expandFaqAccordionItem("faq_no_2025_application_found");
                }}
              >
                full list of other possible reasons
              </a>{" "}
              your application is not showing up
            </p>
          </>,
        );
        return;
      }

      const lastFourSsnDigits = maskSsn(data.ssn);
      const formattedDate = formatDate(record2025.application_date);
      const params = new URLSearchParams({
        lastFourSsnDigits: lastFourSsnDigits,
        zipCode: data.zipCode,
        date: formattedDate,
      });

      router.push(`/status?${params.toString()}`);
    } catch {
      setApiError(
        <p className="usa-alert__text maxw-tablet">
          We are having an issue checking on your application status. Please try again later.
        </p>,
      );
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

          {apiError && (
            <div
              className="usa-alert usa-alert--error usa-alert--slim margin-bottom-3"
              role="alert"
            >
              <div className="usa-alert__body">{apiError}</div>
            </div>
          )}

          <div className="grid-row grid-gap margin-top-5 margin-bottom-10">
            <div className="tablet:grid-col-6">
              <h2>This website is checking your 2025 PAS-1 application status</h2>
              <Form onSubmit={handleSubmit(onSubmit)} className="maxw-full" noValidate>
                <h3>Enter your SSN or ITN and Zip Code</h3>
                <Label htmlFor="ssn" requiredMarker={true}>
                  Social Security or Individual Taxpayer Identification Number
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
                        message: "SSN or ITIN number entered must have nine digits",
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
                  Zip code you submitted with your application
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
                  <svg focusable="false" role="img" width="20" height="20" fill="white">
                    <use href="/img/sprite.svg#login"></use>
                  </svg>
                </Button>
              </Form>
            </div>
          </div>
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
