import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-2xl  px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        destructive_lite:
          "border-destructive bg-destructive/5 text-destructive dark:text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        receita:
          "border border-green-400 bg-green-50 text-green-600 dark:text-green-50 dark:bg-green-600/20 dark:border-green-900",
        despesa:
          "border border-red-400 bg-red-50 text-red-600 dark:text-red-50 dark:bg-red-600/20 dark:border-red-900",
        principal:
          "border border-blue-400 bg-blue-50 text-blue-600 dark:text-blue-50 dark:bg-blue-600/20 dark:border-blue-900",
        sistema:
          "border border-neutral-400 bg-neutral-50 text-neutral-600 dark:text-neutral-50 dark:bg-neutral-600/20",
        outros:
          "border border-orange-400 bg-orange-50 text-orange-600 dark:text-orange-50 dark:bg-orange-600/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
