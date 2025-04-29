"use client";

import { uiSans } from "@/app/fonts/font";
import { usePrivacy } from "@/hooks/privacy-context";
import { useEffect, useState } from "react";
import { animate, useMotionValue } from "framer-motion";

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
      className={`${uiSans.className} font-bold tracking-tight ${
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
