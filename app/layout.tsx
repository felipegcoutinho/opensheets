import { Toaster } from "@/components/ui/sonner";
import { PrivacyProviderApp } from "@/hooks/privacy-context";
import { ThemeProvider } from "@/hooks/use-dark-mode";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { AtlasGrotesk } from "./fonts/font";
import "./globals.css";

export const metadata = {
  title: "OpenSheets",
  description:
    "Aplicação para finanças pessoais, com o objetivo de ajudar a organizar e controlar suas finanças.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${AtlasGrotesk.className}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <PrivacyProviderApp>
            <main className="antialiased">{children}</main>
          </PrivacyProviderApp>
          <SpeedInsights />
          <Analytics />
          <Toaster position="top-right" richColors duration={2500} />
          <Script
            defer
            src="https://umami.felipecoutinho.com/script.js"
            data-website-id="0c7a2975-d404-4893-b603-6f598dfc8751"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
