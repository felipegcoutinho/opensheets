import Logo from "@/components/logo";
import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthenticationShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <aside className="bg-banner-background text-banner-foreground hidden flex-col p-10 lg:flex">
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <div className="mt-auto">
            <h1 className="text-3xl leading-tight">
              Organize seus pagamentos com clareza
            </h1>
            <p className="mt-2 max-w-md">
              Painéis, transações e lembretes em um único lugar. Simples, rápido
              e seguro.
            </p>
            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="bg-muted-foreground inline-flex h-5 w-5 items-center justify-center rounded-full text-xs">
                  ✓
                </span>
                Controle de pagamentos e status em tempo real
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-muted-foreground inline-flex h-5 w-5 items-center justify-center rounded-full text-xs">
                  ✓
                </span>
                Envio de e-mails automáticos para pagadores
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-muted-foreground inline-flex h-5 w-5 items-center justify-center rounded-full text-xs">
                  ✓
                </span>
                Relatórios e insights organizados
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
