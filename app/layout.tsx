import Banner from "@/components/main-banner";
import Header from "@/components/main-header";
import MonthPicker from "@/components/month-picker";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
// import { Fira_Sans, Gabarito, Inter } from "next/font/google";
import { Inter } from "next/font/google";
// import localFont from "next/font/local"; //TODO: Implementar fontfile

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/hooks/UseDarkMode";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

const inter = Inter({ subsets: ["latin"], weight: ["500", "600"], fallback: ["system-ui", "arial"] });
// const gabarito = Gabarito({ subsets: ["latin"] });
// const firaSans = Fira_Sans({ subsets: ["latin"], weight: ["400", "600"] });

// const uiSans = localFont({
//   src: [
//     { path: "/fonts/ui-sans-v9-regular.woff2", weight: "400", style: "normal" },
//     { path: "/fonts/ui-sans-v9-medium.woff2", weight: "500", style: "normal" },
//     { path: "/fonts/ui-sans-v9-bold.woff2", weight: "600", style: "normal" },
//   ],
// });

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "OpenSheets",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.className}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
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
