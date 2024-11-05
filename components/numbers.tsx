"use client";

import { uiSans } from "@/app/fonts/font";
import { usePrivacy } from "@/hooks/privacy-context";

function Numbers({ number }) {
  const { estado, setEstado } = usePrivacy();

  return (
    <>
      <span
        className={`${uiSans.className} ${!estado && "font-bold opacity-80 blur-xl transition-all duration-300 hover:blur-none"} `}
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
