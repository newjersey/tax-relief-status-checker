import { describe, it, expect } from "vitest";

import { formatCheckAmount } from "./formatCheckAmount";

describe("formatDate", () => {
  it("returns the same amount for an amount with no decimal places", () => {
    expect(formatCheckAmount(100)).toBe("100");
  });

  it("pads a zero for an amount with 1 decimal place", () => {
    expect(formatCheckAmount(100.5)).toBe("100.50");
  });

  it("returns the same amount for an amount with 2 decimal places", () => {
    expect(formatCheckAmount(100.55)).toBe("100.55");
  });

  it("rounds to 2 digits for an amount with >2 decimal places", () => {
    expect(formatCheckAmount(100.555)).toBe("100.56");
  });
});
