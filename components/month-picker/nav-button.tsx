"use client";

import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import React from "react";
import Link from "next/link";

interface NavigationButtonProps {
  direction: "left" | "right";
  disabled?: boolean;
  href?: string;
  onClick?: () => void; // compat
}

const NavigationButton = React.memo(
  ({ onClick, direction, disabled, href }: NavigationButtonProps) => {
    const Icon = direction === "left" ? RiArrowLeftSLine : RiArrowRightSLine;

    if (href && !disabled) {
      return (
        <Link
          href={href}
          prefetch
          scroll={false}
          onClick={onClick}
          className="text-foreground cursor-pointer focus:outline-hidden disabled:opacity-50"
          aria-disabled={false}
        >
          <Icon size={16} />
        </Link>
      );
    }

    return (
      <button
        onClick={onClick}
        className="text-foreground cursor-pointer focus:outline-hidden disabled:opacity-50"
        disabled={disabled}
      >
        <Icon size={16} />
      </button>
    );
  },
);

export default NavigationButton;
