"use client";

import { openRunde } from "@/app/fonts/font";
import { usePrivacy } from "@/hooks/privacy-context";
import { animate, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  value: number;
  animated?: boolean; // NOVO: controle de animação
};

function MoneyValues({ value, animated = true }: Props) {
  const { estado } = usePrivacy();
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value);
  const motionValue = useMotionValue(0);

  useEffect(() => {
    if (!animated) return; // Se animação for desativada, não faz nada

    const controls = animate(motionValue, value, {
      duration: 0.2,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplayValue(latest);
      },
    });

    return controls.stop;
  }, [animated, value, motionValue]);

  return (
    <span
      className={`${openRunde.className} font-bold tracking-tight ${
        !estado &&
        "opacity-80 blur-xl transition-all duration-300 hover:blur-none"
      }`}
    >
      {(animated ? displayValue : value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
    </span>
  );
}

export default MoneyValues;
