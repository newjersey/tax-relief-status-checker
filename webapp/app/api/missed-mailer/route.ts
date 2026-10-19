import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { signRequest } from "../utils/signRequest";

interface StatusRequestBody {
  readonly ssn: string;
  readonly zip: string;
}

/**
 * POST /api/status
 *
 * Proxies the SSN + ZIP lookup to the AWS Lambda endpoint configured via
 * NEXT_PUBLIC_MISSED_MAILER_LAMBDA_API_URL. Signs the request with SigV4 for AWS_IAM authentication
 * on the Lambda Function URL.
 */
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const lambdaUrl = process.env.NEXT_PUBLIC_MISSED_MAILER_LAMBDA_API_URL;

  if (!lambdaUrl) {
    return NextResponse.json({ error: "Missed Mailer API is not configured." }, { status: 503 });
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
    const payload = JSON.stringify({ ssn: body.ssn, zip: body.zip });
    const signed = await signRequest({ url: lambdaUrl, body: payload });

    const lambdaResponse = await fetch(lambdaUrl, {
      method: signed.method,
      headers: signed.headers,
      body: signed.body,
    });

    const lambdaBody: unknown = await lambdaResponse.json();

    return NextResponse.json(lambdaBody, { status: lambdaResponse.status });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 502 });
  }
};
