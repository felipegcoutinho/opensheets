"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

interface PrivacyState {
  estado: boolean;
  setEstado: Dispatch<SetStateAction<boolean>>;
}

const PrivacyContext = createContext<PrivacyState | undefined>(undefined);

export function PrivacyProviderApp({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState(true);

  return (
    <PrivacyContext.Provider value={{ estado, setEstado }}>
      {children}
    </PrivacyContext.Provider>
  );
}

export function usePrivacy(): PrivacyState {
  const context = useContext(PrivacyContext);
  if (!context) {
    throw new Error(
      "usePrivacy must be used within PrivacyProviderApp",
    );
  }
  return context;
}
