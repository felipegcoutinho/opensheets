import { getUserSession } from "@/app/actions/users/fetch_users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Index() {
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
