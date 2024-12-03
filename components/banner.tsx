"use client";

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
    <Card className="mx-auto mb-4 w-full border-none bg-amber-300 px-4 py-8 text-amber-950 dark:bg-alt_yellow/20 dark:from-alt_green/40 dark:to-alt_violet/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-base text-neutral-800 dark:text-neutral-300">
              {fliendlyDate(currentDate)}
            </p>
            <p className="text-2xl font-bold">
              {getGreeting()}, <GetUserName />
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
