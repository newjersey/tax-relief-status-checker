import { describe, it, expect } from "vitest";
import { vi } from "vitest";
import RootLayout from "./layout";
import { render } from "@testing-library/react";

describe("layout for all pages", () => {
  it("does not include Google Tag Manager for dev", () => {
    vi.stubEnv("STAGE", "dev");
    const { asFragment } = render(
      <RootLayout>
        <div></div>
      </RootLayout>,
    );
    expect(asFragment()).toMatchInlineSnapshot(`
    <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-KMSDMG9NFN"
        strategy="afterInteractive"
      />
  `);
  });

  it("does include Google Tag Manager for prod", () => {
    vi.stubEnv("STAGE", "dev");
    const { asFragment } = render(
      <RootLayout>
        <div></div>
      </RootLayout>,
    );
    expect(asFragment()).toMatchInlineSnapshot(`
    <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-KMSDMG9NFN"
        strategy="afterInteractive"
      />
  `);
  });
});
