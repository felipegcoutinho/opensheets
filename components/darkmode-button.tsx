"use client";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita problemas de hidratação do servidor
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = (checked) => {
    setTheme(checked ? "dark" : "light");
  };

  // Só renderiza o switch depois do primeiro mount para evitar discrepância entre servidor e cliente
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={theme === "dark"}
        onCheckedChange={handleToggle}
        aria-label="Alternar tema"
      />
    </div>
  );
}
