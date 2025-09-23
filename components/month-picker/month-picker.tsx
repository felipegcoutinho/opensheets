"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { title_font } from "../../app/fonts/font";
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
    prevTarget,
    nextTarget,
    returnTarget,
  } = Helper();

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isStuck, setIsStuck] = useState(false);

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

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    let stickStart = 0;

    const updateStickState = () => {
      const next = window.scrollY >= stickStart;
      setIsStuck((prev) => (prev === next ? prev : next));
    };

    const recalculateStickStart = () => {
      if (!element) return;
      const style = window.getComputedStyle(element);
      const topOffset = parseFloat(style.top) || 0;
      const marginTop = parseFloat(style.marginTop) || 0;
      const rect = element.getBoundingClientRect();
      stickStart = rect.top + window.scrollY - topOffset - marginTop;
      updateStickState();
    };

    recalculateStickStart();
    window.addEventListener("scroll", updateStickState, { passive: true });
    window.addEventListener("resize", recalculateStickStart);

    return () => {
      window.removeEventListener("scroll", updateStickState);
      window.removeEventListener("resize", recalculateStickStart);
    };
  }, []);

  return (
    <Card
      ref={cardRef}
      className={`${title_font.className} bg-secondary/90 supports-[backdrop-filter]:bg-secondary/70 sticky top-16 z-30 my-3 flex-row border-none p-5 backdrop-blur-xs transition-all duration-200 ease-out w-full${
        isStuck ? " -mx-4 w-[calc(100%+2rem)] rounded-none" : ""
      }`}
    >
      <div className="flex items-center">
        <NavigationButton
          href={prevTarget}
          direction="left"
          disabled={isChanging || isNavigating}
          onClick={() => setIsNavigating(true)}
        />

        <div className="flex items-center">
          <div className="mx-2 space-x-1 uppercase">
            <span>{currentMonth}</span>
            <span className="font-bold">{currentYear}</span>
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
