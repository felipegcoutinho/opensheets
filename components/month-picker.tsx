"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseDates } from "@/hooks/use-dates";
import { ChevronLeftSquare, ChevronRightSquare, Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

// Componente otimizado para os botões de navegação
const NavigationButton = ({ onClick, direction, disabled }) => {
  const Icon = direction === "left" ? ChevronLeftSquare : ChevronRightSquare;

  return (
    <button
      onClick={onClick}
      className="text-[#4e5a5c] focus:outline-none disabled:opacity-50"
      disabled={disabled}
    >
      <Icon size={16} />
    </button>
  );
};

// Componente otimizado para o botão de retorno
const ReturnButton = ({ onClick, disabled }) => (
  <Button
    variant="link"
    size="xs"
    className="rounded border border-[#4e5a5c] px-1 text-[#4e5a5c] disabled:opacity-50 dark:border-white dark:text-white dark:brightness-100"
    onClick={onClick}
    disabled={disabled}
  >
    <span className="px-2">Retornar ao Mês Atual</span>
  </Button>
);

// Componente de Loading
const LoadingSpinner = () => (
  <Loader2 className="h-4 w-4 animate-spin text-primary-color dark:text-blue-200" />
);

export default function MonthPicker() {
  const { optionsMeses } = UseDates();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  // Combine both loading states
  const isChanging = isPending || isLoading;

  // Memoize valores default que não mudam
  const defaultValues = useMemo(
    () => ({
      month: new Date().toLocaleString("pt-BR", { month: "long" }),
      year: new Date().getFullYear(),
    }),
    [],
  );

  // Memoize o parâmetro atual do mês
  const monthYearParam = useMemo(() => {
    return (
      searchParams.get("periodo") ||
      `${defaultValues.month}-${defaultValues.year}`
    );
  }, [searchParams, defaultValues.month, defaultValues.year]);

  // Memoize mês e ano atuais
  const [currentMonth, currentYear] = useMemo(
    () => monthYearParam.split("-"),
    [monthYearParam],
  );

  // Memoize índice do mês atual
  const currentMonthIndex = useMemo(
    () => optionsMeses.indexOf(currentMonth),
    [optionsMeses, currentMonth],
  );

  // Memoize opções de meses
  const monthOptions = useMemo(() => {
    const options = [];
    const currentDate = new Date();
    currentDate.setMonth(currentMonthIndex);
    currentDate.setFullYear(parseInt(currentYear));

    // Adiciona 6 meses antes
    for (let i = 6; i > 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString("pt-BR", { month: "long" });
      const year = date.getFullYear();
      options.push(`${month}-${year}`);
    }

    // Adiciona mês atual
    options.push(`${currentMonth}-${currentYear}`);

    // Adiciona 6 meses depois
    for (let i = 1; i <= 6; i++) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() + i);
      const month = date.toLocaleString("pt-BR", { month: "long" });
      const year = date.getFullYear();
      options.push(`${month}-${year}`);
    }

    return options;
  }, [currentMonthIndex, currentMonth, currentYear]);

  // Função auxiliar para navegação
  const navigateToMonth = useCallback(
    (newMonth, newYear) => {
      setIsLoading(true);
      startTransition(() => {
        replace(`${pathname}?periodo=${newMonth}-${newYear}`);
        setTimeout(() => setIsLoading(false), 300); // Garante um mínimo de feedback visual
      });
    },
    [pathname, replace],
  );

  // Callbacks otimizados para navegação
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

  const handleMonthSelect = useCallback(
    (value) => {
      setIsLoading(true);
      startTransition(() => {
        replace(`${pathname}?periodo=${value}`);
        setTimeout(() => setIsLoading(false), 300);
      });
    },
    [pathname, replace],
  );

  // Memoize a verificação de diferença do mês atual
  const isDifferentFromCurrent = useMemo(
    () =>
      currentMonth !== defaultValues.month ||
      currentYear !== defaultValues.year.toString(),
    [currentMonth, currentYear, defaultValues.month, defaultValues.year],
  );

  // Memoize a verificação de exibição do filtro
  const shouldShowMonthFilter = useMemo(() => {
    const notShowPaths = [
      "/dashboard/cartao",
      "/dashboard/conta",
      "/login",
      "/",
    ];
    return !notShowPaths.includes(pathname);
  }, [pathname]);

  if (!shouldShowMonthFilter) {
    return null;
  }

  return (
    <Card className="flex w-full items-center justify-start gap-4 bg-tertiary-color px-4 py-2 dark:bg-tertiary-color/40">
      <div className="flex items-center">
        <NavigationButton
          onClick={goToPreviousMonth}
          direction="left"
          disabled={isChanging}
        />

        <div className="relative flex items-center">
          <Select
            value={monthYearParam}
            onValueChange={handleMonthSelect}
            disabled={isChanging}
          >
            <SelectTrigger className="mx-2 min-w-[150px] border-none bg-transparent text-lg font-bold capitalize text-[#4e5a5c] focus:ring-0 dark:text-white">
              <SelectValue>
                {currentMonth}
                <span className="ml-1">{currentYear}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option} value={option} className="capitalize">
                  {option.replace("-", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isChanging && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
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
