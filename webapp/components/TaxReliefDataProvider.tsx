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

/**
 * Whether the stored data cannot back any results page: nothing is stored, or status data has no
 * record for the selected year. Missed-mailer data never has a status record but is still valid.
 */
const isMissingResultsData = (
  dataStore: TaxReliefStatusData | null,
  record: YearRecord | null,
): boolean => !dataStore || (dataStore.type === DataType.STATUS && !record);

export const useDataStore = () => {
  const context = useContext(TaxReliefDataContext);
  const dataStore = context?.dataStore ?? null;
  const router = useRouter();
  const pathname = usePathname();
  const record =
    dataStore?.type === DataType.STATUS ? (dataStore.records[dataStore.currentYear] ?? null) : null;
  const shouldRedirectHome = pathname !== "/" && isMissingResultsData(dataStore, record);

  useEffect(() => {
    if (shouldRedirectHome) {
      router.replace("/");
    }
  }, [shouldRedirectHome, router]);

  if (!context) {
    throw new Error("useDataStore must be used within a TaxReliefDataContext");
  }
  return { ...context, record };
};
