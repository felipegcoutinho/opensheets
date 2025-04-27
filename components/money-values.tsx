"use client";

import { uiSans } from "@/app/fonts/font";
import { usePrivacy } from "@/hooks/privacy-context";
import { useEffect, useState } from "react";
import { animate, useMotionValue } from "framer-motion";

type Props = {
  value: number;
};

function MoneyValues({ value }: Props) {
  const { estado } = usePrivacy();
  const [displayValue, setDisplayValue] = useState(0);
  const motionValue = useMotionValue(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.1,
      ease: "easeIn",
      onUpdate: (latest) => {
        setDisplayValue(latest);
      },
    });

    return controls.stop;
  }, [value, motionValue]);

  return (
    <span
      className={`${uiSans.className} font-bold tracking-tight ${
        !estado &&
        "opacity-80 blur-xl transition-all duration-300 hover:blur-none"
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
