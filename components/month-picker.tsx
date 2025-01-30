"use client";

import { bebasNeue } from "@/app/fonts/font";
import { UseDates } from "@/hooks/use-dates";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useMemo, useState, useTransition } from "react";
import { Card } from "./ui/card";

const NavigationButton = React.memo(({ onClick, direction, disabled }) => {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      className="text-color-6 cursor-pointer focus:outline-hidden disabled:opacity-50"
      disabled={disabled}
    >
      <Icon size={16} />
    </button>
  );
});

const ReturnButton = React.memo(({ onClick, disabled }) => (
  <button
    className="bg-color-2 text-color-1 dark:bg-color-6 ml-2 cursor-pointer rounded disabled:opacity-50 dark:text-white"
    onClick={onClick}
    disabled={disabled}
  >
    <span className="px-2">Retornar ao Mês Atual</span>
  </button>
));

const LoadingSpinner = () => (
  <Loader2 className="text-primary-color h-4 w-4 animate-spin dark:text-blue-200" />
);

export default function MonthPicker() {
  const { optionsMeses } = UseDates();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const isChanging = isPending || isLoading;

  const defaultValues = useMemo(
    () => ({
      month: new Date().toLocaleString("pt-BR", { month: "long" }),
      year: new Date().getFullYear(),
    }),
    [],
  );

  const monthYearParam = useMemo(
    () =>
      searchParams.get("periodo") ||
      `${defaultValues.month}-${defaultValues.year}`,
    [searchParams, defaultValues.month, defaultValues.year],
  );

  const [currentMonth, currentYear] = useMemo(
    () => monthYearParam.split("-"),
    [monthYearParam],
  );

  const currentMonthIndex = useMemo(
    () => optionsMeses.indexOf(currentMonth),
    [optionsMeses, currentMonth],
  );

  const navigateToMonth = useCallback(
    (newMonth, newYear) => {
      setIsLoading(true);
      startTransition(() => {
        replace(`${pathname}?periodo=${newMonth}-${newYear}`);
        setTimeout(() => setIsLoading(false), 300);
      });
    },
    [pathname, replace],
  );

  const goToPreviousMonth = useCallback(() => {
    let previousMonthIndex = currentMonthIndex - 1;
    let previousYear = currentYear;

    if (previousMonthIndex < 0) {
      previousMonthIndex = optionsMeses.length - 1;
      previousYear = (parseInt(currentYear) - 1).toString();
    }

    const previousMonth = optionsMeses[previousMonthIndex];
    navigateToMonth(previousMonth, previousYear);
  }, [currentMonthIndex, currentYear, optionsMeses, navigateToMonth]);

  const goToNextMonth = useCallback(() => {
    let nextMonthIndex = currentMonthIndex + 1;
    let nextYear = currentYear;

    if (nextMonthIndex >= optionsMeses.length) {
      nextMonthIndex = 0;
      nextYear = (parseInt(currentYear) + 1).toString();
    }

    const nextMonth = optionsMeses[nextMonthIndex];
    navigateToMonth(nextMonth, nextYear);
  }, [currentMonthIndex, currentYear, optionsMeses, navigateToMonth]);

  const goToCurrentMonthYear = useCallback(() => {
    navigateToMonth(defaultValues.month, defaultValues.year);
  }, [navigateToMonth, defaultValues]);

  const isDifferentFromCurrent = useMemo(
    () =>
      currentMonth !== defaultValues.month ||
      currentYear !== defaultValues.year.toString(),
    [currentMonth, currentYear, defaultValues.month, defaultValues.year],
  );

  const shouldShowMonthFilter = useMemo(() => {
    const notShowPaths = [
      "/dashboard/cartao",
      "/dashboard/conta",
      "/dashboard/ajustes",
      "/login",
      "/",
    ];
    return !notShowPaths.includes(pathname);
  }, [pathname]);

  if (!shouldShowMonthFilter) {
    return null;
  }

  return (
    <Card
      className={`${bebasNeue.className} bg-color-1 text-color-2 dark:bg-card flex w-full items-center justify-start border-none p-4`}
    >
      <div className="flex items-center">
        <NavigationButton
          onClick={goToPreviousMonth}
          direction="left"
          disabled={isChanging}
        />
        <div className="relative flex items-center">
          <div className="mx-2 text-2xl capitalize dark:text-white">
            {currentMonth} <span className="text-color-6">{currentYear}</span>
          </div>

          {isChanging && (
            <div className="absolute top-1/2 right-4 -translate-y-1/2">
              <LoadingSpinner />
            </div>
          )}
        </div>
        <NavigationButton
          onClick={goToNextMonth}
          direction="right"
          disabled={isChanging}
        />
      </div>
      {isDifferentFromCurrent && (
        <ReturnButton onClick={goToCurrentMonthYear} disabled={isChanging} />
      )}
    </Card>
  );
}
