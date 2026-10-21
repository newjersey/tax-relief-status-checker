import { Sha256 } from "@aws-crypto/sha256-js";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { IHttpRequest, HttpRequest } from "@smithy/protocol-http";
import { SignatureV4 } from "@smithy/signature-v4";

/** Signs an outgoing HTTP request with AWS SigV4 so AWS_IAM auth can work. */
export const signRequest = async (config: {
  readonly url: string;
  readonly body: string;
}): Promise<IHttpRequest> => {
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

  return await signer.sign(request);
};
