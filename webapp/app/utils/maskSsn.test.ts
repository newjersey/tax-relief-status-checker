import { describe, it, expect } from "vitest";

import { maskSsn } from "./maskSsn";

describe("maskSsn", () => {
  it("masks a standard hyphenated SSN showing only last four digits", () => {
    expect(maskSsn("123-45-6789")).toBe("6789");
  });

  it("handles SSN without hyphens", () => {
    expect(maskSsn("123456789")).toBe("6789");
  });
});
