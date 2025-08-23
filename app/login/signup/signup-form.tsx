"use client";

import { signup } from "@/app/actions/auth/auth";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function SignupForm() {
  const [password, setPassword] = useState("");

  const checks = useMemo(() => {
    const lower = /[a-z]/.test(password);
    const upper = /[A-Z]/.test(password);
    const digit = /\d/.test(password);
    const symbol = /[^A-Za-z0-9]/.test(password);
    const minLen = password.length >= 8;
    return { lower, upper, digit, symbol, minLen };
  }, [password]);

  const allPass =
    checks.lower && checks.upper && checks.digit && checks.symbol && checks.minLen;

  const item = (ok: boolean, label: string, hint?: string) => (
    <li className={ok ? "text-emerald-600" : "text-muted-foreground"}>
      <span className={`mr-2 inline-block h-2 w-2 rounded-full ${ok ? "bg-emerald-500" : "bg-zinc-300"}`} />
      <span className="font-medium">{label}</span>
      {hint ? <span className="ml-1 text-xs">{hint}</span> : null}
    </li>
  );

  return (
    <form className="text-foreground flex w-full flex-1 flex-col justify-center gap-2">
      <Label>Seu nome</Label>
      <div className="mb-3 flex gap-2">
        <Input placeholder="Primeiro nome" name="first_name" required />
        <Input placeholder="Sobrenome" name="last_name" required />
      </div>

      <Label>Email</Label>
      <Input name="email" placeholder="Digite seu email" className="mb-3" required />

      <Label>Senha</Label>
      <PasswordInput
        name="password"
        placeholder="Digite sua senha"
        className="mb-2"
        required
        onChange={(e) => setPassword(e.target.value)}
      />

      <ul className="mb-3 space-y-1 text-sm">
        {item(checks.minLen, "Pelo menos 8 caracteres")}
        {item(checks.lower, "Letra minúscula")}
        {item(checks.upper, "Letra maiúscula")}
        {item(checks.digit, "Número")}
        {item(checks.symbol, "Símbolo", "(recomendado)")}
      </ul>

      <SubmitButton formAction={signup as any} pendingText="Criando Conta..." disabled={!allPass}>
        Criar Conta
      </SubmitButton>

      <Button variant={"link"} asChild className="w-full">
        <Link href="/login">Voltar para Login</Link>
      </Button>
    </form>
  );
}
