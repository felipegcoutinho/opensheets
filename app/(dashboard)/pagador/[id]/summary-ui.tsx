import { Card } from "@/components/ui/card";
import MoneyValues from "@/components/money-values";
import React from "react";

export function SectionCard({
  title,
  icon,
  total,
  children,
  "aria-label": ariaLabel,
}: {
  title: string;
  icon: React.ReactNode;
  total: number;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  return (
    <Card className="p-4" aria-label={ariaLabel ?? title}>
      <SummaryHeader icon={icon} title={title} total={total} />
      <div className="mt-2 space-y-1">{children}</div>
    </Card>
  );
}

export function SummaryHeader({
  icon,
  title,
  total,
}: {
  icon: React.ReactNode;
  title: string;
  total: number;
}) {
  return (
    <div className="text-muted-foreground flex items-center justify-between text-xs">
      <span className="flex items-center gap-1">
        {icon}
        <span className="font-medium">{title}</span>
      </span>
      <span className="text-sm font-semibold">
        <MoneyValues value={total} />
      </span>
    </div>
  );
}

export function SummaryRow({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex min-w-0 items-center gap-2">{left}</span>
      <span className="shrink-0">{right}</span>
    </div>
  );
}
