"use client";

import { uiSans } from "@/app/fonts/font";
import { UseDates } from "@/hooks/use-dates";
import { usePathname } from "next/navigation";
import GetUserName from "./get-username";
import { Card } from "./ui/card";

export default function Banner() {
  const { currentDate, fliendlyDate, getGreeting } = UseDates();
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  if (!isDashboard) {
    return null;
  }

  return (
    <Card
      className={`${uiSans.className} mb-4 w-full bg-green-banner px-4 py-10 dark:bg-green-banner/20`}
    >
      <p className="text-sm text-green-800 dark:text-neutral-300">
        {fliendlyDate(currentDate)}
      </p>
      <p className="text-xl font-bold">
        {getGreeting()}, <GetUserName />
      </p>
    </Card>
  );
}
