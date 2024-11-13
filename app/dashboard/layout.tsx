import Banner from "@/components/banner";
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
      <Suspense>
        <MonthPicker />
      </Suspense>
      {children}
    </>
  );
}
