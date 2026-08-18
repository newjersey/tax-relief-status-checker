import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

vi.mock("@aws-sdk/signature-v4", () => ({
  SignatureV4: class {
    sign = vi.fn().mockResolvedValue({
      method: "POST",
      headers: { "Content-Type": "application/json", host: "lambda.example.com" },
      body: JSON.stringify({ ssn: "123456789", zip: "12345" }),
    });
  },
}));

vi.mock("@aws-crypto/sha256-js", () => ({ Sha256: class {} }));

const createRequest = (body: unknown): NextRequest =>
  new NextRequest("http://localhost/api/autofile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("POST /api/autofile", () => {
  it("returns 400 when ssn is missing", async () => {
    process.env.NEXT_PUBLIC_AUTOFILE_LAMBDA_API_URL = "https://lambda.example.com/invoke";

    const response = await POST(createRequest({ ssn: "", zip: "12345" }));

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBe("Both ssn and zip are required.");
  });

  it("returns 400 when zip is missing", async () => {
    process.env.NEXT_PUBLIC_AUTOFILE_LAMBDA_API_URL = "https://lambda.example.com/invoke";

    const response = await POST(createRequest({ ssn: "123456789", zip: "" }));

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBe("Both ssn and zip are required.");
  });

  it("proxies a successful lambda response", async () => {
    process.env.NEXT_PUBLIC_AUTOFILE_LAMBDA_API_URL = "https://lambda.example.com/invoke";

    const lambdaBody = { status: "filed", date: "2026-01-01" };
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(lambdaBody),
    }) as unknown as typeof fetch;

    const response = await POST(createRequest({ ssn: "123456789", zip: "12345" }));

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual(lambdaBody);
  });

  it("forwards the lambda status code for non-200 responses", async () => {
    process.env.NEXT_PUBLIC_AUTOFILE_LAMBDA_API_URL = "https://lambda.example.com/invoke";

    const lambdaBody = { error: "Not found" };
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 404,
      json: () => Promise.resolve(lambdaBody),
    }) as unknown as typeof fetch;

    const response = await POST(createRequest({ ssn: "123456789", zip: "12345" }));

    expect(response.status).toBe(404);
    const json = await response.json();
    expect(json).toEqual(lambdaBody);
  });
});
