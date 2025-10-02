"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { RiArrowDownLine, RiArrowUpLine } from "@remixicon/react";

type VariationIndicatorProps = {
  variation: number;
  className?: string;
  tooltipMessage?: string;
  precision?: number;
};

export default function VariationIndicator({
  variation,
  className,
  tooltipMessage = "Comparado ao mês anterior",
  precision = 1,
}: VariationIndicatorProps) {
  const safeValue = Number.isFinite(variation) ? variation : 0;
  const VariationIcon =
    safeValue > 0 ? RiArrowUpLine : safeValue < 0 ? RiArrowDownLine : null;
  const variationClass =
    safeValue > 0
      ? "text-emerald-600"
      : safeValue < 0
        ? "text-red-600"
        : "text-muted-foreground";

  const formatted = `${safeValue > 0 ? "+" : safeValue < 0 ? "" : ""}${safeValue.toFixed(precision)}%`;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-semibold",
            variationClass,
            className,
          )}
        >
          {VariationIcon ? <VariationIcon className="h-3 w-3" /> : null}
          {formatted}
        </span>
      </TooltipTrigger>
      <TooltipContent>{tooltipMessage}</TooltipContent>
    </Tooltip>
  );
}
