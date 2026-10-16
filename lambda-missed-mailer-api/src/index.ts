import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { computeSsnZipHash } from "./util/computeSsnZipHash";

export interface MissedMailerLookupRequest {
  readonly ssn: string;
  readonly zip: string;
}

export interface MissedMailerLookupResponse {
  readonly missedMailer: boolean;
}

const dynamoClient = new DynamoDBClient({});

const validateEvent = (event: Record<string, unknown>): MissedMailerLookupRequest | null => {
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event;
  const { ssn, zip } = body;

  if (typeof ssn !== "string" || typeof zip !== "string") return null;

  const sanitizedSsn = ssn.replace(/-/g, "");
  if (!/^\d{9}$/.test(sanitizedSsn)) return null;
  if (!/^\d{5}$/.test(zip)) return null;

  return { ssn: sanitizedSsn, zip };
};

export interface MissedMailerLookupErrorResponse {
  readonly error: string;
}

/** Lambda handler for the ANCHOR autofile lookup. Invoked directly (not via API Gateway). */
export const handler = async (
  event: unknown,
): Promise<MissedMailerLookupResponse | MissedMailerLookupErrorResponse> => {
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
    return { missedMailer: false };
  }
  return {
    missedMailer: true,
  };
};
