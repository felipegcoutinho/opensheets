// Botão para retornar ao mês atual

"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface ReturnButtonProps {
  onClick: () => void;
  disabled?: boolean;
  href?: string;
}

const ReturnButton = React.memo(({ onClick, disabled, href }: ReturnButtonProps) => {
  if (href && !disabled) {
    return (
      <Button asChild className="w-52 disabled:opacity-50" size={"sm"}>
        <Link href={href} prefetch scroll={false} onClick={onClick}>
          Retornar ao Mês Atual
        </Link>
      </Button>
    )
  }

  return (
    <Button
      className="w-52 disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
      size={"sm"}
    >
      Retornar ao Mês Atual
    </Button>
  )
});

export default ReturnButton;
