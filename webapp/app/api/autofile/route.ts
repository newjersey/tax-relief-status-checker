import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { HttpRequest } from "@smithy/protocol-http";

interface StatusRequestBody {
  readonly ssn: string;
  readonly zip: string;
}

/** Signs an outgoing HTTP request with AWS SigV4 so AWS_IAM auth can work. */
const signRequest = async (config: {
  readonly url: string;
  readonly body: string;
}): Promise<HttpRequest> => {
  const parsedUrl = new URL(config.url);

  const request = new HttpRequest({
    method: "POST",
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname,
    headers: {
      "Content-Type": "application/json",
      host: parsedUrl.hostname,
    },
    body: config.body,
  });

  const signer = new SignatureV4({
    service: "lambda",
    region: "us-east-1",
    credentials: defaultProvider(),
    sha256: Sha256,
  });

  return (await signer.sign(request)) as HttpRequest;
};

/**
 * POST /api/status
 *
 * Proxies the SSN + ZIP lookup to the AWS Lambda endpoint configured via
 * NEXT_PUBLIC_AUTOFILE_LAMBDA_API_URL. Signs the request with SigV4 for AWS_IAM authentication on
 * the Lambda Function URL.
 */
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const lambdaUrl = process.env.NEXT_PUBLIC_AUTOFILE_LAMBDA_API_URL;

  if (!lambdaUrl) {
    return NextResponse.json({ error: "Autofile API is not configured." }, { status: 503 });
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
  } catch {
    return NextResponse.json(
      { error: "Failed to reach the autofile check service." },
      { status: 502 },
    );
  }
};
