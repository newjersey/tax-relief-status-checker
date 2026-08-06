import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

import { handler, computeSsnZipHash } from "./index.ts";

const dynamoMock = mockClient(DynamoDBClient);

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

    const result = await handler({ ssn: "123456789", zip: "07001" });

    expect(result).toEqual({ autofilePlanned: true });
  });

  it("returns autofilePlanned false when item does not exist", async () => {
    dynamoMock.on(GetItemCommand).resolves({
      Item: undefined,
    });

    const result = await handler({ ssn: "123456789", zip: "07001" });

    expect(result).toEqual({ autofilePlanned: false });
  });

  it("returns error for missing ssn", async () => {
    const result = await handler({ zip: "07001" });

    expect(result).toEqual({ error: "Request must include ssn (9 digits) and zip (5 digits)" });
  });

  it("returns error for invalid ssn format", async () => {
    const result = await handler({ ssn: "12345", zip: "07001" });

    expect(result).toEqual({ error: "Request must include ssn (9 digits) and zip (5 digits)" });
  });

  it("returns error for invalid zip format", async () => {
    const result = await handler({ ssn: "123456789", zip: "123" });

    expect(result).toEqual({ error: "Request must include ssn (9 digits) and zip (5 digits)" });
  });

  it("returns error for null event", async () => {
    const result = await handler(null);

    expect(result).toEqual({ error: "Request must include ssn (9 digits) and zip (5 digits)" });
  });

  it("throws when TABLE_NAME is not configured", async () => {
    vi.stubEnv("TABLE_NAME", "");

    await expect(handler({ ssn: "123456789", zip: "07001" })).rejects.toThrow(
      "TABLE_NAME environment variable is not configured",
    );
  });

  it("queries DynamoDB with the correct hash key", async () => {
    dynamoMock.on(GetItemCommand).resolves({ Item: undefined });

    await handler({ ssn: "123456789", zip: "07001" });

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
