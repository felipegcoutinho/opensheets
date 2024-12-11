"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

export default function CardInvoices({ title, children }) {
  const [hasOverflow, setHasOverflow] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        setHasOverflow(
          contentRef.current.scrollHeight > contentRef.current.clientHeight,
        );
      }
    };

    checkOverflow(); // Verifica inicialmente

    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [children]);

  const handleScroll = (e) => {
    const target = e.target;
    const atBottom =
      target.scrollHeight - target.clientHeight - target.scrollTop <= 1;
    setHasOverflow(!atBottom);
  };

  return (
    <Card className="relative h-96 w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-sm uppercase">{title}</CardTitle>
      </CardHeader>
      <CardContent
        ref={contentRef}
        className="scrollbar-hide max-h-[calc(100%-5rem)] overflow-y-auto pr-4"
        onScroll={handleScroll}
      >
        {children}
      </CardContent>
      {hasOverflow && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent dark:from-zinc-900" />
      )}
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
