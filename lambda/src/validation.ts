import * as z from "zod";
import { InquiryRow, TransactionInfo } from "./types";
import { APIGatewayProxyEvent } from "aws-lambda";

export const isRecordValid = (row: InquiryRow) => {
  const validatedRecord = RecordSchema.safeParse(row);
  if (!validatedRecord.success) {
    console.log(validatedRecord.error.issues);
  }
  return validatedRecord.success;
};

export const validateInput = (event: APIGatewayProxyEvent | Record<string, unknown>) => {
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event;
  const { ssn, zip } = body;

  return InputSchema.safeParse({ ssn: ssn, zip: zip });
};

export const validateTransaction = (transactionInfo: TransactionInfo) => {
  return TransactionSchema.safeParse(transactionInfo);
};

const RecordSchema = z.object({
  DLN_NUM: z.string("DLN_NUM is required"),
  SOCIAL_SECURITY_NUMBER_IDN: z.string("SOCIAL_SECURITY_NUMBER_IDN is required"),
  ZIP_ADR: z.string("ZIP_ADR is required"),
  RETURN_YEAR_DTE: z.number("RETURN_YEAR_DTE is required"),
  RNY_APPLIED_DTE: z.string("RNY_APPLIED_DTE is required"),
  TRANS_TOTAL_NUM: z.number("TRANS_TOTAL_NUM is required"),
  FORM_CDE: z
    .enum(["PAS1W", "PAS1D", "PAS1P", "ANC1W", "ANC1D", "ANC1P"], "FORM_CDE is invalid")
    .nullable(),
});

const InputSchema = z.object({
  ssn: z
    .string("Both ssn and zip are required")
    .nonempty("Social Security number is required")
    .transform((input, ctx) => {
      try {
        const sanitizedSsn = String(input).replace(/-/g, "");
        if (/^\d{9}$/.test(sanitizedSsn)) {
          return sanitizedSsn;
        } else {
          ctx.issues.push({
            code: "custom",
            message: "SSN must be 9 digits",
            input: input,
          });
        }
      } catch {
        return false;
      }
    }),
  zip: z
    .string("Both ssn and zip are required")
    .nonempty("Zip Code is required")
    .regex(/^\d{5}$/, "ZIP must be 5 digits"),
});

const TransactionSchema = z
  .object({
    TRANS_CDE: z.enum(["RR", "RF"], "TRANS_CDE is invalid"),
    TRANS_STATUS_CDE: z.string().nullable(),
    CHECK_DTE: z.string().nullable(),
    CHECK_AMT: z.number().nullable(),
    CHECK_NUM: z.string().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.TRANS_CDE.startsWith("RF")) {
      if (data.CHECK_DTE === null) {
        ctx.addIssue({
          code: "custom",
          message: "CHECK_DTE is required when TRANS_CDE is RF",
        });
      }
      if (data.CHECK_AMT === null) {
        ctx.addIssue({
          code: "custom",
          message: "CHECK_AMT is required when TRANS_CDE is RF",
        });
      }
      if (data.CHECK_NUM === null) {
        ctx.addIssue({
          code: "custom",
          message: "CHECK_NUM is required when TRANS_CDE is RF",
        });
      }
      if (data.TRANS_STATUS_CDE === null) {
        ctx.addIssue({
          code: "custom",
          message: "TRANS_STATUS_CDE is required when TRANS_CDE is RF",
        });
        return;
      }
      if (!/^(AP|PR)/.test(data.TRANS_STATUS_CDE)) {
        ctx.addIssue({ code: "custom", message: "TRANS_STATUS_CDE must start with AP or PR" });
      }
    }
  });
