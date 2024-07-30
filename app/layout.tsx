import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Fira_Sans, Gabarito, Inter } from "next/font/google";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

const inter = Inter({ subsets: ["latin"] });
const gabarito = Gabarito({ subsets: ["latin"] });
const firaSans = Fira_Sans({ subsets: ["latin"], weight: ["400", "600"] });

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "OpenSheets",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.className}`}>
      <body>
        <main className="max-w-screen-xl flex flex-col items-center mx-auto">{children}</main>
        <SpeedInsights />
        <Toaster />
      </body>
    </html>
  );
}
