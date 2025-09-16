"use client";

import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { usePrivacy } from "../hooks/privacy-context";

export default function PrivacySwitch() {
  const { estado, setEstado } = usePrivacy();
  const [mounted, setMounted] = useState(false);

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
        <div className="bg-muted-foreground/20 h-4 w-8 rounded-full" />
      )}
    </div>
  );
}
