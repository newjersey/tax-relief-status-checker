import * as z from "zod";
import { InquiryRow } from "./types";

export const isRecordValid = (row: InquiryRow) => {
  const validatedRecord = RecordSchema.safeParse(row);
  if (!validatedRecord.success) {
    console.log(validatedRecord.error.issues);
  }

  return validatedRecord.success;
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
    .string()
    .nonempty("Social Security number is required")
    .refine(
      (input) => {
        try {
          const sanitizedSsn = String(input).replace(/-/g, "");
          return /^\d{9}$/.test(sanitizedSsn);
        } catch {
          return false;
        }
      },
      { message: "SSN must be 9 digits" },
    ),
  zip: z
    .string()
    .nonempty("Zip Code is required")
    .regex(/^\d{9}$/, "ZIP must be 5 digits"),
});
