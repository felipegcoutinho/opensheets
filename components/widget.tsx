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

type WidgetProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  information?: string;
};

export default function Widget({
  title,
  subtitle,
  icon,
  children,
  information,
}: WidgetProps) {
  return (
    <Card className="h-custom-height-1 relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon}
          {title}
          <div className="ml-1">
            <Tooltip>
              <TooltipTrigger>
                <RiInformation2Fill size={16} className="text-muted" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="ml-1">{information}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm capitalize">
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="scrollbar-hide max-h-[calc(100%-5rem)] overflow-y-auto">
        {children}
      </CardContent>
    </Card>
  );
}
