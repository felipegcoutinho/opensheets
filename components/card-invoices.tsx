"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function CardInvoices({ title, subtitle, children }) {
  const [hasOverflow, setHasOverflow] = useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 1;
    setHasOverflow(!isAtBottom);
  };

  return (
    <Card className="h-96 w-full relative overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[calc(100%-5rem)] pr-4 space-y-2 scrollbar-hide" onScroll={handleScroll}>
        {children}
      </CardContent>
      <div
        className={`absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none transition-opacity duration-300 ${
          hasOverflow ? "opacity-100" : "opacity-0"
        }`}
      />
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </Card>
  );
}
