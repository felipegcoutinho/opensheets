"use client";

import { useMemo } from "react";
import { Card } from "../ui/card";
import Helper from "./helper";
import LoadingSpinner from "./loading-spinner";
import NavigationButton from "./nav-button";
import ReturnButton from "./return-button";

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
  } = Helper();

  const shouldShowMonthFilter = useMemo(() => {
    const notShowPaths = ["/cartao", "/conta", "/categorias", "/login", "/"];
    return !notShowPaths.includes(pathname);
  }, [pathname]);

  if (!shouldShowMonthFilter) {
    return null;
  }

  return (
    <Card className="flex-row p-4">
      <div className="flex items-center">
        <NavigationButton
          onClick={goToPreviousMonth}
          direction="left"
          disabled={isChanging}
        />
        <div className="flex items-center">
          <div className="mx-2 font-bold capitalize">
            {currentMonth} <span className="text-primary">{currentYear}</span>
          </div>

          {isChanging && <LoadingSpinner />}
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
