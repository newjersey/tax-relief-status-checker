"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { Transaction } from "./types";

export interface TaxReliefStatusData {
  readonly lastFourSsnDigits: string;
  readonly zipCode: string;
  readonly applicationDateString: string;
  readonly anchor: Transaction[];
  readonly ptr: Transaction[];
  readonly stay_nj: Transaction[];
}

const TaxReliefDataContext = createContext<{
  dataStore: TaxReliefStatusData | null;
  setDataStore: (data: TaxReliefStatusData | null) => void;
} | null>(null);

export const TaxReliefDataProvider = ({ children }: { children: ReactNode }) => {
  const [dataStore, setDataStore] = useState<TaxReliefStatusData | null>(null);

  return (
    <TaxReliefDataContext value={{ dataStore, setDataStore }}>{children}</TaxReliefDataContext>
  );
};

export const useDataStore = () => {
  const context = useContext(TaxReliefDataContext);
  if (!context) {
    throw new Error("useDataStore must be used within a TaxReliefDataContext");
  }
  return context;
};
