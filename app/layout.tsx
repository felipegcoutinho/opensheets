import Banner from "@/components/main-banner";
import Header from "@/components/main-header";
import MonthPicker from "@/components/month-picker";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/hooks/UseDarkMode";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { inter } from "./fonts/font";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "OpenSheets",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.className}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <main className="animate-in max-w-screen-xl flex flex-col mx-auto backdrop-blur-lg">
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
