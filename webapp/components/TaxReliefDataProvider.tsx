"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FormCode, IssueFlaggedType, Transaction } from "./types";
import { usePathname, useRouter } from "next/navigation";

export enum DataType {
  MISSED_MAILER,
  STATUS,
}

export enum CurrentYear {
  YEAR2024 = "2024",
  YEAR2025 = "2025",
}

export interface StatusData {
  readonly currentYear: CurrentYear;
  readonly type: DataType.STATUS;
  readonly lastFourSsnDigits: string;
  readonly zipCode: string;
  readonly records: Readonly<Partial<Record<CurrentYear, YearRecord>>>;
}

export interface YearRecord {
  readonly return_year: string;
  readonly application_date: string;
  readonly form_code: FormCode | null;
  issueFlagged?: IssueFlaggedType;
  readonly anchor: Transaction[];
  readonly ptr: Transaction[];
  readonly stay_nj: Transaction[];
}

export interface MissedMailerData {
  readonly type: DataType.MISSED_MAILER;
  readonly lastFourSsnDigits: string;
  readonly zipCode: string;
}

export type TaxReliefStatusData = MissedMailerData | StatusData;

const TaxReliefDataContext = createContext<{
  dataStore: TaxReliefStatusData | null;
  setDataStore: (data: TaxReliefStatusData | null) => void;
  setCurrentYear: (year: CurrentYear) => void;
} | null>(null);

export const TaxReliefDataProvider = ({ children }: { children: ReactNode }) => {
  const [dataStore, setDataStore] = useState<TaxReliefStatusData | null>(null);

  const setCurrentYear = (year: CurrentYear) => {
    setDataStore((prev) =>
      prev?.type === DataType.STATUS ? { ...prev, currentYear: year } : prev,
    );
  };

  //so cypress can see setCurrentYear, will be removed once year navigator is added
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Cypress) {
      (window as any).__setCurrentYear = setCurrentYear;
    }
  }, [setCurrentYear]);

  return (
    <TaxReliefDataContext value={{ dataStore, setDataStore, setCurrentYear }}>
      {children}
    </TaxReliefDataContext>
  );
};

/** Route that renders missed-mailer data instead of a status record. */
const MISSED_MAILER_PATH = "/missed-mailer";

/** Inputs used to decide whether the current page lacks the data it needs to render. */
export interface RedirectHomeCheck {
  /** Current route pathname, e.g. "/" or "/payment-info". */
  readonly pathname: string;
  /** Data currently held in the store, or null when nothing has been looked up yet. */
  readonly dataStore: TaxReliefStatusData | null;
  /** Status record for the selected year, or null when there is none. */
  readonly record: YearRecord | null;
}

/**
 * Returns true when the user is on a results page that has no data to show and should be sent back
 * to the landing page. The missed-mailer page is backed by missed-mailer data rather than a status
 * record, so it is exempt when that data is present.
 */
export const shouldRedirectHome = ({ pathname, dataStore, record }: RedirectHomeCheck) => {
  if (pathname === "/" || record) return false;
  return !(pathname === MISSED_MAILER_PATH && dataStore?.type === DataType.MISSED_MAILER);
};

export const useDataStore = () => {
  const context = useContext(TaxReliefDataContext);
  const dataStore = context?.dataStore ?? null;
  const router = useRouter();
  const pathname = usePathname();
  const record =
    dataStore?.type === DataType.STATUS ? (dataStore.records[dataStore.currentYear] ?? null) : null;

  useEffect(() => {
    if (shouldRedirectHome({ pathname, dataStore, record })) {
      router.replace("/");
    }
  }, [pathname, dataStore, record, router]);

  if (!context) {
    throw new Error("useDataStore must be used within a TaxReliefDataContext");
  }
  return { ...context, record };
};
