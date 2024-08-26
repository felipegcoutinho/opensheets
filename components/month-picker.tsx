"use client";

import { UseDates } from "@/hooks/UseDates";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

export default function MonthPicker() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { optionsMeses } = UseDates();

  const defaultMonth = new Date().toLocaleString("pt-BR", { month: "long" });
  const defaultYear = new Date().getFullYear();
  const monthYearParam = searchParams.get("periodo") || `${defaultMonth}-${defaultYear}`;
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

  const isDifferentFromCurrent = currentMonth !== defaultMonth || currentYear !== defaultYear.toString();

  const isHomePage =
    pathname === "/cartao" ||
    pathname === "/conta" ||
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/login/signup" ||
    pathname === "/investimentos";

  if (isHomePage) {
    return null;
  }

  return (
    <div className="flex justify-start w-full py-8 mb-2 px-4 rounded-lg bg-violet-50 dark:bg-stone-900">
      <button onClick={goToPreviousMonth}>
        <ArrowLeftCircle />
      </button>
      <span className="mx-4 text-xl capitalize font-bold">
        {currentMonth} {currentYear}
      </span>
      <button onClick={goToNextMonth}>
        <ArrowRightCircle />
      </button>
      {isDifferentFromCurrent && (
        <Button variant="light" color="zinc" size="xs" className="ml-4 underline" onClick={goToCurrentMonthYear}>
          Ir para o mês atual
        </Button>
      )}
    </div>
  );
}
