"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, TextInputMask, Form, Button } from "@trussworks/react-uswds";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { LandingPageFaqContent } from "@/app/LandingPageFaqContent";
import { FaqSection, expandFaqAccordionItem } from "@/components/FaqSection";
import { maskSsn } from "@/app/utils/maskSsn";
import { formatDate } from "@/app/utils/formatDate";
import { logGAEvent } from "./utils/analytics";
import { useDataStore } from "@/components/TaxReliefDataProvider";
import { setIssueFlagged } from "./utils/setIssueFlagged";
import { Transaction, TransactionStatus } from "@/components/types";

/** Form data collected from the user. */
interface UserData {
  readonly ssn: string;
  readonly zipCode: string;
}

/** Response shape returned by the status API. */
export interface StatusRecord {
  readonly return_year: string;
  readonly application_date: string;
  readonly anchor: Transaction[];
  readonly ptr: Transaction[];
  readonly stay_nj: Transaction[];
}

const hasPaymentSentTransaction = (record: StatusRecord) => {
  return (
    hasTransactionWithStatus(record.anchor, TransactionStatus.PAYMENT_SENT) ||
    hasTransactionWithStatus(record.ptr, TransactionStatus.PAYMENT_SENT) ||
    hasTransactionWithStatus(record.stay_nj, TransactionStatus.PAYMENT_SENT)
  );
};

const hasTransactionWithStatus = (
  transactionList: Transaction[],
  status: TransactionStatus,
): boolean => {
  for (const t of transactionList) {
    if (t.status === status) {
      return true;
    }
  }
  return false;
};

const returnToTop = () => {
  const topOfPage = document.querySelector(`#nj-header`);
  if (!topOfPage) return;
  topOfPage.scrollIntoView({ behavior: "smooth", block: "start" });
};

const LandingPage = () => {
  const router = useRouter();
  const { setDataStore } = useDataStore();
  const [alertContent, setAlertContent] = useState<ReactNode | null>(null);

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
    setAlertContent(null);

    try {
      const response = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ssn: data.ssn, zip: data.zipCode }),
      });

      if (!response.ok) {
        setAlertContent(
          <p className="usa-alert__text maxw-tablet">
            We are having an issue checking on your application status. Please try again later.
          </p>,
        );
        logGAEvent(`api_error`);
        returnToTop();
        return;
      }

      const body = (await response.json()) as {
        records: readonly StatusRecord[];
      };

      const record2025 = body.records.find((r) => r.return_year === "2025");

      if (!record2025) {
        setAlertContent(
          <>
            <h2 className="usa-alert__heading">No 2025 application found</h2>
            <p className="usa-alert__text">
              We couldn't find any records matching the SSN or ITIN and ZIP code you entered. Some
              common reasons why:
            </p>
            <ul>
              <li>
                <strong>Identity mismatch</strong>: The SSN/ITIN and ZIP code you filed on your
                application is different than the one you just entered.
              </li>
              <li>
                <strong>It's too soon</strong>: For online applications, it can take up to three
                weeks for an application to show up on this website. For paper applications, it can
                take up to 12 weeks. For ANCHOR-only applicants, check back in the fall of 2026.
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
        logGAEvent(`api_200_record_not_found`);
        returnToTop();
        return;
      }

      const lastFourSsnDigits = maskSsn(data.ssn);
      const formattedDate = formatDate(record2025.application_date);
      setDataStore({
        lastFourSsnDigits: lastFourSsnDigits,
        zipCode: data.zipCode,
        applicationDateString: formattedDate,
        anchor: record2025.anchor,
        ptr: record2025.ptr,
        stay_nj: record2025.stay_nj,
        issueFlagged: setIssueFlagged(record2025),
      });
      logGAEvent(`api_200_record_found`);
      if (hasPaymentSentTransaction(record2025)) {
        router.push("/payment-info");
      } else if (setIssueFlagged(record2025) !== undefined) {
        router.push("/more-information-needed");
      } else {
        router.push("/application-received");
      }
    } catch {
      setAlertContent(
        <p className="usa-alert__text maxw-tablet">
          We are having an issue checking on your application status. Please try again later.
        </p>,
      );
      logGAEvent(`api_error`);
      returnToTop();
    }
  };

  return (
    <main id="main-content">
      <section className="usa-section padding-top-2">
        <div className="grid-container">
          {alertContent && (
            <div
              className="usa-alert usa-alert--error usa-alert--slim margin-bottom-3"
              role="alert"
            >
              <div className="usa-alert__body">{alertContent}</div>
            </div>
          )}

          <div className="grid-row grid-gap margin-bottom-10">
            <div className="tablet:grid-col-6">
              <h1 className="font-heading-lg">
                This website is checking your 2025 PAS&#8209;1 application status
              </h1>
              <Form onSubmit={handleSubmit(onSubmit)} className="maxw-full" noValidate>
                <p className="text-bold font-heading-md">Enter your SSN or ITIN and ZIP Code</p>
                <Label htmlFor="ssn" requiredMarker={true}>
                  Social Security or Individual Taxpayer Identification Number
                </Label>
                <div className="tablet:grid-col-10">
                  <TextInputMask
                    id="ssn"
                    type="text"
                    autoComplete=""
                    mask="###-##-####"
                    pattern="\d{3}-\d{2}-\d{4}"
                    required={true}
                    aria-invalid={errors.ssn ? "true" : "false"}
                    aria-describedby={errors.ssn ? "ssnErrorMessage" : undefined}
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
                  ZIP code you submitted with your application
                </Label>
                <div className="tablet:grid-col-10">
                  <TextInputMask
                    id="zipCode"
                    type="text"
                    autoComplete="postal-code"
                    mask="#####"
                    pattern="\d{5}"
                    required={true}
                    aria-invalid={errors.zipCode ? "true" : "false"}
                    aria-describedby={errors.zipCode ? "zipCodeErrorMessage" : undefined}
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
            <FaqSection
              items={LandingPageFaqContent}
              titleHeadingLevel="h2"
              itemHeadingLevel="h3"
            />
          </div>
        </div>
      </section>
      <div className="grid-container usa-footer__return-to-top">
        <a href="#nj-header">Return to top</a>
      </div>
    </main>
  );
};

export default LandingPage;
