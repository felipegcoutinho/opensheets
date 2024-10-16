import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        defaultGreen:
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200/80 rounded-full",
        defaultRed:
          "border-transparent bg-red-100 text-red-800 hover:bg-red-200/80 rounded-full",
        defaultBlue:
          "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200/80 rounded-full",
        defaultOrange:
          "border-transparent bg-orange-100 text-orange-800 hover:bg-orange-200/80 rounded-full",
        defaultPurple:
          "border-transparent bg-purple-100 text-purple-800 hover:bg-purple-200/80 rounded-full",
        defaultGray:
          "border-transparent bg-gray-200 text-gray-800 hover:bg-gray-300/80 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
