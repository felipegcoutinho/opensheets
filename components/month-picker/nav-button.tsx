// Componente de botão para navegação entre os meses (anterior/próximo)

"use client";

import ChevronLeft from "remixicon-react/ArrowLeftSLineIcon";
import ChevronRight from "remixicon-react/ArrowRightSLineIcon";
import React from "react";

interface NavigationButtonProps {
  onClick: () => void;
  direction: "left" | "right";
  disabled?: boolean;
}

const NavigationButton = React.memo(
  ({ onClick, direction, disabled }: NavigationButtonProps) => {
    const Icon = direction === "left" ? ChevronLeft : ChevronRight;
    return (
      <button
        onClick={onClick}
        className="text-primary cursor-pointer focus:outline-hidden disabled:opacity-50"
        disabled={disabled}
      >
        <Icon size={16} />
      </button>
    );
  },
);

export default NavigationButton;
