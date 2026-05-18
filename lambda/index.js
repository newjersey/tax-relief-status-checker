const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const oracledb = require("oracledb");

const INQUIRY_QUERY = `SELECT * FROM ELF_SAVER_INQUIRY
  WHERE SOCIAL_SECURITY_NUMBER_IDN = :ssn AND ZIP_ADR = :zip`;

/** Maximum number of transaction slots per row in ELF_SAVER_INQUIRY */
const MAX_TRANSACTION_SLOTS = 6;

/** Maps TRANS_X_TAX_CDE values to response category names */
const TAX_CODE_CATEGORY_MAP = {
  13: "anchor",
  49: "ptr",
  41: "stayNj",
};

const validateInput = (event) => {
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

const extractTransactions = (row) => {
  const transactions = [];

  for (let i = 1; i <= MAX_TRANSACTION_SLOTS; i++) {
    const transCode = row[`TRANS_${i}_CDE`];
    const taxCode = row[`TRANS_${i}_TAX_CDE`];

    if (!transCode && !taxCode) continue;

    transactions.push({
      returnYear: row.RETURN_YEAR_DTE,
      TransCode: transCode || "",
      StatusCode: row[`TRANS_STATUS_${i}_CDE`] || "",
      ReviewCategory: row[`REVIEW_CATEGORY_${i}_CDE`] || "",
      checkDate: row[`CHECK_${i}_DTE`] || "",
      checkAmount: row[`CHECK_${i}_AMT`] || "",
      checkNumber: row[`CHECK_${i}_NUM`] || "",
      taxCode: taxCode,
    });
  }

  return transactions;
};

const categorizeTransactions = (transactions) => {
  const categorized = { anchor: [], ptr: [], stayNj: [] };

  for (const transaction of transactions) {
    const category = TAX_CODE_CATEGORY_MAP[String(transaction.taxCode)];
    if (!category) continue;

    const { taxCode, ...transactionData } = transaction;
    categorized[category].push(transactionData);
  }

  return categorized;
};

const buildResponse = (rows) => {
  if (!rows || rows.length === 0) {
    return { filer: {} };
  }

  const firstRow = rows[0];
  const filer = {
    name: firstRow.OWNER_NME || "",
    streetAddress: firstRow.STREET_1_ADR || "",
    city: firstRow.CITY_ADR || "",
    state: firstRow.STATE_ADR || "",
    zip: firstRow.ZIP_ADR || "",
  };

  const rowsByYear = {};
  for (const row of rows) {
    const year = String(row.RETURN_YEAR_DTE);
    if (!rowsByYear[year]) {
      rowsByYear[year] = [];
    }
    rowsByYear[year].push(row);
  }

  const response = { filer };

  for (const [year, yearRows] of Object.entries(rowsByYear)) {
    const allTransactions = yearRows.flatMap(extractTransactions);
    response[year] = categorizeTransactions(allTransactions);
  }

  return response;
};

const getCreds = async () => {
  const secret_name = process.env.DB_CREDS_SECRET_NAME;
  if (!secret_name) {
    throw new Error("SECRET_NAME environment variable is not set");
  }

  const client = new SecretsManagerClient({
    region: "us-east-1",
  });

  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: secret_name,
      VersionStage: "AWSCURRENT",
    }),
  );

  return JSON.parse(response.SecretString);
};

module.exports.handler = async (event) => {
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

    const responseBody = buildResponse(result.rows);

    return {
      statusCode: 200,
      body: JSON.stringify(responseBody),
    };
  } catch (err) {
    console.error("Query execution failed", { error: err.message, stack: err.stack });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Failed to close connection", { error: err.message });
      }
    }
  }
};
