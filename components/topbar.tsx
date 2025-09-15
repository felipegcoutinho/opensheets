"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useEntityNameStore } from "@/components/entity-name-store";

// Títulos amigáveis para cada segmento de rota do dashboard
const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  lancamento: "Lançamentos",
  calendario: "Calendário",
  cartao: "Cartões",
  conta: "Contas",
  orcamento: "Orçamentos",
  pagador: "Pagadores",
  categoria: "Categorias",
  anotacao: "Anotações",
  ajustes: "Ajustes",
  insight: "Insights",
};

export default function Topbar() {
  const pathname = usePathname();

  // Quebra a URL em segmentos (sem strings vazias)
  const parts = pathname.split("/").filter(Boolean);

  // Remove "dashboard" dos segmentos dinâmicos para evitar duplicidade
  const dynamicParts = parts[0] === "dashboard" ? parts.slice(1) : parts;

  // Detecta quando é rota de detalhe e busca nome amigável
  const entityType = dynamicParts[0];
  const entityId = dynamicParts[1];
  const { name: contextName } = useEntityNameStore();
  const entityName = React.useMemo(() => {
    const n = contextName;
    return typeof n === "string" && n.trim().length > 0 ? n : null;
  }, [contextName]);

  // Sempre começa com o breadcrumb do Dashboard
  type Crumb = { href: string; label: string; isLast: boolean };
  const crumbs: Crumb[] = [];

  // Determina se a página atual é o próprio /dashboard
  const isOnlyDashboard =
    dynamicParts.length === 0 || parts.join("/") === "dashboard";

  crumbs.push({
    href: "/dashboard",
    label: LABELS.dashboard,
    isLast: isOnlyDashboard,
  });

  // Constrói os demais breadcrumbs com base na URL atual (sem prefixar "/dashboard" nos links)
  let hrefAcc = "";
  dynamicParts.forEach((seg, idx) => {
    hrefAcc += `/${seg}`;
    const isLast = idx === dynamicParts.length - 1;
    const isDetailId =
      idx === 1 && ["conta", "pagador", "cartao"].includes(dynamicParts[0]);
    const label = isDetailId ? (entityName ?? "—") : (LABELS[seg] ?? seg);
    crumbs.push({ href: hrefAcc, label, isLast });
  });

  return (
    <header className="bg-background/70 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 mb-4 flex h-16 items-center gap-2 border-b px-4 backdrop-blur">
      <div className="flex min-w-0 flex-col">
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((c, i) => (
              <React.Fragment key={c.href}>
                <BreadcrumbItem>
                  {c.isLast ? (
                    <BreadcrumbPage>{c.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={c.href}>{c.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {i < crumbs.length - 1 ? <BreadcrumbSeparator /> : null}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto" />
    </header>
  );
}
