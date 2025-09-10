"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  value?: number;
  primary_color?: string;
  secondary_color?: string;
};

function Progress({
  className,
  value,
  primary_color,
  secondary_color,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        `${secondary_color} relative h-2 w-full overflow-hidden rounded-full`,
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={`${primary_color} h-full w-full flex-1 transition-transform`}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          willChange: "transform",
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
