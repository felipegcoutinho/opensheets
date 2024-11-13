import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { PrivacyProviderApp } from "@/hooks/privacy-context";
import { ThemeProvider } from "@/hooks/use-dark-mode";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { inter } from "./fonts/font";
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
      className={`${inter.className}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className="mx-auto flex max-w-screen-1xl flex-col px-2 antialiased animate-in max-sm:px-2">
            <PrivacyProviderApp>
              <Header />
              {children}
            </PrivacyProviderApp>
          </main>

          <SpeedInsights />
          <Analytics />
          <Toaster position="top-right" richColors duration={2500} />
        </ThemeProvider>
      </body>
    </html>
  );
}
