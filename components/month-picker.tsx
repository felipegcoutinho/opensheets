"use client";

import { UseDates } from "@/hooks/use-dates";
import { ChevronLeftSquare, ChevronRightSquare } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

export default function MonthPicker() {
  const { optionsMeses } = UseDates();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const defaultMonth = new Date().toLocaleString("pt-BR", { month: "long" });
  const defaultYear = new Date().getFullYear();
  const monthYearParam =
    searchParams.get("periodo") || `${defaultMonth}-${defaultYear}`;
  const [currentMonth, currentYear] = monthYearParam.split("-");

  const currentMonthIndex = optionsMeses.indexOf(currentMonth);

  const goToPreviousMonth = () => {
    let previousMonthIndex = currentMonthIndex - 1;
    let previousYear = currentYear;

    if (previousMonthIndex < 0) {
      previousMonthIndex = optionsMeses.length - 1;
      previousYear = (parseInt(currentYear) - 1).toString();
    }

    const previousMonth = optionsMeses[previousMonthIndex];
    const newParam = `${previousMonth}-${previousYear}`;
    replace(`${pathname}?periodo=${newParam}`);
  };

  const goToNextMonth = () => {
    let nextMonthIndex = currentMonthIndex + 1;
    let nextYear = currentYear;

    if (nextMonthIndex >= optionsMeses.length) {
      nextMonthIndex = 0;
      nextYear = (parseInt(currentYear) + 1).toString();
    }

    const nextMonth = optionsMeses[nextMonthIndex];
    const newParam = `${nextMonth}-${nextYear}`;
    replace(`${pathname}?periodo=${newParam}`);
  };

  const goToCurrentMonthYear = () => {
    const newParam = `${defaultMonth}-${defaultYear}`;
    replace(`${pathname}?periodo=${newParam}`);
  };

  const isDifferentFromCurrent =
    currentMonth !== defaultMonth || currentYear !== defaultYear.toString();

  const isHomePage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/transacao") ||
    pathname.startsWith("/boleto") ||
    pathname.startsWith("/responsavel") ||
    pathname.startsWith("/anotacao") ||
    (pathname.startsWith("/cartao/") && pathname !== "/cartao");

  if (!isHomePage) {
    return null;
  }

  return (
    <div className="bg-alt_green flex w-full items-center justify-start rounded p-4 dark:bg-blue-950 dark:text-white">
      <button onClick={goToPreviousMonth}>
        <ChevronLeftSquare
          className="text-alt_yellow dark:text-blue-200"
          size={16}
        />
      </button>

      <span
        className={`mx-2 text-lg font-bold capitalize text-white dark:text-blue-200`}
      >
        {currentMonth} {currentYear}
      </span>

      <button onClick={goToNextMonth}>
        <ChevronRightSquare
          className="text-alt_yellow dark:text-blue-200"
          size={16}
        />
      </button>

      {isDifferentFromCurrent && (
        <Button
          variant="link"
          size="xs"
          className="ml-4 border border-white px-1 text-white dark:border-white dark:text-white"
          onClick={goToCurrentMonthYear}
        >
          <span className="pl-1">Retornar ao Mês Atual</span>
        </Button>
      )}
    </div>
  );
}
