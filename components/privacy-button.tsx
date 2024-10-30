"use client";
import { Eye, EyeOff } from "lucide-react";
import { usePrivacy } from "../hooks/privacy-context";

export default function PrivacyButton() {
  const { estado, setEstado } = usePrivacy();

  const toggleEstado = () => {
    setEstado(!estado);
  };

  return (
    <>
      {estado ? (
        <Eye
          className="h-[1.2rem] w-[1.2rem] cursor-pointer transition-all"
          onClick={toggleEstado}
        />
      ) : (
        <EyeOff
          className="h-[1.2rem] w-[1.2rem] cursor-pointer text-neutral-600 transition-all"
          onClick={toggleEstado}
        />
      )}
    </>
  );
}
