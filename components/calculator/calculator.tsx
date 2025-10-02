"use client";

import { CalculatorKeypad } from "@/components/calculator/calculator-keypad";
import { useCalculatorKeyboard } from "@/hooks/use-calculator-keyboard";
import { useCalculatorState } from "@/hooks/use-calculator-state";
import { CalculatorDisplay } from "./calculator-display";

export default function Calculator() {
  const {
    expression,
    history,
    resultText,
    copied,
    buttons,
    copyToClipboard,
    pasteFromClipboard,
  } = useCalculatorState();

  useCalculatorKeyboard({
    canCopy: Boolean(resultText),
    onCopy: () => {
      void copyToClipboard();
    },
    onPaste: () => {
      void pasteFromClipboard();
    },
  });

  return (
    <div className="space-y-4">
      <CalculatorDisplay
        history={history}
        expression={expression}
        resultText={resultText}
        copied={copied}
        onCopy={() => {
          void copyToClipboard();
        }}
      />
      <CalculatorKeypad buttons={buttons} />
    </div>
  );
}
