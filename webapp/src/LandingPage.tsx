import { Label, Logo, TextInputMask, Form, Button } from "@trussworks/react-uswds";
import { HorizontalDivider } from "./components/HorizontalDivider";
import { LandingPageFaq } from "./components/LandingPageFaq";
import { useForm, SubmitHandler } from "react-hook-form";

interface UserData {
  ssn: string;
  zipCode: string;
}

export const LandingPage = () => {
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

  const onSubmit: SubmitHandler<UserData> = (data) => {
    let key: keyof UserData;
    for (key in data) {
      const value = data[key] ?? "";
      window.sessionStorage.setItem(key, value);
    }
  };

  return (
    <>
      <main id="main-content">
        <section className="usa-section">
          <div className="grid-container">
            <div className="tablet:grid-col-6">
              <Logo
                size="slim"
                image={
                  <img src="/img/nj_taxation_logo.png" width={90} height={90} alt="Treasury logo" />
                }
              ></Logo>
              <h1 className="font-heading-2xl">Property Tax Relief Status Checker</h1>
            </div>
            <div className="grid-row grid-gap margin-top-5 margin-bottom-10">
              <div className="tablet:grid-col-6">
                <Form onSubmit={handleSubmit(onSubmit)} className="maxw-full" noValidate>
                  <h2>
                    Enter your Social Security Number (SSN) and Zip Code to check your 2025 Property
                    Tax Relief application status
                  </h2>
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
                        required: `This question is required`,
                        pattern: {
                          value: /\d{3}-\d{2}-\d{4}/,
                          message: "Entered value does not match social security number format",
                        },
                      })}
                    ></TextInputMask>
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
                        required: `This question is required`,
                        minLength: {
                          value: 5,
                          message: `Zip code must have five digits`,
                        },
                      })}
                    ></TextInputMask>
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
    </>
  );
};
