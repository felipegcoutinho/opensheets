"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  value?: number;
  primary_color?: string;
  secondary_color?: string;
};

function resolveColorStyles(color?: string) {
  if (!color) return {} as React.CSSProperties;
  if (color.startsWith("--")) {
    return { backgroundColor: `var(${color})` } as React.CSSProperties;
  }
  return {} as React.CSSProperties;
}

function resolveColorClass(color?: string) {
  if (!color || color.startsWith("--")) return undefined;
  return color;
}

function Progress({
  className,
  value,
  primary_color,
  secondary_color,
  style,
  ...props
}: ProgressProps) {
  const normalizedValue = Math.min(Math.max(value ?? 0, 0), 100);

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted",
        resolveColorClass(secondary_color),
        className,
      )}
      style={{
        ...resolveColorStyles(secondary_color),
        ...style,
      }}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 bg-primary transition-transform",
          resolveColorClass(primary_color),
        )}
        style={{
          transform: `translateX(-${100 - normalizedValue}%)`,
          willChange: "transform",
          ...resolveColorStyles(primary_color),
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
