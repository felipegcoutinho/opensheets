import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NumericFormat, type NumericFormatProps } from "react-number-format";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

type MoneyInputProps = NumericFormatProps & {
  withVirtualKeyboard?: boolean;
};

function MoneyInput({
  className,
  withVirtualKeyboard = false,
  getInputRef,
  onFocus,
  onBlur,
  placeholder = "0,00",
  ...props
}: MoneyInputProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const keyboardRef = React.useRef<HTMLDivElement | null>(null);
  const [showKeyboard, setShowKeyboard] = React.useState(false);

  const setNativeInputValue = React.useCallback((input: HTMLInputElement, value: string) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(input),
      "value",
    )?.set;

    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(input, value);
    } else {
      input.value = value;
    }

    const inputEvent = new Event("input", { bubbles: true });
    input.dispatchEvent(inputEvent);
  }, []);

  const applyValue = React.useCallback(
    (value: string, preferredCaret: number) => {
      const input = inputRef.current;
      if (!input) return;

      setNativeInputValue(input, value);

      const formattedValue = input.value;
      const diff = formattedValue.length - value.length;
      const nextCaret = Math.max(
        0,
        Math.min(formattedValue.length, preferredCaret + diff),
      );
      input.setSelectionRange(nextCaret, nextCaret);
    },
    [setNativeInputValue],
  );

  const formatValueToCurrency = React.useCallback(() => {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    const raw = input.value.trim();
    if (raw === "") {
      return;
    }

    const normalized = raw.replace(/[.\s]/g, "").replace(",", ".");
    const parsed = Number(normalized);
    if (Number.isNaN(parsed)) {
      return;
    }

    const formatted = parsed.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setNativeInputValue(input, formatted);
    input.setSelectionRange(formatted.length, formatted.length);
  }, [setNativeInputValue]);

  const assignInputRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof getInputRef === "function") {
        if (node) {
          getInputRef(node);
        }
      } else if (getInputRef && typeof getInputRef === "object") {
        (getInputRef as React.MutableRefObject<HTMLInputElement | null>).current =
          node;
      }
    },
    [getInputRef],
  );

  const handleFocus = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (withVirtualKeyboard) {
        setShowKeyboard(true);
      }
      onFocus?.(event);
    },
    [withVirtualKeyboard, onFocus],
  );

  const handleBlur = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (withVirtualKeyboard) {
        const nextTarget = event.relatedTarget as HTMLElement | null;
        if (!nextTarget || !keyboardRef.current?.contains(nextTarget)) {
          setShowKeyboard(false);
        }
      }
      formatValueToCurrency();
      onBlur?.(event);
    },
    [withVirtualKeyboard, onBlur, formatValueToCurrency],
  );

  const insertText = React.useCallback(
    (text: string) => {
      const input = inputRef.current;
      if (!input) return;

      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? input.value.length;
      const newValue = `${input.value.slice(0, start)}${text}${input.value.slice(end)}`;
      const caretPosition = start + text.length;

      applyValue(newValue, caretPosition);
    },
    [applyValue],
  );

  const handleBackspace = React.useCallback(() => {
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;

    if (start === 0 && end === 0) {
      return;
    }

    if (start !== end) {
      const newValue = `${input.value.slice(0, start)}${input.value.slice(end)}`;
      applyValue(newValue, start);
    } else {
      const caretPosition = Math.max(0, start - 1);
      const newValue = `${input.value.slice(0, caretPosition)}${input.value.slice(end)}`;
      applyValue(newValue, caretPosition);
    }

  }, [applyValue]);

  const handleClear = React.useCallback(() => {
    const input = inputRef.current;
    if (!input) return;

    applyValue("", 0);
  }, [applyValue]);

  const keepFocus = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    inputRef.current?.focus();
  }, []);

  const handleKeyboardAction = React.useCallback(
    (value: string) => {
      if (value === "BACKSPACE") {
        handleBackspace();
        return;
      }

      if (value === "CLEAR") {
        handleClear();
        return;
      }

      if (value === ",") {
        const input = inputRef.current;
        if (!input) return;
        if (input.value.includes(",")) {
          return;
        }
        if (input.value.trim() === "") {
          insertText("0,");
          return;
        }
      }

      insertText(value);
    },
    [handleBackspace, handleClear, insertText],
  );

  const inputElement = (
    <NumericFormat
      required={true}
      thousandSeparator={"."}
      decimalSeparator={","}
      decimalScale={2}
      fixedDecimalScale={false}
      allowNegative={true}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      getInputRef={assignInputRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      {...props}
    />
  );

  if (!withVirtualKeyboard) {
    return inputElement;
  }

  const keypadButtons: Array<{
    label: string;
    value: string;
    colSpan?: number;
  }> = [
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: ",", value: "," },
    { label: "0", value: "0" },
    { label: "Apagar", value: "BACKSPACE" },
    { label: "Limpar", value: "CLEAR", colSpan: 3 },
  ];

  return (
    <div className="relative w-full">
      {inputElement}
      {showKeyboard ? (
        <div
          ref={keyboardRef}
          className="absolute left-0 right-0 top-full z-20 mt-2 grid grid-cols-3 gap-2 rounded-lg border bg-background p-3 shadow-lg"
        >
          {keypadButtons.map((button, index) => (
            <Button
              key={`${button.value}-${index}`}
              type="button"
              variant={button.value === "CLEAR" ? "destructive" : "secondary"}
              className={cn(
                "h-10 w-full text-base font-semibold",
                button.colSpan === 3 && "col-span-3",
              )}
              onMouseDown={keepFocus}
              onClick={() => handleKeyboardAction(button.value)}
              tabIndex={-1}
            >
              {button.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export { Input, MoneyInput };
