import { createHash } from "node:crypto";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

/** Input shape for the autofile lookup request. */
export interface AutofileLookupRequest {
  /** The 9-digit Social Security Number. */
  readonly ssn: string;

  /** The 5-digit ZIP code. */
  readonly zip: string;
}

/** Response shape returned by the autofile lookup API. */
export interface AutofileLookupResponse {
  /** Whether the SSN/ZIP pair is planned for ANCHOR autofile. */
  readonly autofilePlanned: boolean;
}

const dynamoClient = new DynamoDBClient({});

/**
 * Computes the SHA-256 hash of a SSN/ZIP pair to use as the DynamoDB partition key. Hashing avoids
 * storing raw PII in the database.
 */
export const computeSsnZipHash = (ssn: string, zip: string): string => {
  return createHash("sha256").update(`${ssn}|${zip}`).digest("hex");
};

/** Validates that the request body contains a valid SSN and ZIP. */
const parseRequestBody = (body: string | undefined): AutofileLookupRequest | null => {
  if (!body) return null;

  try {
    const parsed = JSON.parse(body) as Record<string, unknown>;
    const ssn = parsed.ssn;
    const zip = parsed.zip;

    if (typeof ssn !== "string" || !/^\d{9}$/.test(ssn)) return null;
    if (typeof zip !== "string" || !/^\d{5}$/.test(zip)) return null;

    return { ssn, zip };
  } catch {
    return null;
  }
};

/** Lambda handler for the ANCHOR autofile lookup API. */
export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const TABLE_NAME = process.env.TABLE_NAME;

  if (!TABLE_NAME) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "TABLE_NAME environment variable is not configured" }),
    };
  }

  const request = parseRequestBody(event.body);
  if (!request) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Request must include ssn (9 digits) and zip (5 digits)" }),
    };
  }

  const ssnZipHash = computeSsnZipHash(request.ssn, request.zip);

  const result = await dynamoClient.send(
    new GetItemCommand({
      TableName: TABLE_NAME,
      Key: { ssnZipHash: { S: ssnZipHash } },
    }),
  );

  const response: AutofileLookupResponse = {
    autofilePlanned: result.Item !== undefined,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
