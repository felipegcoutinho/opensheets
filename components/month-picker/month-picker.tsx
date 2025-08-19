"use client";

import { money_values } from "@/app/fonts/font";
import { Card } from "@/components/ui/card";
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

  return (
    <Card
      className={`${money_values.className} bg-secondary my-3 flex-row border-none p-5`}
    >
      <div className="flex items-center">
        <NavigationButton
          onClick={goToPreviousMonth}
          direction="left"
          disabled={isChanging}
        />

        <div className="flex items-center">
          <div className="mx-2 font-bold capitalize">
            {currentMonth}{" "}
            <span className="text-foreground">{currentYear}</span>
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
