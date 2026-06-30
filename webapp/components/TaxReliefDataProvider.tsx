"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface TaxReliefStatusData {
  readonly lastFourSsnDigits: string;
  readonly zipCode: string;
  readonly applicationDate: string;
}

const TaxReliefData = createContext<{
  dataStore: TaxReliefStatusData | null;
  setDataStore: (data: TaxReliefStatusData | null) => void;
} | null>(null);

export const TaxReliefDataProvider = ({ children }: { children: ReactNode }) => {
  const [dataStore, setDataStore] = useState<TaxReliefStatusData | null>(null);

  return (
    <TaxReliefData.Provider value={{ dataStore, setDataStore }}>{children}</TaxReliefData.Provider>
  );
};

export const useDataStore = () => {
  const context = useContext(TaxReliefData);
  if (!context) {
    throw new Error("useDataStore must be used within a TaxReliefDataProvider");
  }
  return context;
};
