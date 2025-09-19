"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";

type Operator = "add" | "subtract" | "multiply" | "divide";

const OPERATOR_SYMBOLS: Record<Operator, string> = {
  add: "+",
  subtract: "-",
  multiply: "×",
  divide: "÷",
};

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "Erro";
  }

  const rounded = Number(Math.round(value * 1e10) / 1e10);
  return rounded.toString();
}

function performOperation(a: number, b: number, operator: Operator): number {
  switch (operator) {
    case "add":
      return a + b;
    case "subtract":
      return a - b;
    case "multiply":
      return a * b;
    case "divide":
      return b === 0 ? Infinity : a / b;
    default:
      return b;
  }
}

export default function Calculator() {
  const [display, setDisplay] = React.useState("0");
  const [accumulator, setAccumulator] = React.useState<number | null>(null);
  const [operator, setOperator] = React.useState<Operator | null>(null);
  const [overwrite, setOverwrite] = React.useState(false);
  const [history, setHistory] = React.useState<string | null>(null);

  const currentValue = React.useMemo(() => Number(display), [display]);

  const reset = React.useCallback(() => {
    setDisplay("0");
    setAccumulator(null);
    setOperator(null);
    setOverwrite(false);
    setHistory(null);
  }, []);

  const inputDigit = React.useCallback(
    (digit: string) => {
      setDisplay((prev) => {
        if (overwrite || prev === "Erro") {
          setOverwrite(false);
          setHistory(null);
          return digit;
        }

        if (prev === "0") {
          return digit;
        }
        return `${prev}${digit}`;
      });
    },
    [overwrite],
  );

  const inputDecimal = React.useCallback(() => {
    setDisplay((prev) => {
      if (overwrite || prev === "Erro") {
        setOverwrite(false);
        setHistory(null);
        return "0.";
      }

      if (prev.includes(".")) {
        return prev;
      }

      return `${prev}.`;
    });
  }, [overwrite]);

  const setNextOperator = React.useCallback(
    (nextOperator: Operator) => {
      if (display === "Erro") {
        reset();
        return;
      }

      const value = currentValue;

      if (accumulator === null || operator === null || overwrite) {
        setAccumulator(value);
      } else {
        const result = performOperation(accumulator, value, operator);
        const formatted = formatNumber(result);
        setAccumulator(Number.isFinite(result) ? result : null);
        setDisplay(formatted);
        if (!Number.isFinite(result)) {
          setOperator(null);
          setOverwrite(true);
          setHistory(null);
          return;
        }
      }

      setOperator(nextOperator);
      setOverwrite(true);
      setHistory(null);
    },
    [display, currentValue, accumulator, operator, overwrite, reset],
  );

  const evaluate = React.useCallback(() => {
    if (operator === null || accumulator === null || display === "Erro") {
      return;
    }

    const value = currentValue;
    const left = formatNumber(accumulator);
    const right = formatNumber(value);
    const symbol = OPERATOR_SYMBOLS[operator];
    const operation = `${left} ${symbol} ${right}`;
    const result = performOperation(accumulator, value, operator);
    const formatted = formatNumber(result);

    setDisplay(formatted);
    setAccumulator(Number.isFinite(result) ? result : null);
    setOperator(null);
    setOverwrite(true);
    setHistory(operation);
  }, [accumulator, currentValue, display, operator]);

  const toggleSign = React.useCallback(() => {
    setDisplay((prev) => {
      if (prev === "Erro") {
        return prev;
      }
      if (prev.startsWith("-")) {
        return prev.slice(1);
      }
      return prev === "0" ? prev : `-${prev}`;
    });
    if (overwrite) {
      setOverwrite(false);
      setHistory(null);
    }
  }, [overwrite]);

  const applyPercent = React.useCallback(() => {
    setDisplay((prev) => {
      if (prev === "Erro") {
        return prev;
      }
      const value = Number(prev);
      return formatNumber(value / 100);
    });
    setOverwrite(true);
    setHistory(null);
  }, []);

  const expression = React.useMemo(() => {
    if (display === "Erro") {
      return "Erro";
    }

    if (operator && accumulator !== null) {
      const symbol = OPERATOR_SYMBOLS[operator];
      const left = formatNumber(accumulator);

      if (overwrite) {
        return `${left} ${symbol}`;
      }

      return `${left} ${symbol} ${display}`;
    }

    return display;
  }, [display, operator, accumulator, overwrite]);

  const buttons: Array<
    Array<{
      label: string;
      onClick: () => void;
      variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
      colSpan?: number;
    }>
  > = [
    [
      { label: "C", onClick: reset, variant: "destructive" },
      { label: "±", onClick: toggleSign, variant: "default" },
      { label: "%", onClick: applyPercent, variant: "default" },
      {
        label: "÷",
        onClick: () => setNextOperator("divide"),
        variant: "outline",
      },
    ],
    [
      { label: "7", onClick: () => inputDigit("7") },
      { label: "8", onClick: () => inputDigit("8") },
      { label: "9", onClick: () => inputDigit("9") },
      {
        label: "×",
        onClick: () => setNextOperator("multiply"),
        variant: "outline",
      },
    ],
    [
      { label: "4", onClick: () => inputDigit("4") },
      { label: "5", onClick: () => inputDigit("5") },
      { label: "6", onClick: () => inputDigit("6") },
      {
        label: "-",
        onClick: () => setNextOperator("subtract"),
        variant: "outline",
      },
    ],
    [
      { label: "1", onClick: () => inputDigit("1") },
      { label: "2", onClick: () => inputDigit("2") },
      { label: "3", onClick: () => inputDigit("3") },
      { label: "+", onClick: () => setNextOperator("add"), variant: "outline" },
    ],
    [
      { label: "0", onClick: () => inputDigit("0"), colSpan: 2 },
      { label: ".", onClick: inputDecimal },
      { label: "=", onClick: evaluate, variant: "default" },
    ],
  ];

  return (
    <div className="space-y-4">
      <div className="bg-muted/40 rounded-xl border px-4 py-5 text-right">
        {history ? (
          <div className="text-muted-foreground text-sm">{history}</div>
        ) : null}
        <div className="font-mono text-3xl font-semibold tracking-tight tabular-nums">
          {expression}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {buttons.flat().map((btn, index) => (
          <Button
            key={`${btn.label}-${index}`}
            type="button"
            variant={btn.variant ?? "secondary"}
            onClick={btn.onClick}
            className={cn(
              "h-12 text-base font-semibold",
              btn.colSpan === 2 && "col-span-2",
              btn.colSpan === 3 && "col-span-3",
            )}
          >
            {btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
