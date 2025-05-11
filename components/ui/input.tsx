import * as React from "react";

import { cn } from "@/lib/utils";
import { NumericFormat } from "react-number-format";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "border-muted bg-card ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded border-2 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

const MoneyInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <NumericFormat
        required={true}
        thousandSeparator={"."}
        decimalSeparator={","}
        prefix={"R$ "}
        decimalScale={2}
        fixedDecimalScale={true}
        allowNegative={true}
        className="border-muted bg-card ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded border-2 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
        ref={ref}
        type="text"
        {...props}
      />
    );
  },
);
Input.displayName = "MoneyInput";

export { Input, MoneyInput };
