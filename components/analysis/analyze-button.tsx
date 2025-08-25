"use client";
import { Button } from "@/components/ui/button";
import { RiLoader2Line, RiMagicLine } from "@remixicon/react";

export function AnalyzeButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className="mt-2 mb-4 transition-all hover:scale-110"
      aria-busy={loading}
    >
      <div className="flex items-center justify-center gap-2">
        {loading ? (
          <>
            <RiLoader2Line className="h-4 w-4 animate-spin" />
            <span>Aguarde, analisando...</span>
          </>
        ) : (
          <>
            <RiMagicLine className="h-4 w-4" />
            <span>Analisar minhas finanças com IA</span>
          </>
        )}
      </div>
    </Button>
  );
}
