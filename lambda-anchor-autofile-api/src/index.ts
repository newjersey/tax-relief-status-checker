import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { computeSsnZipHash } from "./util/computeSsnZipHash";

enum PaymentMethod {
  Check = "check",
  DirectDeposit = "direct_deposit",
}

export interface AutofileLookupRequest {
  readonly ssn: string;
  readonly zip: string;
}

export interface AutofileLookupResponse {
  /** Whether the SSN/ZIP pair is planned for ANCHOR autofile. */
  readonly autofilePlanned: boolean;
  readonly paymentMethod?: PaymentMethod;
}

const dynamoClient = new DynamoDBClient({});

const validateEvent = (event: Record<string, unknown>): AutofileLookupRequest | null => {
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event;
  const { ssn, zip } = body;

  if (typeof ssn !== "string" || typeof zip !== "string") return null;

  const sanitizedSsn = ssn.replace(/-/g, "");
  if (!/^\d{9}$/.test(sanitizedSsn)) return null;
  if (!/^\d{5}$/.test(zip)) return null;

  return { ssn: sanitizedSsn, zip };
};

/** Response shape returned when validation fails. */
export interface AutofileLookupErrorResponse {
  /** Machine-readable error identifier. */
  readonly error: string;
}

/** Lambda handler for the ANCHOR autofile lookup. Invoked directly (not via API Gateway). */
export const handler = async (
  event: unknown,
): Promise<AutofileLookupResponse | AutofileLookupErrorResponse> => {
  const TABLE_NAME = process.env.TABLE_NAME;

  if (!TABLE_NAME) {
    throw new Error("TABLE_NAME environment variable is not configured");
  }

  const request = validateEvent(event);
  if (!request) {
    return { error: "Request must include ssn (9 digits) and zip (5 digits)" };
  }

  const ssnZipHash = computeSsnZipHash(request.ssn, request.zip);

  const result = await dynamoClient.send(
    new GetItemCommand({
      TableName: TABLE_NAME,
      Key: { ssnZipHash: { S: ssnZipHash } },
    }),
  );

  if (!result.Item) {
    return { autofilePlanned: false };
  }

  const isDirectDeposit = result.Item.directDeposit?.BOOL === true;

  return {
    autofilePlanned: true,
    paymentMethod: isDirectDeposit ? PaymentMethod.DirectDeposit : PaymentMethod.Check,
  };
};
