import { redirect } from "next/navigation";
import { Logo } from "@trussworks/react-uswds";
import Link from "next/link";

interface StatusPageProps {
  readonly searchParams: Promise<{
    readonly lastFourSsnDigits?: string;
    readonly zipCode?: string;
    readonly date?: string;
  }>;
}

const StatusPage = async ({ searchParams }: StatusPageProps) => {
  const params = await searchParams;
  const lastFourSsnDigits = params.lastFourSsnDigits;
  const zipCode = params.zipCode;
  const applicationDate = params.date;

  if (!lastFourSsnDigits || !applicationDate || !zipCode) {
    redirect("/");
  }

  return (
    <main id="main-content">
      <section className="usa-section">
        <div className="grid-container">
          <div style={{ textAlign: "right" }}>
            <Link className="usa-button usa-button--outline margin-right-3 margin-top-3" href="/">
              <svg focusable="false" role="img" width="20" height="20" fill="#005ea2">
                <use href="/img/sprite.svg#logout"></use>
              </svg>
              Log out
            </Link>
          </div>
          <div>
            <div>
              <Logo
                size="slim"
                image={
                  <img
                    src="/img/nj_taxation_logo.png"
                    width={100}
                    height={100}
                    alt="Treasury logo"
                  />
                }
              />
              <h1 className="font-heading-3xl">
                Property Tax Relief
                <br />
                Status Checker
              </h1>
            </div>
            <div className="grid-row">
              <div className="tablet:grid-col-3">
                <p>
                  SSN/ITIN: <strong>***-**-{lastFourSsnDigits}</strong>
                </p>
              </div>
              <div className="tablet:grid-col-3">
                <p>
                  Zip Code: <strong>{zipCode}</strong>
                </p>
              </div>{" "}
              <div className="tablet:grid-col-3">
                <p>
                  Tax Year: <strong>2025</strong>
                </p>
              </div>
            </div>
          </div>
          <div className="margin-top-4">
            <p className="font-heading-xl">Your application was received on {applicationDate}.</p>
            <p>
              Your application is being reviewed. No action is needed right now. If you applied
              early this year, please check back in early summer.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default StatusPage;
