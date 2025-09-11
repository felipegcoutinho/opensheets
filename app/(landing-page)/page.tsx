import { getUserSession } from "@/app/actions/users/fetch_users";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Index({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  // Se vier de links de confirmação (code/message), redireciona para a tela dedicada
  if (sp?.code || sp?.message || sp?.error || sp?.error_description) {
    const params = new URLSearchParams();
    if (typeof sp.code === "string") params.set("code", sp.code);
    if (typeof sp.message === "string") params.set("message", sp.message);
    if (typeof sp.error === "string") params.set("error", sp.error);
    if (typeof sp.error_description === "string") params.set("error_description", sp.error_description);
    // Se houver code, envia direto ao Route Handler que pode modificar cookies
    if (params.get("code")) {
      redirect(`/auth/confirm/complete?${params.toString()}`);
    } else {
      redirect(`/auth/confirm?${params.toString()}`);
    }
  }

  const session = await getUserSession();
  const isLoggedIn = Boolean((session as any)?.id);

  return (
    <div className="flex flex-col gap-20 pt-28">
      <section className="mx-auto max-w-4xl text-center">
        <Badge variant="outline" className="mb-4">
          Controle financeiro simples
        </Badge>
        <h1 className="mb-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          O opensheets ajuda você a acompanhar receitas, despesas, contas e
          cartões em um só lugar
        </h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-balance">
          Visualize métricas, acompanhe pagamentos e mantenha o orçamento sob
          controle.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {isLoggedIn ? (
            <Button asChild size="lg" className="shadow-sm">
              <Link href="/dashboard">Acesse seu dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg" className="shadow-sm">
                <Link href="/login/signup">Começar agora</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Fazer login</Link>
              </Button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
