import type { ReactNode } from "react";
import Logo from "@/components/logo";
import Link from "next/link";

export default function AuthenticationShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <aside className="text-sidebar-foreground bg-secondary relative hidden flex-col overflow-hidden p-10 lg:flex">
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <div className="mt-auto">
            <h1 className="text-primary text-3xl leading-tight font-bold">
              Organize seus pagamentos com clareza
            </h1>
            <p className="text-sidebar-foreground/80 mt-2 max-w-md">
              Painéis, transações e lembretes em um único lugar. Simples, rápido e seguro.
            </p>
            <div className="text-sidebar-foreground/90 mt-6 grid gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="bg-primary/20 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs">
                  ✓
                </span>
                Controle de pagamentos e status em tempo real
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-primary/20 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs">
                  ✓
                </span>
                Envio de e-mails automáticos para pagadores
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-primary/20 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs">
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
