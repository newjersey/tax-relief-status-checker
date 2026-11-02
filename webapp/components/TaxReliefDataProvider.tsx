"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FormCode, IssueFlaggedType, Transaction } from "./types";

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
  readonly applicationDateString: string;
  readonly form_code: FormCode | null;
  readonly issueFlagged?: IssueFlaggedType;
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

  const setCurrentYear = useCallback((year: CurrentYear) => {
    setDataStore((prev) =>
      prev?.type === DataType.STATUS ? { ...prev, currentYear: year } : prev,
    );
  }, []);

  //so cypress see setCurrentYear
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

export const useDataStore = () => {
  const context = useContext(TaxReliefDataContext);
  if (!context) {
    throw new Error("useDataStore must be used within a TaxReliefDataContext");
  }
  return context;
};
