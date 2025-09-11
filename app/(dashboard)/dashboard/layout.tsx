import MonthPicker from "@/components/month-picker/month-picker";
import { Suspense } from "react";
import Loading from "./loading";

export const metadata = {
  title: "Dashboard | opensheets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <MonthPicker />
      {children}
    </Suspense>
  );
}
