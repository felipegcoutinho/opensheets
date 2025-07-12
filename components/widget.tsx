"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RiInformation2Fill } from "@remixicon/react";
import MoneyValues from "./money-values";

type WidgetProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  information?: string;
  saldo?: number;
};

export default function Widget({
  title,
  subtitle,
  icon,
  children,
  information,
  saldo,
}: WidgetProps) {
  return (
    <Card className="h-custom-height-1 relative overflow-hidden">
      <CardHeader>
        <div className="flex w-full items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {icon}
              {title}
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1 text-sm capitalize">
              {subtitle}
            </CardDescription>
          </div>

          {saldo !== undefined && (
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <span>Saldo Geral</span>
              <MoneyValues value={saldo} />
              {information && (
                <Tooltip>
                  <TooltipTrigger>
                    <RiInformation2Fill size={16} className="text-muted" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="ml-1">{information}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="scrollbar-hide max-h-[calc(100%-5rem)] overflow-y-auto">
        {children}
      </CardContent>
    </Card>
  );
}
