"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CardInvoices({ title, children }) {
  return (
    <Card className="relative h-96 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-sm uppercase dark:text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="scrollbar-hide max-h-[calc(100%-5rem)] overflow-y-auto pr-4">
        {children}
      </CardContent>
    </Card>
  );
}
