"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";
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

function formatLocaleValue(rawValue: string): string {
  if (rawValue === "Erro") {
    return rawValue;
  }

  const isNegative = rawValue.startsWith("-");
  const unsignedValue = isNegative ? rawValue.slice(1) : rawValue;

  if (unsignedValue === "") {
    return isNegative ? "-0" : "0";
  }

  const hasDecimalSeparator = unsignedValue.includes(".");
  const [integerPartRaw, decimalPartRaw] = unsignedValue.split(".");

  const integerPart = integerPartRaw || "0";
  const decimalPart = hasDecimalSeparator ? decimalPartRaw ?? "" : undefined;

  const numericInteger = Number(integerPart);
  const formattedInteger = Number.isFinite(numericInteger)
    ? numericInteger.toLocaleString("pt-BR")
    : integerPart;

  if (decimalPart === undefined) {
    return `${isNegative ? "-" : ""}${formattedInteger}`;
  }

  return `${isNegative ? "-" : ""}${formattedInteger},${decimalPart}`;
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

// Trata colagem de valores com formatação brasileira (ponto para milhar, vírgula para decimal)
// e variações simples em formato internacional.
function normalizeClipboardNumber(rawValue: string): string | null {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return null;
  }

  const match = trimmed.match(/-?[\d.,\s]+/);
  if (!match) {
    return null;
  }

  let extracted = match[0].replace(/\s+/g, "");
  if (!extracted) {
    return null;
  }

  const isNegative = extracted.startsWith("-");
  if (isNegative) {
    extracted = extracted.slice(1);
  }

  extracted = extracted.replace(/[^\d.,]/g, "");
  if (!extracted) {
    return null;
  }

  const countOccurrences = (char: string) =>
    (extracted.match(new RegExp(`\\${char}`, "g")) ?? []).length;

  const hasComma = extracted.includes(",");
  const hasDot = extracted.includes(".");

  let decimalSeparator: "," | "." | null = null;

  if (hasComma && hasDot) {
    decimalSeparator =
      extracted.lastIndexOf(",") > extracted.lastIndexOf(".") ? "," : ".";
  } else if (hasComma) {
    const commaCount = countOccurrences(",");
    if (commaCount > 1) {
      decimalSeparator = null;
    } else {
      const digitsAfterComma = extracted.length - extracted.lastIndexOf(",") - 1;
      decimalSeparator = digitsAfterComma > 0 && digitsAfterComma <= 2 ? "," : null;
    }
  } else if (hasDot) {
    const dotCount = countOccurrences(".");
    if (dotCount > 1) {
      decimalSeparator = null;
    } else {
      const digitsAfterDot = extracted.length - extracted.lastIndexOf(".") - 1;
      const decimalCandidate = extracted.slice(extracted.lastIndexOf(".") + 1);
      const allZeros = /^0+$/.test(decimalCandidate);
      const shouldTreatAsDecimal =
        digitsAfterDot > 0 && digitsAfterDot <= 3 && !(digitsAfterDot === 3 && allZeros);
      decimalSeparator = shouldTreatAsDecimal ? "." : null;
    }
  }

  let integerPart = extracted;
  let decimalPart = "";

  if (decimalSeparator) {
    const decimalIndex = extracted.lastIndexOf(decimalSeparator);
    integerPart = extracted.slice(0, decimalIndex);
    decimalPart = extracted.slice(decimalIndex + 1);
  }

  integerPart = integerPart.replace(/[^\d]/g, "");
  decimalPart = decimalPart.replace(/[^\d]/g, "");

  if (!integerPart) {
    integerPart = "0";
  }

  let normalized = integerPart;
  if (decimalPart) {
    normalized = `${integerPart}.${decimalPart}`;
  }

  if (isNegative && Number(normalized) !== 0) {
    normalized = `-${normalized}`;
  }

  if (!/^(-?\d+(\.\d+)?)$/.test(normalized)) {
    return null;
  }

  const numericValue = Number(normalized);
  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return normalized;
}

export default function Calculator() {
  const [display, setDisplay] = React.useState("0");
  const [accumulator, setAccumulator] = React.useState<number | null>(null);
  const [operator, setOperator] = React.useState<Operator | null>(null);
  const [overwrite, setOverwrite] = React.useState(false);
  const [history, setHistory] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const resetCopiedTimeoutRef = React.useRef<number | undefined>(undefined);

  const currentValue = React.useMemo(() => Number(display), [display]);

  const resultText = React.useMemo(() => {
    if (display === "Erro") {
      return null;
    }

    const normalized = formatNumber(currentValue);
    if (normalized === "Erro") {
      return null;
    }

    return formatLocaleValue(normalized);
  }, [currentValue, display]);

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
    const operation = `${formatLocaleValue(left)} ${symbol} ${formatLocaleValue(right)}`;
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

  const deleteLastDigit = React.useCallback(() => {
    setHistory(null);
    setDisplay((prev) => {
      if (prev === "Erro") {
        setAccumulator(null);
        setOperator(null);
        setOverwrite(false);
        return "0";
      }

      if (overwrite) {
        setOverwrite(false);
        return "0";
      }

      if (prev.length <= 1 || (prev.length === 2 && prev.startsWith("-"))) {
        return "0";
      }

      return prev.slice(0, -1);
    });
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
      const left = formatLocaleValue(formatNumber(accumulator));

      if (overwrite) {
        return `${left} ${symbol}`;
      }

      return `${left} ${symbol} ${formatLocaleValue(display)}`;
    }

    return formatLocaleValue(display);
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
      { label: "⌫", onClick: deleteLastDigit, variant: "default" },
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
      { label: "±", onClick: toggleSign, variant: "default" },
      { label: "0", onClick: () => inputDigit("0") },
      { label: ",", onClick: inputDecimal },
      { label: "=", onClick: evaluate, variant: "default" },
    ],
  ];

  const copyToClipboard = React.useCallback(async () => {
    if (!resultText) {
      return;
    }

    const handleCopiedFeedback = () => {
      setCopied(true);
      if (resetCopiedTimeoutRef.current !== undefined) {
        window.clearTimeout(resetCopiedTimeoutRef.current);
      }
      resetCopiedTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    };

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(resultText);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = resultText;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      handleCopiedFeedback();
    } catch (error) {
      console.error("Não foi possível copiar o resultado da calculadora.", error);
    }
  }, [resultText]);

  const pasteFromClipboard = React.useCallback(async () => {
    if (!navigator.clipboard?.readText) {
      return;
    }

    try {
      const rawValue = await navigator.clipboard.readText();
      const normalized = normalizeClipboardNumber(rawValue);

      if (!normalized) {
        setDisplay("Erro");
        setAccumulator(null);
        setOperator(null);
        setOverwrite(true);
        setHistory(null);
        return;
      }

      if (resetCopiedTimeoutRef.current !== undefined) {
        window.clearTimeout(resetCopiedTimeoutRef.current);
        resetCopiedTimeoutRef.current = undefined;
      }

      setCopied(false);
      setDisplay(normalized);
      setAccumulator(null);
      setOperator(null);
      setOverwrite(false);
      setHistory(null);
    } catch (error) {
      console.error("Não foi possível colar o valor na calculadora.", error);
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (resetCopiedTimeoutRef.current !== undefined) {
        window.clearTimeout(resetCopiedTimeoutRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (!resultText) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName;
        if (
          tagName === "INPUT" ||
          tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }
      }

      const key = event.key.toLowerCase();
      if (key === "c") {
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0) {
          return;
        }

        event.preventDefault();
        void copyToClipboard();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [copyToClipboard, resultText]);

  React.useEffect(() => {
    const handlePasteShortcut = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) {
        return;
      }

      if (event.key.toLowerCase() !== "v") {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName;
        if (
          tagName === "INPUT" ||
          tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }
      }

      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        return;
      }

      if (!navigator.clipboard?.readText) {
        return;
      }

      event.preventDefault();
      void pasteFromClipboard();
    };

    document.addEventListener("keydown", handlePasteShortcut);

    return () => {
      document.removeEventListener("keydown", handlePasteShortcut);
    };
  }, [pasteFromClipboard]);

  return (
    <div className="space-y-4">
      <div className="bg-muted/40 rounded-xl border px-4 py-5 text-right">
        {history ? (
          <div className="text-muted-foreground text-sm">{history}</div>
        ) : null}
        <div className="flex items-center justify-end gap-2">
          <div className="font-mono text-3xl font-semibold tracking-tight tabular-nums text-right">
            {expression}
          </div>
          {resultText ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => void copyToClipboard()}
              className="h-7 w-7 flex-shrink-0 rounded-full p-0 text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <RiCheckLine className="h-4 w-4" />
              ) : (
                <RiFileCopyLine className="h-4 w-4" />
              )}
              <span className="sr-only">
                {copied ? "Resultado copiado" : "Copiar resultado"}
              </span>
            </Button>
          ) : null}
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
