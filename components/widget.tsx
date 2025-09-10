"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RiExpandDiagonalLine, RiInformation2Fill } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";
import { title_font } from "../app/fonts/font";
import MoneyValues from "./money-values";
import { Button } from "./ui/button";

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
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const THRESHOLD = 16; // px para evitar falsos positivos

    const check = () => {
      const has = el.scrollHeight - el.clientHeight > THRESHOLD;
      setHasOverflow(has);
    };

    // checagem inicial e após layout
    const raf = requestAnimationFrame(check);

    // observa resize do container e mudanças no conteúdo
    const ro = new ResizeObserver(check);
    ro.observe(el);
    const mo = new MutationObserver(check);
    mo.observe(el, { childList: true, subtree: true, characterData: true });

    window.addEventListener("resize", check);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <Card className="h-custom-height-1 relative overflow-hidden">
      <CardHeader>
        <div className="flex w-full items-start justify-between">
          <div>
            <CardTitle
              className={`${title_font.className} flex items-center gap-1`}
            >
              {icon}
              <span>{title}</span>
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
      <CardContent
        ref={contentRef}
        className="max-h-[calc(100%-5rem)] overflow-hidden"
      >
        {children}
      </CardContent>

      {hasOverflow && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-[var(--card)] to-transparent pt-12 pb-6">
          <Button
            variant="outline"
            className="pointer-events-auto rounded-full text-xs"
            onClick={() => setIsOpen(true)}
          >
            Mostrar mais <RiExpandDiagonalLine size={10} />
          </Button>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[85vh] w-full max-w-3xl overflow-hidden p-0">
          <DialogHeader className="px-6 pt-4">
            <DialogTitle className="flex items-center gap-2">
              {icon}
              <span>{title}</span>
            </DialogTitle>
            {subtitle ? (
              <p className="text-muted-foreground text-sm">{subtitle}</p>
            ) : null}
          </DialogHeader>
          <div className="scrollbar-hide max-h-[calc(85vh-6rem)] overflow-y-auto px-6 pb-6">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
