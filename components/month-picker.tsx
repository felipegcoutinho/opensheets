"use client";

import { UseDates } from "@/hooks/use-dates";
import { GeistMono } from "geist/font/mono";
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
    pathname === "/dashboard" ||
    pathname === "/transacao" ||
    pathname === "/boleto" ||
    pathname === "/responsavel" ||
    pathname === "/anotacao";

  if (!isHomePage) {
    return null;
  }

  return (
    <div className="flex w-full justify-start rounded bg-lime-3000 px-4 py-4 text-black dark:bg-violet-600 dark:text-white">
      <button onClick={goToPreviousMonth}>
        <ChevronLeftSquare size={16} />
      </button>

      <span
        className={`${GeistMono.className} mx-2 font-mono font-bold uppercase`}
      >
        {currentMonth} {currentYear}
      </span>

      <button onClick={goToNextMonth}>
        <ChevronRightSquare size={16} />
      </button>

      {isDifferentFromCurrent && (
        <Button
          variant="link"
          size="xs"
          className="ml-4 border border-black px-1 dark:text-black"
          onClick={goToCurrentMonthYear}
        >
          <span className="pl-1">Retornar ao Mês Atual</span>
        </Button>
      )}
    </div>
  );
}
