"use client";

import { uiSans } from "@/app/fonts/font";
import { usePrivacy } from "@/hooks/privacy-context";
import { Skeleton } from "./ui/skeleton";

function Numbers({ number }) {
  const { estado, setEstado } = usePrivacy();

  return (
    <>
      {estado ? (
        <span className={`${uiSans.className} font-bold`}>
          {Number(number).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      ) : (
        <Skeleton className="h-5 w-16" />
      )}
    </>
  );
}

export default Numbers;
