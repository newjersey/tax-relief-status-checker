import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import oracledb from "oracledb";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Transaction, InquiryRow } from "./types";
import { buildAllTransactions } from "./transaction";
import { createMetricsLogger, StorageResolution, Unit } from "aws-embedded-metrics";
import { isRecordValid, validateInput } from "./validation";

/** SQL query to look up filer records by SSN and ZIP */
const INQUIRY_QUERY = `SELECT * FROM ELF_SAVER_INQUIRY
  WHERE SOCIAL_SECURITY_NUMBER_IDN = :ssn AND ZIP_ADR = :zip AND RETURN_YEAR_DTE = 2025`;

/** CloudWatch namespace under which all custom metrics emitted by this API are published. */
const METRICS_NAMESPACE = "TaxReliefStatusApi";

/** Name of the metric that counts one API response per invocation, dimensioned by HTTP status code. */
const RESPONSE_COUNT_METRIC_NAME = "ResponseCount";

const metrics = createMetricsLogger();

/** The form filed by the taxpayer for property tax relief */
enum FormCode {
  ANC1 = "ANC-1",
  PAS1 = "PAS-1",
}

interface ResponseRecord {
  readonly return_year: string;
  readonly application_date: string;
  readonly form_code: FormCode | null;
  readonly anchor: Transaction[];
  readonly ptr: Transaction[];
  readonly stay_nj: Transaction[];
}

interface BuildResponseResult {
  readonly records: ResponseRecord[];
}

/** Database credentials retrieved from Secrets Manager */
interface DatabaseCredentials {
  /** Oracle database username */
  readonly ORACLE_DB_USER: string;
  /** Oracle database password */
  readonly ORACLE_DB_PASSWORD: string;
}

export const logStatusCode = async (statusCode: string): Promise<void> => {
  metrics.setNamespace(METRICS_NAMESPACE);
  metrics.resetDimensions(false);
  metrics.putDimensions({ StatusCode: `${statusCode}` });
  metrics.putMetric(RESPONSE_COUNT_METRIC_NAME, 1, Unit.Count, StorageResolution.Standard);
  await metrics.flush();
};

const mapRowToRecord = (row: InquiryRow): ResponseRecord => {
  const allTransactions = buildAllTransactions(row);
  return {
    return_year: String(row.RETURN_YEAR_DTE),
    application_date: row.RNY_APPLIED_DTE,
    form_code: mapFormCode(row.FORM_CDE),
    anchor: allTransactions.anchor,
    ptr: allTransactions.ptr,
    stay_nj: allTransactions.stay_nj,
  };
};

const mapFormCode = (dbFormCode: string): FormCode | null => {
  switch (dbFormCode) {
    case "PAS1W":
      return FormCode.PAS1;
    case "PAS1D":
      return FormCode.PAS1;
    case "PAS1P":
      return FormCode.PAS1;
    case "ANC1W":
      return FormCode.ANC1;
    case "ANC1D":
      return FormCode.ANC1;
    case "ANC1P":
      return FormCode.ANC1;
    default:
      console.log(`Unknown FORM_CDE: ${dbFormCode}`);
      return null;
  }
};

const buildResponse = (rows: InquiryRow[]): BuildResponseResult => {
  if (!rows || rows.length === 0) {
    return { records: [] };
  }
  const validRows = rows.filter((row) => isRecordValid(row));

  console.log(`DLN_NUM: ${validRows[0].DLN_NUM}`);
  const records = validRows.map(mapRowToRecord);

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
  const validated = validateInput(event);

  if (!validated.success) {
    await logStatusCode("400");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: validated.error.message }),
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
      { ssn: validated.data.ssn, zip: validated.data.zip },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    const responseBody = buildResponse(result.rows as InquiryRow[]);

    await logStatusCode("200");
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
    await logStatusCode("500");
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
