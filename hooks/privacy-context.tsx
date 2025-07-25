"use client";

import { createContext, useContext, useState } from "react";

export const PrivacyContext = createContext({});

export function PrivacyProviderApp({ children }) {
  const [estado, setEstado] = useState(false);

  return (
    <PrivacyContext.Provider value={{ estado, setEstado }}>
      {children}
    </PrivacyContext.Provider>
  );
}

export function usePrivacy() {
  return useContext(PrivacyContext);
}
