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
import ProgressiveBlur from "./magicui/progressive-blur";
import MoneyValues from "./money-values";

type WidgetProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  saldo_information?: string;
  information?: string;
  saldo?: number;
};

export default function Widget({
  title,
  subtitle,
  icon,
  children,
  saldo_information,
  saldo,
  information,
}: WidgetProps) {
  return (
    <Card className="h-custom-height-1 relative overflow-hidden">
      <CardHeader>
        <div className="flex w-full items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-1">
              {icon}
              {title}
              {information && (
                <Tooltip>
                  <TooltipTrigger>
                    <RiInformation2Fill
                      size={16}
                      className="text-muted-foreground/40"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="ml-1">{information}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1 text-sm capitalize">
              {subtitle}
            </CardDescription>
          </div>

          {saldo !== undefined && (
            <div className="flex items-center gap-1 text-sm">
              <span>Saldo Geral</span>
              <MoneyValues value={saldo} />
              {saldo_information && (
                <Tooltip>
                  <TooltipTrigger>
                    <RiInformation2Fill
                      size={16}
                      className="text-muted-foreground/40"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="ml-1">{saldo_information}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="scrollbar-hide max-h-[calc(100%-5rem)] overflow-y-auto">
        {children}
        <ProgressiveBlur height="10%" position="bottom" />
      </CardContent>
    </Card>
  );
}
