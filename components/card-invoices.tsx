"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function CardInvoices({ title, subtitle, children }) {
  const [hasOverflow, setHasOverflow] = useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom =
      Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) <
      1;
    setHasOverflow(!isAtBottom);
  };

  return (
    <Card className="relative h-96 w-full overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {/* <CardDescription>{subtitle}</CardDescription> */}
      </CardHeader>
      <CardContent
        className="scrollbar-hide max-h-[calc(100%-5rem)] overflow-y-auto pr-4"
        onScroll={handleScroll}
      >
        {children}
      </CardContent>
      <div
        className={`pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent transition-opacity duration-300 dark:from-zinc-900 ${
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
