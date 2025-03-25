"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { usePrivacy } from "../hooks/privacy-context";

export default function PrivacySwitch() {
  const { estado, setEstado } = usePrivacy();
  const [mounted, setMounted] = useState(false);

  // Componente só deve ser renderizado após montagem para evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleEstado = () => {
    setEstado(!estado);
  };

  return (
    <div className="flex flex-1 justify-end">
      {mounted ? (
        <Switch checked={estado} onCheckedChange={toggleEstado} />
      ) : (
        <Skeleton className="h-4 w-8 rounded-full" />
      )}
    </div>
  );
}
