"use client";

import { Card } from "@/components/ui/card";
import Helper from "./helper";
import LoadingSpinner from "./loading-spinner";
import NavigationButton from "./nav-button";
import ReturnButton from "./return-button";
import { useEffect, useState } from "react";

export default function MonthPicker() {
  const {
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
  } = Helper();

  // Spinner otimista para navegação via Link
  const [isNavigating, setIsNavigating] = useState(false);
  // Fallback: caso a navegação demore, some após 1.2s
  useEffect(() => {
    if (!isNavigating) return;
    const t = setTimeout(() => setIsNavigating(false), 1200);
    return () => clearTimeout(t);
  }, [isNavigating]);

  // Some no primeiro paint após mudança do período
  useEffect(() => {
    if (isNavigating) setIsNavigating(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth, currentYear]);

  return (
    <Card
      className={`bg-secondary my-3 flex-row border-none p-5`}
    >
      <div className="flex items-center">
        <NavigationButton
          href={prevTarget}
          direction="left"
          disabled={isChanging || isNavigating}
          onClick={() => setIsNavigating(true)}
        />

        <div className="flex items-center">
          <div className="mx-2 font-bold capitalize">
            {currentMonth}{" "}
            <span className="text-foreground">{currentYear}</span>
          </div>

          {(isChanging || isNavigating) && <LoadingSpinner />}
        </div>

        <NavigationButton
          href={nextTarget}
          direction="right"
          disabled={isChanging || isNavigating}
          onClick={() => setIsNavigating(true)}
        />
      </div>

      {isDifferentFromCurrent && (
        <ReturnButton
          href={returnTarget}
          onClick={() => setIsNavigating(true)}
          disabled={isChanging || isNavigating}
        />
      )}
    </Card>
  );
}
