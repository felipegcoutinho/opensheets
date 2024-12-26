import Banner from "@/components/banner-data";
import MonthPicker from "@/components/month-picker";
import { Suspense } from "react";

export const metadata = {
  title: "OpenSheets | Dashboard",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function DashboardLayout({ children }) {
  return (
    <>
      <Banner />
      {/* <CurrentBalance /> */}
      <Suspense>
        <MonthPicker />
      </Suspense>
      {children}
    </>
  );
}
