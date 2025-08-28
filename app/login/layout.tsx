import Logo from "@/components/logo";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "opensheets | login",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage({ children }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Painel de marca/ilustração (esquerda) */}
      <aside className="relative hidden lg:flex flex-col overflow-hidden pixelated-bg p-10 text-sidebar-foreground">
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-center gap-3">
          <Link href="/">
            <Logo />
          </Link>
          </div>

          <div className="mt-auto">
            <h1 className="text-3xl font-bold leading-tight text-primary">Organize seus pagamentos com clareza</h1>
            <p className="mt-2 max-w-md text-sidebar-foreground/80">
              Painéis, transações e lembretes em um único lugar. Simples, rápido e seguro.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-sidebar-foreground/90">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs">✓</span>
                Controle de pagamentos e status em tempo real
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs">✓</span>
                Envio de e-mails automáticos para pagadores
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs">✓</span>
                Relatórios e insights organizados
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Área do formulário (direita) */}
      <main className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
