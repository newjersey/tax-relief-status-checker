"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface TaxReliefStatusData {
  readonly lastFourSsnDigits: string;
  readonly zipCode: string;
  readonly applicationDate: string;
}

const TaxReliefStatusContext = createContext<{
  dataStore: TaxReliefStatusData | null;
  setDataStore: (data: TaxReliefStatusData | null) => void;
} | null>(null);

export const TaxReliefStatusProvider = ({ children }: { children: ReactNode }) => {
  const [dataStore, setDataStore] = useState<TaxReliefStatusData | null>(null);

  return (
    <TaxReliefStatusContext.Provider value={{ dataStore, setDataStore }}>
      {children}
    </TaxReliefStatusContext.Provider>
  );
};

export const useDataStore = () => {
  const context = useContext(TaxReliefStatusContext);
  if (!context) {
    throw new Error("useStatusData must be used within a StatusProvider");
  }
  return context;
};
