import { Toaster } from "@/components/ui/sonner";
import { PrivacyProviderApp } from "@/hooks/privacy-context";
import { ThemeProvider } from "@/hooks/use-dark-mode";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { default_font } from "./fonts/font";
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "opensheets",
  description:
    "Aplicação para finanças pessoais, com o objetivo de ajudar a organizar e controlar suas finanças.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${default_font.className} antialiased`}
    >
      <body suppressHydrationWarning>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="light">
            <PrivacyProviderApp>
              <main>{children}</main>
            </PrivacyProviderApp>

            <Analytics />
            <Toaster position="top-right" duration={2500} />
            <Script
              defer
              src="https://umami.felipecoutinho.com/script.js"
              data-website-id="3cba1a07-5733-4532-abcb-0e1bfc7a5b30"
            />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
