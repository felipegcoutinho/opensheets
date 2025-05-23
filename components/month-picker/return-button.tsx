// Botão para retornar ao mês atual

"use client";

import React from "react";
import { Button } from "../ui/button";

interface ReturnButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const ReturnButton = React.memo(({ onClick, disabled }: ReturnButtonProps) => (
  <Button
    className="ml-2 w-52 disabled:opacity-50"
    onClick={onClick}
    disabled={disabled}
    size={"sm"}
  >
    <span className="px-2">Retornar ao Mês Atual</span>
  </Button>
));

export default ReturnButton;
