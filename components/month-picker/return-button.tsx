// Botão para retornar ao mês atual

"use client";

import { Button } from "../ui/button";
import React from "react";

interface ReturnButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const ReturnButton = React.memo(({ onClick, disabled }: ReturnButtonProps) => (
  <Button
    className="ml-2 cursor-pointer rounded disabled:opacity-50"
    size={"sm"}
    onClick={onClick}
    disabled={disabled}
    variant={"warning"}
  >
    <span className="px-2">Retornar ao Mês Atual</span>
  </Button>
));

export default ReturnButton;
