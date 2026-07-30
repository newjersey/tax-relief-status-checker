import { describe, it, expect } from "vitest";

import type { StatusRecord } from "../page";
import { setIssueFlagged } from "./setIssueFlagged";
import { TransactionStatus, Transaction, IssueFlaggedType } from "@/components/types";

const buildRecord = (overrides: Partial<StatusRecord> = {}): StatusRecord => ({
  return_year: "2024",
  application_date: "2024-01-01",
  anchor: [],
  ptr: [],
  stay_nj: [],
  ...overrides,
});

const buildTransaction = (status: TransactionStatus, reviewCategory?: string): Transaction => ({
  status,
  review_category: reviewCategory,
});

const ptrWithSVR = [buildTransaction(TransactionStatus.ISSUE_FLAGGED, "SVR")];

const anchorWith = (category: string): Transaction[] => [
  buildTransaction(TransactionStatus.ISSUE_FLAGGED, category),
];

interface TestCase {
  readonly description: string;
  readonly record: StatusRecord;
  readonly expected: IssueFlaggedType | undefined;
}

const testCases: readonly TestCase[] = [
  {
    description: "returns PROPERTY_TAX_BILL_NEEDED when ptr has SVR and anchor has MOD",
    record: buildRecord({ ptr: ptrWithSVR, anchor: anchorWith("MOD") }),
    expected: IssueFlaggedType.PROPERTY_TAX_BILL_NEEDED,
  },
  {
    description: "returns PROPERTY_TAX_BILL_NEEDED when ptr has SVR and anchor has MDZ",
    record: buildRecord({ ptr: ptrWithSVR, anchor: anchorWith("MDZ") }),
    expected: IssueFlaggedType.PROPERTY_TAX_BILL_NEEDED,
  },
  {
    description: "returns CONTACT_TAXATION when ptr has SVR and anchor has MAX",
    record: buildRecord({ ptr: ptrWithSVR, anchor: anchorWith("MAX") }),
    expected: IssueFlaggedType.CONTACT_TAXATION,
  },
  {
    description: "returns CONTACT_TAXATION when ptr has SVR and anchor has MHX",
    record: buildRecord({ ptr: ptrWithSVR, anchor: anchorWith("MHX") }),
    expected: IssueFlaggedType.CONTACT_TAXATION,
  },
  {
    description: "returns CONTACT_TAXATION when ptr has SVR and anchor has PCT",
    record: buildRecord({ ptr: ptrWithSVR, anchor: anchorWith("PCT") }),
    expected: IssueFlaggedType.CONTACT_TAXATION,
  },
  {
    description: "returns CONTACT_TAXATION when ptr has SVR and anchor has DSU",
    record: buildRecord({ ptr: ptrWithSVR, anchor: anchorWith("DSU") }),
    expected: IssueFlaggedType.CONTACT_TAXATION,
  },
  {
    description: "returns CONTACT_TAXATION when ptr has SVR and anchor has DSO",
    record: buildRecord({ ptr: ptrWithSVR, anchor: anchorWith("DSO") }),
    expected: IssueFlaggedType.CONTACT_TAXATION,
  },
  {
    description: "returns undefined when ptr does not have issue_flagged status",
    record: buildRecord({
      ptr: [buildTransaction(TransactionStatus.PAYMENT_SENT)] as unknown as [],
      anchor: anchorWith("MOD"),
    }),
    expected: undefined,
  },
  {
    description: "returns undefined when ptr has SVR but anchor has unrecognized review category",
    record: buildRecord({ ptr: ptrWithSVR, anchor: anchorWith("XYZ") }),
    expected: undefined,
  },
  {
    description: "returns undefined when both ptr and anchor are empty",
    record: buildRecord(),
    expected: undefined,
  },
];

describe("setIssueFlagged", () => {
  testCases.forEach(({ description, record, expected }) => {
    it(description, () => {
      const result = setIssueFlagged(record);
      expect(result).toBe(expected);
    });
  });
});
