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
    <Card
      className={`bg-primary-color dark:bg-primary-color/20 mb-4 w-full px-4 py-10 text-black`}
    >
      <p className="text-sm dark:text-neutral-300">
        {fliendlyDate(currentDate)}
      </p>
      <p className="text-xl font-bold">
        {getGreeting()}, <GetUserName />
      </p>
    </Card>
  );
}
