import Banner from "@/components/banner-data";
import MonthPicker from "@/components/month-picker";
import { Suspense } from "react";

export const metadata = {
  title: "Dashboard | openSheets",
};

export default function DashboardLayout({ children }) {
  return (
    <>
      <div className="mt-24">
        <Banner />
      </div>
      <Suspense>
        <MonthPicker />
      </Suspense>
      {children}
    </>
  );
}
