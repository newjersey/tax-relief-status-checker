import { describe, it, expect } from "vitest";

import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats a full ISO datetime string as MM/DD/YYYY", () => {
    expect(formatDate("2026-03-19T00:00:00.000Z")).toBe("03/19/2026");
  });

  it("pads single-digit months and days", () => {
    expect(formatDate("2026-01-02T00:00:00.000Z")).toBe("01/02/2026");
  });

  it("handles a date at end of day in UTC", () => {
    expect(formatDate("2026-06-15T23:59:59.999Z")).toBe("06/15/2026");
  });
});
