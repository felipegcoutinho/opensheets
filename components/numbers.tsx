"use client";

import { uiSans } from "@/app/fonts/font";
import { usePrivacy } from "@/hooks/privacy-context";

function Numbers({ number }) {
  const { estado, setEstado } = usePrivacy();

  return (
    <>
      <span
        className={`font-bold ${uiSans.className} ${!estado && "opacity-80 blur-xl transition-all duration-300 hover:blur-none"} `}
      >
        {Number(number).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </span>
    </>
  );
}

export default Numbers;
