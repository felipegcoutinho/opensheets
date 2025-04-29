"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Widget({ title, subtitle, children }) {
  return (
    <Card className="max-h-custom-height-1 relative overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm lowercase">
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="scrollbar-hide max-h-[calc(100%-5rem)] overflow-y-auto">
        {children}
      </CardContent>
    </Card>
  );
}
