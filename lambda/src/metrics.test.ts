import { describe, it, expect, afterEach, vi } from "vitest";
import { embeddedMetricsPublisher } from "./metrics.ts";

describe("embeddedMetricsPublisher.recordResponse", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([200, 500])("emits an EMF log entry for status code %d", (statusCode) => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    embeddedMetricsPublisher.recordResponse({ statusCode });

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const entry = JSON.parse(consoleLogSpy.mock.calls[0][0] as string);

    expect(entry._aws.CloudWatchMetrics).toEqual([
      {
        Namespace: "TaxReliefStatusApi",
        Dimensions: [["StatusCode"]],
        Metrics: [{ Name: "ResponseCount", Unit: "Count" }],
      },
    ]);
    expect(typeof entry._aws.Timestamp).toBe("number");
    expect(entry.StatusCode).toBe(String(statusCode));
    expect(entry.ResponseCount).toBe(1);
  });
});
