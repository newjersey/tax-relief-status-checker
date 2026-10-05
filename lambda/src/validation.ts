import * as z from "zod";
import { APIGatewayProxyEvent } from "aws-lambda";

export const validateInput = (event: APIGatewayProxyEvent | Record<string, unknown>) => {
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event;
  const { ssn, zip } = body;

  return InputSchema.safeParse({ ssn: ssn, zip: zip });
};

export const InquiryRowSchema = z
  .object({
    DLN_NUM: z.string("DLN_NUM is required"),
    SOCIAL_SECURITY_NUMBER_IDN: z.string("SOCIAL_SECURITY_NUMBER_IDN is required"),
    ZIP_ADR: z.string("ZIP_ADR is required"),
    RETURN_YEAR_DTE: z.string("RETURN_YEAR_DTE is required"),
    RNY_APPLIED_DTE: z.date("RNY_APPLIED_DTE is required"),
    TRANS_TOTAL_NUM: z.number("TRANS_TOTAL_NUM is required"),
    FORM_CDE: z.string().nullable(),
  })
  .readonly();

export const InputSchema = z.preprocess(
  (input: any) => {
    // Handle API Gateway proxy format
    if (input && typeof input === "object" && "body" in input) {
      const body = typeof input.body === "string" ? JSON.parse(input.body) : input.body;
      return body;
    }
    return input;
  },
  z.object({
    ssn: z
      .string("SSN is required")
      .transform((input) => String(input).replace(/-/g, ""))
      .refine((ssn) => /^(?!000)(?!666)(?!9\d{2})\d{3}(?!00)\d{2}(?!0000)\d{4}$/.test(ssn), {
        message: "SSN is invalid",
      }),
    zip: z.string("ZIP is required").regex(/^\d{5}$/, "ZIP must be 5 digits"),
  }),
);

export const TransactionSchema = z.discriminatedUnion("TRANS_CDE", [
  z
    .object({
      TRANS_CDE: z.literal("RR"),
      TRANS_STATUS_CDE: z.string().nullable(),
      CHECK_DTE: z.date().nullable(),
      CHECK_AMT: z.number().nullable(),
      CHECK_NUM: z.string().nullable(),
    })
    .readonly(),
  z
    .object({
      TRANS_CDE: z.literal("RF"),
      TRANS_STATUS_CDE: z.string().min(1), // non-empty string
      CHECK_DTE: z.date(),
      CHECK_AMT: z.number(),
      CHECK_NUM: z.string().min(1),
    })
    .superRefine((data, ctx) => {
      if (!/^(AP|PR)/.test(data.TRANS_STATUS_CDE)) {
        ctx.addIssue({ code: "custom", message: "TRANS_STATUS_CDE must start with AP or PR" });
      }
    })
    .readonly(),
]);
