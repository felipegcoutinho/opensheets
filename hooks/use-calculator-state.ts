import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  OPERATOR_SYMBOLS,
  formatLocaleValue,
  formatNumber,
  normalizeClipboardNumber,
  performOperation,
  type Operator,
} from "@/utils/calculator-utils";

export type CalculatorButtonVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

export type CalculatorButtonConfig = {
  label: string;
  onClick: () => void;
  variant?: CalculatorButtonVariant;
  colSpan?: number;
};

export function useCalculatorState() {
  const [display, setDisplay] = useState("0");
  const [accumulator, setAccumulator] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [overwrite, setOverwrite] = useState(false);
  const [history, setHistory] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const resetCopiedTimeoutRef = useRef<number | undefined>(undefined);

  const currentValue = useMemo(() => Number(display), [display]);

  const resultText = useMemo(() => {
    if (display === "Erro") {
      return null;
    }

    const normalized = formatNumber(currentValue);
    if (normalized === "Erro") {
      return null;
    }

    return formatLocaleValue(normalized);
  }, [currentValue, display]);

  const reset = useCallback(() => {
    setDisplay("0");
    setAccumulator(null);
    setOperator(null);
    setOverwrite(false);
    setHistory(null);
  }, []);

  const inputDigit = useCallback(
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

  const inputDecimal = useCallback(() => {
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

  const setNextOperator = useCallback(
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
    [accumulator, currentValue, display, operator, overwrite, reset],
  );

  const evaluate = useCallback(() => {
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

  const toggleSign = useCallback(() => {
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

  const deleteLastDigit = useCallback(() => {
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

  const applyPercent = useCallback(() => {
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

  const expression = useMemo(() => {
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
  }, [accumulator, display, operator, overwrite]);

  const buttons = useMemo(() => {
    const makeOperatorHandler = (nextOperator: Operator) => () =>
      setNextOperator(nextOperator);

    return [
      [
        { label: "C", onClick: reset, variant: "destructive" },
        { label: "⌫", onClick: deleteLastDigit, variant: "default" },
        { label: "%", onClick: applyPercent, variant: "default" },
        { label: "÷", onClick: makeOperatorHandler("divide"), variant: "outline" },
      ],
      [
        { label: "7", onClick: () => inputDigit("7") },
        { label: "8", onClick: () => inputDigit("8") },
        { label: "9", onClick: () => inputDigit("9") },
        { label: "×", onClick: makeOperatorHandler("multiply"), variant: "outline" },
      ],
      [
        { label: "4", onClick: () => inputDigit("4") },
        { label: "5", onClick: () => inputDigit("5") },
        { label: "6", onClick: () => inputDigit("6") },
        { label: "-", onClick: makeOperatorHandler("subtract"), variant: "outline" },
      ],
      [
        { label: "1", onClick: () => inputDigit("1") },
        { label: "2", onClick: () => inputDigit("2") },
        { label: "3", onClick: () => inputDigit("3") },
        { label: "+", onClick: makeOperatorHandler("add"), variant: "outline" },
      ],
      [
        { label: "±", onClick: toggleSign, variant: "default" },
        { label: "0", onClick: () => inputDigit("0") },
        { label: ",", onClick: inputDecimal },
        { label: "=", onClick: evaluate, variant: "default" },
      ],
    ] satisfies CalculatorButtonConfig[][];
  }, [
    applyPercent,
    deleteLastDigit,
    evaluate,
    inputDecimal,
    inputDigit,
    reset,
    setNextOperator,
    toggleSign,
  ]);

  const copyToClipboard = useCallback(async () => {
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

  const pasteFromClipboard = useCallback(async () => {
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

  useEffect(() => {
    return () => {
      if (resetCopiedTimeoutRef.current !== undefined) {
        window.clearTimeout(resetCopiedTimeoutRef.current);
      }
    };
  }, []);

  return {
    expression,
    history,
    resultText,
    copied,
    buttons,
    copyToClipboard,
    pasteFromClipboard,
  };
}
