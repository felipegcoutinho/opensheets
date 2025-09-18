import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type React from "react";
import { redirect } from "next/navigation";

type Search = Record<string, string | string[] | undefined>;

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;

  const code = typeof sp.code === "string" ? sp.code : undefined;
  const message = typeof sp.message === "string" ? sp.message : undefined;
  const error = typeof sp.error === "string" ? sp.error : undefined;
  const errorDescription =
    typeof sp.error_description === "string"
      ? sp.error_description
      : undefined;
  const status = typeof sp.status === "string" ? sp.status : undefined;

  let title = "Confirmação de alteração de e-mail";
  let description: React.ReactNode =
    "Siga as instruções abaixo para concluir a alteração.";

  if (code) {
    const params = new URLSearchParams();
    params.set("code", code);
    redirect(`/auth/confirm/complete?${params.toString()}`);
  } else if (message) {
    title = "Link aceito. Continue a confirmação";
    description = (
      <>
        <p>
          Recebemos a primeira confirmação. Agora finalize clicando no link que
          enviamos para o <strong>outro e-mail</strong>.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Mensagem do provedor: {message}
        </p>
      </>
    );
  } else if (status === "success") {
    title = "E-mail confirmado com sucesso";
    description = <p>Pronto! Sua alteração foi confirmada.</p>;
  } else if (error || errorDescription) {
    title = "Não foi possível confirmar";
    description =
      errorDescription || error || "Falha ao validar o link de confirmação.";
  }

  return (
    <div className="mx-auto mt-16 max-w-xl space-y-6">
      <Alert>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>

      {status === "success" ? (
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/dashboard">Ir para o dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Voltar para a tela de login</Link>
          </Button>
        </div>
      ) : (
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/">Voltar para a tela de login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Fazer login</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
