"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface TaxReliefStatusData {
  readonly lastFourSsnDigits: string;
  readonly zipCode: string;
  readonly applicationDateString: string;
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
