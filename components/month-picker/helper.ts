import { UseDates } from "@/hooks/use-dates";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";

export interface MonthNavigation {
  isChanging: boolean;
  currentMonth: string;
  currentYear: string;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToCurrentMonthYear: () => void;
  isDifferentFromCurrent: boolean;
  pathname: string | null;
}

function Helper(): MonthNavigation {
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
    (newMonth: string, newYear: string | number) => {
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

  return {
    isChanging,
    currentMonth,
    currentYear,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonthYear,
    isDifferentFromCurrent,
    pathname,
  };
}

export default Helper;
