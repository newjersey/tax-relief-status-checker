import { describe, it, expect } from "vitest";

describe("status API route", () => {
  it("module exports a POST handler", async () => {
    const routeModule = await import("./route");
    expect(typeof routeModule.POST).toBe("function");
  });
});
