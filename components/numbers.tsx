"use client";

import { AtlasGrotesk } from "@/app/fonts/font";
import { usePrivacy } from "@/hooks/privacy-context";

function Numbers({ value }) {
  const { estado, setEstado } = usePrivacy();

  return (
    <span
      className={`font-bold tracking-tighter ${AtlasGrotesk.className} ${!estado && "opacity-80 blur-xl transition-all duration-300 hover:blur-none"} `}
    >
      {Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
    </span>
  );
}

export default Numbers;
