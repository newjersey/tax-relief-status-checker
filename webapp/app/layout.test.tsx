import { describe, it, expect } from "vitest";
import { vi } from "vitest";
import RootLayout from "./layout";
import { render } from "@testing-library/react";

describe("layout for all pages", () => {
  it("does not include Google Tag Manager when env variable is set to false", () => {
    vi.stubEnv("ENABLE_ANALYTICS", "false");
    render(
      <RootLayout>
        <div></div>
      </RootLayout>,
      { container: document.head },
    );
    expect(document.head.textContent).not.toMatch("gtag");
  });

  it("does include Google Tag Manager when env variable is set to true", () => {
    vi.stubEnv("ENABLE_ANALYTICS", "true");
    render(
      <RootLayout>
        <div></div>
      </RootLayout>,
      { container: document.head },
    );
    expect(document.head.textContent).toMatch("gtag");
  });
});
