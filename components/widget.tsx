"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type WidgetProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  icon: React.ReactNode;
};

export default function Widget({
  title,
  subtitle,
  icon,
  children,
}: WidgetProps) {
  return (
    <Card className="h-custom-height-1 relative overflow-hidden">
      <CardHeader>
        <CardTitle>
          {icon}
          {title}
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
