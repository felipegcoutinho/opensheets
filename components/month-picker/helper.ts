import { UseDates } from "@/hooks/use-dates";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useTransition } from "react";

function Helper() {
  const { optionsMeses } = UseDates();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isChanging = isPending;

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

  const [currentMonth, currentYear] = useMemo(() => {
    const parts = monthYearParam.split("-")
    const m = (parts[0] || "").toLowerCase()
    const y = parts[1] || String(defaultValues.year)
    return [m, y]
  }, [monthYearParam, defaultValues.year]);

  const currentMonthIndex = useMemo(
    () => optionsMeses.indexOf((currentMonth || "").toLowerCase()),
    [optionsMeses, currentMonth],
  );

  const navigateToMonth = useCallback(
    (newMonth: string, newYear: string | number) => {
      const target = `${pathname}?periodo=${newMonth}-${newYear}`;
      // Evita navegação redundante
      if (
        `${currentMonth}-${currentYear}`.toLowerCase() ===
        `${String(newMonth)}-${String(newYear)}`.toLowerCase()
      )
        return;

      startTransition(() => {
        router.replace(target, { scroll: false });
      });
    },
    [pathname, router, currentMonth, currentYear],
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

  // Prefetch dos alvos anterior e próximo para reduzir espera
  const prevTarget = useMemo(() => {
    let idx = currentMonthIndex - 1;
    let y = currentYear;
    if (idx < 0) {
      idx = optionsMeses.length - 1;
      y = (parseInt(currentYear) - 1).toString();
    }
    return `${pathname}?periodo=${optionsMeses[idx]}-${y}`;
  }, [currentMonthIndex, currentYear, optionsMeses, pathname]);

  const nextTarget = useMemo(() => {
    let idx = currentMonthIndex + 1;
    let y = currentYear;
    if (idx >= optionsMeses.length) {
      idx = 0;
      y = (parseInt(currentYear) + 1).toString();
    }
    return `${pathname}?periodo=${optionsMeses[idx]}-${y}`;
  }, [currentMonthIndex, currentYear, optionsMeses, pathname]);

  // Alvo para retornar ao mês/ano atual do sistema
  const returnTarget = useMemo(() => {
    return `${pathname}?periodo=${defaultValues.month}-${defaultValues.year}`
  }, [pathname, defaultValues.month, defaultValues.year])

  useEffect(() => {
    const anyRouter: any = router as any;
    try {
      if (anyRouter?.prefetch) {
        anyRouter.prefetch(prevTarget);
        anyRouter.prefetch(nextTarget);
      }
    } catch {}
  }, [router, prevTarget, nextTarget]);

  return {
    isChanging,
    currentMonth,
    currentYear,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonthYear,
    isDifferentFromCurrent,
    pathname,
    prevTarget,
    nextTarget,
    returnTarget,
  };
}

export default Helper;
