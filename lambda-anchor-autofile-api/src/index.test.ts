import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

import type { APIGatewayProxyEventV2 } from "aws-lambda";

import { handler, computeSsnZipHash } from "./index.ts";

const dynamoMock = mockClient(DynamoDBClient);

const buildEvent = (body: Record<string, unknown>): APIGatewayProxyEventV2 =>
  ({ body: JSON.stringify(body) }) as unknown as APIGatewayProxyEventV2;

describe("handler", () => {
  beforeEach(() => {
    vi.stubEnv("TABLE_NAME", "test-table");
    dynamoMock.reset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns autofilePlanned true when item exists", async () => {
    dynamoMock.on(GetItemCommand).resolves({
      Item: { ssnZipHash: { S: "abc123" } },
    });

    const result = await handler(buildEvent({ ssn: "123456789", zip: "07001" }));

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body as string)).toEqual({ autofilePlanned: true });
  });

  it("returns autofilePlanned false when item does not exist", async () => {
    dynamoMock.on(GetItemCommand).resolves({
      Item: undefined,
    });

    const result = await handler(buildEvent({ ssn: "123456789", zip: "07001" }));

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body as string)).toEqual({ autofilePlanned: false });
  });

  it("returns 400 for missing ssn", async () => {
    const result = await handler(buildEvent({ zip: "07001" }));

    expect(result.statusCode).toBe(400);
  });

  it("returns 400 for invalid ssn format", async () => {
    const result = await handler(buildEvent({ ssn: "12345", zip: "07001" }));

    expect(result.statusCode).toBe(400);
  });

  it("returns 400 for invalid zip format", async () => {
    const result = await handler(buildEvent({ ssn: "123456789", zip: "123" }));

    expect(result.statusCode).toBe(400);
  });

  it("returns 400 for missing body", async () => {
    const event = { body: undefined } as unknown as APIGatewayProxyEventV2;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
  });

  it("queries DynamoDB with the correct hash key", async () => {
    dynamoMock.on(GetItemCommand).resolves({ Item: undefined });

    await handler(buildEvent({ ssn: "123456789", zip: "07001" }));

    const expectedHash = computeSsnZipHash("123456789", "07001");
    const call = dynamoMock.commandCalls(GetItemCommand)[0];
    expect(call.args[0].input.Key).toEqual({ ssnZipHash: { S: expectedHash } });
    expect(call.args[0].input.TableName).toBe("test-table");
  });
});

describe("computeSsnZipHash", () => {
  it("produces a consistent hex hash", () => {
    const hash1 = computeSsnZipHash("123456789", "07001");
    const hash2 = computeSsnZipHash("123456789", "07001");

    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[a-f0-9]{64}$/);
  });

  it("produces different hashes for different inputs", () => {
    const hash1 = computeSsnZipHash("123456789", "07001");
    const hash2 = computeSsnZipHash("987654321", "07001");

    expect(hash1).not.toBe(hash2);
  });
});
