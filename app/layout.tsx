import Banner from "@/components/banner";
import Header from "@/components/header";
import MonthPicker from "@/components/month-picker";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/hooks/use-dark-mode";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { uiSans } from "./fonts/font";
import "./globals.css";

export const metadata = {
  title: "OpenSheets",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${uiSans.className}`}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* <div className="absolute inset-0 h-1 bg-orange-400 dark:bg-transparent"></div> */}
          <main className="mx-auto flex max-w-screen-xl flex-col px-2 antialiased animate-in">
            <Header />
            <Banner />
            <MonthPicker />
            {children}
          </main>
          <SpeedInsights />
          <Analytics />
          <Toaster position="top-right" richColors duration={2500} />
        </ThemeProvider>
      </body>
    </html>
  );
}
