/**
 * CloudWatch namespace under which all custom metrics emitted by this API are published. A single
 * fixed namespace (rather than an env-configurable value) keeps every metric from this service
 * grouped consistently in the CloudWatch console and in any alarm definitions that reference it.
 */
const METRICS_NAMESPACE = "TaxReliefStatusApi";

/**
 * Name of the metric that counts one API response per invocation, dimensioned by HTTP status code.
 * A single metric name paired with a "StatusCode" dimension lets operators alarm on a specific
 * status code (e.g. ResponseCount where StatusCode=500) without needing a separate metric per
 * status code.
 */
const RESPONSE_COUNT_METRIC_NAME = "ResponseCount";

/** Parameters describing the response that should be recorded as a metric data point. */
export interface RecordResponseParams {
  /**
   * The HTTP status code returned to the caller (e.g. 200, 400, 500). Used as the "StatusCode"
   * dimension on the emitted metric so CloudWatch Alarms can be scoped to a specific status code.
   */
  readonly statusCode: number;
}

/**
 * Publishes operational metrics describing how the API responded to a request. Implementations must
 * never throw or block: recording a metric must not be able to cause a request to fail.
 */
export interface MetricsPublisher {
  /**
   * Records one response of the given status code as a metric data point.
   *
   * @param params - The response details to record.
   */
  recordResponse(params: RecordResponseParams): void;
}

/**
 * Shape of a single CloudWatch Embedded Metric Format (EMF) log entry. CloudWatch Logs' backend
 * log-processing pipeline automatically parses any log line matching this envelope into a real
 * CloudWatch custom metric — this is why no AWS SDK call, IAM permission, or network request is
 * needed from the Lambda code itself.
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

/**
 * Concrete MetricsPublisher that emits metrics using the CloudWatch Embedded Metric Format (EMF).
 * Publishing is nothing more than writing a specially-shaped JSON line to stdout via console.log;
 * CloudWatch Logs extracts it into a real custom metric server-side. This avoids any new AWS SDK
 * dependency, IAM permission, or added latency in the request path.
 */
export const embeddedMetricsPublisher: MetricsPublisher = {
  recordResponse: (params: RecordResponseParams): void => {
    console.log(JSON.stringify(buildResponseCountEmfEntry(params)));
  },
};
