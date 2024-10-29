"use client";

import { uiSans } from "@/app/fonts/font";
import { usePrivacy } from "@/hooks/privacy-context";

function Numbers({ number }) {
  const { estado, setEstado } = usePrivacy();

  return (
    <>
      <span
        className={`${uiSans.className} ${!estado && "opacity-50 blur"} font-bold`}
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
