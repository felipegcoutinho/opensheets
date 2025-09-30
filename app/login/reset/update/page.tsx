"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordUpdatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      // Ao abrir pelo link de recuperação, o hash na URL contém o access_token.
      // O supabase-js processa esse hash na primeira chamada e estabelece a sessão.
      await supabase.auth.getSession();
      const { data } = await supabase.auth.getUser();
      setHasSession(!!data.user);
      setLoading(false);
    };
    run();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold">
              Redefinir senha
            </CardTitle>
            <CardDescription className="text-muted-foreground normal-case">
              Preparando o formulário...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-10">
            <Spinner className="h-6 w-6" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold">Link inválido</CardTitle>
            <CardDescription className="text-muted-foreground normal-case">
              O link de redefinição é inválido ou expirou.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link
              href="/login/reset"
              className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-2"
            >
              Solicitar novo link
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password") || "");
    const confirm = String(formData.get("confirm") || "");

    if (!password || !confirm) {
      toast.error("Preencha os campos de senha");
      setSubmitting(false);
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas não coincidem");
      setSubmitting(false);
      return;
    }
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      setSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast.error(error.message || "Não foi possível atualizar a senha");
        return;
      }
      // Encerra a sessão de recuperação e direciona para login
      await supabase.auth.signOut();
      toast.success("Senha atualizada com sucesso!");
      const msg = encodeURIComponent(
        "Senha atualizada com sucesso! Faça login para continuar.",
      );
      router.replace(`/login?success=${msg}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">
            Definir nova senha
          </CardTitle>
          <CardDescription className="text-muted-foreground normal-case">
            Informe e confirme sua nova senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Nova senha</Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="Mínimo de 6 caracteres"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm">Confirmar nova senha</Label>
              <PasswordInput
                id="confirm"
                name="confirm"
                placeholder="Repita a senha"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="size-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Atualizando...
                </span>
              ) : (
                "Atualizar senha"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-2"
            >
              Voltar para login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
