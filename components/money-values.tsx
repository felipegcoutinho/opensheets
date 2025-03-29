"use client";

import { usePrivacy } from "@/hooks/privacy-context";

function MoneyValues({ value }) {
  const { estado, setEstado } = usePrivacy();

  return (
    <span
      className={`${!estado && "opacity-80 blur-xl transition-all duration-300 hover:blur-none"} `}
    >
      {Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
    </span>
  );
}

export default MoneyValues;
