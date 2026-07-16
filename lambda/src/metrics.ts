/** CloudWatch namespace under which all custom metrics emitted by this API are published. */
const METRICS_NAMESPACE = "TaxReliefStatusApi";

/** Name of the metric that counts one API response per invocation, dimensioned by HTTP status code. */
const RESPONSE_COUNT_METRIC_NAME = "ResponseCount";

export interface RecordResponseParams {
  readonly statusCode: number;
}

export interface MetricsPublisher {
  recordResponse(params: RecordResponseParams): void;
}

/**
 * Shape of a single CloudWatch Embedded Metric Format (EMF) log entry. CloudWatch Logs' backend
 * log-processing pipeline automatically parses any log line matching this envelope into a real
 * CloudWatch custom metric.
 */
interface EmfLogEntry {
  readonly _aws: {
    readonly Timestamp: number;
    readonly CloudWatchMetrics: ReadonlyArray<{
      readonly Namespace: string;
      readonly Dimensions: ReadonlyArray<ReadonlyArray<string>>;
      readonly Metrics: ReadonlyArray<{ readonly Name: string; readonly Unit: string }>;
    }>;
  };
  readonly StatusCode: string;
  readonly ResponseCount: number;
}

/**
 * Builds a single EMF log entry recording one ResponseCount data point for the given HTTP status
 * code.
 *
 * @param params - The response details to encode into the EMF entry.
 * @returns A plain object ready to be serialized and printed via console.log.
 */
const buildResponseCountEmfEntry = (params: RecordResponseParams): EmfLogEntry => ({
  _aws: {
    Timestamp: Date.now(),
    CloudWatchMetrics: [
      {
        Namespace: METRICS_NAMESPACE,
        Dimensions: [["StatusCode"]],
        Metrics: [{ Name: RESPONSE_COUNT_METRIC_NAME, Unit: "Count" }],
      },
    ],
  },
  StatusCode: String(params.statusCode),
  ResponseCount: 1,
});

export const embeddedMetricsPublisher: MetricsPublisher = {
  recordResponse: (params: RecordResponseParams): void => {
    console.log(JSON.stringify(buildResponseCountEmfEntry(params)));
  },
};
