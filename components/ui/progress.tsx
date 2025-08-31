"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

function Progress({
  className,
  value,
  primary_color,
  secondary_color,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
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
