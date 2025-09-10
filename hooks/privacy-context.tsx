"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type PrivacyContextValue = {
  estado: boolean;
  setEstado: (value: boolean) => void;
};

export const PrivacyContext = createContext<PrivacyContextValue | null>(null);

export function PrivacyProviderApp({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState(false);

  return (
    <PrivacyContext.Provider value={{ estado, setEstado }}>
      {children}
    </PrivacyContext.Provider>
  );
}

export function usePrivacy(): PrivacyContextValue {
  const ctx = useContext(PrivacyContext);
  if (!ctx) throw new Error("usePrivacy deve ser usado dentro de PrivacyProviderApp");
  return ctx;
}
