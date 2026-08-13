"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const PAGES_WITH_LOGOUT = ["/more-information-needed", "/application-received", "/payment-info"];

export const LogoutButton = () => {
  const pathname = usePathname();

  const shouldShowButton = PAGES_WITH_LOGOUT.includes(pathname);

  if (!shouldShowButton) return null;

  return (
    <>
      <div style={{ textAlign: "right" }}>
        <Link className="usa-button usa-button--outline margin-right-3 margin-top-3" href="/">
          <svg focusable="false" role="img" width="20" height="20" fill="#005ea2">
            <use href="/img/sprite.svg#logout"></use>
          </svg>
          Log out
        </Link>
      </div>
    </>
  );
};
