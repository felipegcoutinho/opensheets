"use client";

import { money_values } from "@/app/fonts/font";
import { usePrivacy } from "@/hooks/privacy-context";
import { animate, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  value: number;
  animated?: boolean;
};

function MoneyValues({ value, animated = true }: Props) {
  const { estado } = usePrivacy();

  const isValidNumber =
    typeof value === "number" && !isNaN(value) && isFinite(value);
  const sanitizedValue = isValidNumber ? value : 0;

  const [displayValue, setDisplayValue] = useState(
    animated ? 0 : sanitizedValue,
  );
  const motionValue = useMotionValue(0);

  useEffect(() => {
    if (!animated || !isValidNumber) {
      setDisplayValue(sanitizedValue);
      return;
    }

    const controls = animate(motionValue, sanitizedValue, {
      duration: 0.2,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplayValue(latest);
      },
    });

    return () => controls.stop();
  }, [animated, sanitizedValue, motionValue, isValidNumber]);

  return (
    <span
      className={`${money_values.className} font-bold ${
        estado &&
        "blur-[6px] brightness-200 transition-all duration-200 hover:blur-none"
      }`}
    >
      {displayValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
    </span>
  );
}

export default MoneyValues;
