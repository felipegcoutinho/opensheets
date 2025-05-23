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
    className="w-52 disabled:opacity-50"
    onClick={onClick}
    disabled={disabled}
    size={"sm"}
  >
    Retornar ao Mês Atual
  </Button>
));

export default ReturnButton;
