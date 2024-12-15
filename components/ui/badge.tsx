import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-none border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
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
          "border-transparent bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200/80 rounded-none",
        defaultRed:
          "border-transparent bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200/80 rounded-none",
        defaultBlue:
          "border-transparent bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-blue-800 hover:bg-blue-200/80 rounded-none",
        defaultOrange:
          "border-transparent bg-orange-100  dark:bg-orange-900 text-orange-800 dark:text-orange-200 hover:bg-orange-200/80 rounded-none",
        defaultPurple:
          "border-transparent bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 hover:bg-purple-200/80 rounded-none",
        defaultGray:
          "border-transparent bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-300/80 rounded-none",
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
