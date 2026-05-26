import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import oracledb from "oracledb";

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/** SQL query to look up filer records by SSN and ZIP */
const INQUIRY_QUERY = `SELECT * FROM ELF_SAVER_INQUIRY
  WHERE SOCIAL_SECURITY_NUMBER_IDN = :ssn AND ZIP_ADR = :zip`;

/** Result of input validation */
interface ValidationResult {
  /** Whether the input passed validation */
  readonly valid: boolean;
  /** Error message if validation failed */
  readonly error?: string;
  /** Sanitized SSN (digits only) */
  readonly ssn?: string;
  /** Sanitized ZIP code */
  readonly zip?: string;
}

interface ResponseRecord {
  readonly return_year: string;
  readonly application_date: string;
}

interface BuildResponseResult {
  readonly records: ResponseRecord[];
}

/** Database row from ELF_SAVER_INQUIRY */
interface InquiryRow {
  readonly SOCIAL_SECURITY_NUMBER_IDN: string;
  readonly ZIP_ADR: string;
  readonly RNY_APPLIED_DTE: string;
  readonly RETURN_YEAR_DTE: number;
  readonly [key: string]: unknown;
}

/** Database credentials retrieved from Secrets Manager */
interface DatabaseCredentials {
  /** Oracle database username */
  readonly ORACLE_DB_USER: string;
  /** Oracle database password */
  readonly ORACLE_DB_PASSWORD: string;
}

export const validateInput = (
  event: APIGatewayProxyEvent | Record<string, unknown>,
): ValidationResult => {
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event;
  const { ssn, zip } = body;

  if (!ssn || !zip) {
    return { valid: false, error: "Both ssn and zip are required" };
  }

  const sanitizedSsn = String(ssn).replace(/-/g, "");
  if (!/^\d{9}$/.test(sanitizedSsn)) {
    return { valid: false, error: "SSN must be 9 digits" };
  }

  const sanitizedZip = String(zip);
  if (!/^\d{5}$/.test(sanitizedZip)) {
    return { valid: false, error: "ZIP must be 5 digits" };
  }

  return { valid: true, ssn: sanitizedSsn, zip: sanitizedZip };
};

const mapRowToRecord = (row: InquiryRow): ResponseRecord => ({
  return_year: String(row.RETURN_YEAR_DTE),
  application_date: row.RNY_APPLIED_DTE,
});

const buildResponse = (rows: InquiryRow[]): BuildResponseResult => {
  if (!rows || rows.length === 0) {
    return { records: [] };
  }

  const records = rows.map(mapRowToRecord);

  return { records };
};

const getCreds = async (): Promise<DatabaseCredentials> => {
  const secretName = process.env.DB_CREDS_SECRET_NAME;
  if (!secretName) {
    throw new Error("SECRET_NAME environment variable is not set");
  }

  const client = new SecretsManagerClient({
    region: "us-east-1",
  });

  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: secretName,
      VersionStage: "AWSCURRENT",
    }),
  );

  return JSON.parse(response.SecretString!) as DatabaseCredentials;
};

export const handler = async (
  event: APIGatewayProxyEvent | Record<string, unknown>,
): Promise<APIGatewayProxyResult> => {
  const validation = validateInput(event);
  if (!validation.valid) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: validation.error }),
    };
  }

  let connection;
  try {
    const creds = await getCreds();
    connection = await oracledb.getConnection({
      user: creds.ORACLE_DB_USER,
      password: creds.ORACLE_DB_PASSWORD,
      connectString: process.env.CONNECT_STRING,
      configDir: "/var/task/config",
    });

    const result = await connection.execute(
      INQUIRY_QUERY,
      { ssn: validation.ssn, zip: validation.zip },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    const responseBody = buildResponse(result.rows as InquiryRow[]);

    return {
      statusCode: 200,
      body: JSON.stringify(responseBody),
    };
  } catch (err) {
    const error = err as Error;
    console.error("Query execution failed", {
      error: error.message,
      stack: error.stack,
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        const error = err as Error;
        console.error("Failed to close connection", { error: error.message });
      }
    }
  }
};
