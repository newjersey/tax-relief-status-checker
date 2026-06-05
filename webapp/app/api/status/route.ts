import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Shape of the expected request body from the client. */
interface StatusRequestBody {
  /** Social Security Number in ###-##-#### format. */
  readonly ssn?: string;
  /** Five-digit ZIP code. */
  readonly zip?: string;
}

/**
 * POST /api/status
 *
 * Proxies the SSN + ZIP lookup to the AWS Lambda endpoint configured via LAMBDA_API_URL. Returns
 * the Lambda response JSON containing application records.
 */
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const lambdaUrl = process.env.LAMBDA_API_URL;

  if (!lambdaUrl) {
    return NextResponse.json({ error: "Status API is not configured." }, { status: 503 });
  }

  let body: StatusRequestBody;
  try {
    body = (await request.json()) as StatusRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.ssn || !body.zip) {
    return NextResponse.json({ error: "Both ssn and zip are required." }, { status: 400 });
  }

  try {
    const lambdaResponse = await fetch(lambdaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ssn: body.ssn, zip: body.zip }),
    });

    const lambdaBody: unknown = await lambdaResponse.json();

    return NextResponse.json(lambdaBody, { status: lambdaResponse.status });
  } catch {
    return NextResponse.json({ error: "Failed to reach the status service." }, { status: 502 });
  }
};
