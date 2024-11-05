"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const PrivacyContext = createContext({});

export function PrivacyProviderApp({ children }) {
  const [estado, setEstado] = useState(() =>
    JSON.parse(localStorage.getItem("privacy_estado") ?? "true"),
  );

  useEffect(() => {
    localStorage.setItem("privacy_estado", JSON.stringify(estado));
  }, [estado]);

  return (
    <PrivacyContext.Provider value={{ estado, setEstado }}>
      {children}
    </PrivacyContext.Provider>
  );
}

export function usePrivacy() {
  return useContext(PrivacyContext);
}
