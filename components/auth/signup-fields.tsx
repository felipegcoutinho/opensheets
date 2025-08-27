"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { SubmitButton } from "@/components/submit-button";

type Props = {
  pendingText?: string;
  formAction: any;
};

export default function SignupFields({ pendingText = "Criando conta...", formAction }: Props) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const requirements = useMemo(() => {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const minLen = password.length >= 6; // alinhado ao placeholder
    const matches = password.length > 0 && confirm.length > 0 && password === confirm;

    return {
      hasLower,
      hasUpper,
      hasDigit,
      hasSymbol,
      minLen,
      matches,
      isValid: hasLower && hasUpper && hasDigit && hasSymbol && minLen && matches,
    };
  }, [password, confirm]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <div className="grid gap-2">
          <Label htmlFor="first_name">Primeiro nome</Label>
          <Input id="first_name" name="first_name" placeholder="Ex.: Felipe" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="last_name">Sobrenome</Label>
          <Input id="last_name" name="last_name" placeholder="Ex.: Coutinho" required />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Senha</Label>
        <PasswordInput
          id="password"
          name="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="text-xs mt-1 text-muted-foreground">
          <p className="mb-1">A senha deve conter:</p>
          <ul className="grid gap-1">
            <Requirement ok={requirements.minLen}>Mínimo de 6 caracteres</Requirement>
            <Requirement ok={requirements.hasLower}>Letras minúsculas</Requirement>
            <Requirement ok={requirements.hasUpper}>Letras maiúsculas</Requirement>
            <Requirement ok={requirements.hasDigit}>Dígitos</Requirement>
            <Requirement ok={requirements.hasSymbol}>Símbolos (recomendado)</Requirement>
          </ul>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirm">Confirmar senha</Label>
        <PasswordInput
          id="confirm"
          name="confirm"
          placeholder="Repita a senha"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        {confirm.length > 0 && !requirements.matches && (
          <p className="text-xs text-destructive">As senhas não coincidem.</p>
        )}
      </div>

      <SubmitButton
        pendingText={pendingText}
        className="mt-2"
        disabled={!requirements.isValid}
        formAction={formAction}
      >
        Criar conta
      </SubmitButton>
    </div>
  );
}

function Requirement({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className={ok ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
      {ok ? "✓" : "-"} {children}
    </li>
  );
}
