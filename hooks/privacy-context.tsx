"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const PrivacyContext = createContext({});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

export function PrivacyProviderApp({ children }) {
  const [estado, setEstado] = useState(() => {
    const cookieValue = getCookie("privacy_estado");
    return cookieValue ? JSON.parse(cookieValue) : true;
  });

  useEffect(() => {
    setCookie("privacy_estado", JSON.stringify(estado), 365);
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
