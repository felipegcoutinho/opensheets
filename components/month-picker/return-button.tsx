"use client";

import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

interface ReturnButtonProps {
  onClick: () => void;
  disabled?: boolean;
  href?: string;
}

const ReturnButton = React.memo(
  ({ onClick, disabled, href }: ReturnButtonProps) => {
    if (href && !disabled) {
      return (
        <Button asChild className="w-36 disabled:opacity-50" size={"sm"}>
          <Link href={href} prefetch scroll={false} onClick={onClick}>
            Mês Atual
          </Link>
        </Button>
      );
    }

    return (
      <Button
        className="w-36 disabled:opacity-50"
        onClick={onClick}
        disabled={disabled}
        size={"sm"}
      >
        Mês Atual
      </Button>
    );
  },
);

export default ReturnButton;
