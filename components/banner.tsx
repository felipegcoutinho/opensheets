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
    <Card className="mx-auto mb-4 w-full border-none bg-gradient-to-tr from-alt_yellow to-alt_violet px-4 py-8 dark:bg-blue-950 dark:from-alt_green/40 dark:to-alt_violet/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-sm text-neutral-800 dark:text-neutral-300">
              {fliendlyDate(currentDate)}
            </p>

            <p className="text-xl font-bold">
              {getGreeting()}, <GetUserName />
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
