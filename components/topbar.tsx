"use client";

import { CalculatorDialogButton } from "@/components/calculator/calculator-dialog";
import { useEntityNameStore } from "@/components/entity-name-store";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  RiArrowUpDownLine,
  RiBankCardLine,
  RiBankLine,
  RiBook2Line,
  RiCalendarLine,
  RiFileList2Line,
  RiGroupLine,
  RiLayout5Line,
  RiMoneyDollarCircleLine,
  RiSettings2Line,
  RiSparkling2Line,
} from "@remixicon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

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

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const ICON_MAP: Partial<Record<string, IconType>> = {
  dashboard: RiLayout5Line,
  lancamento: RiArrowUpDownLine,
  calendario: RiCalendarLine,
  cartao: RiBankCardLine,
  conta: RiBankLine,
  orcamento: RiMoneyDollarCircleLine,
  pagador: RiGroupLine,
  categoria: RiFileList2Line,
  anotacao: RiBook2Line,
  ajustes: RiSettings2Line,
  insight: RiSparkling2Line,
};

export default function Topbar() {
  const pathname = usePathname();

  // Quebra a URL em segmentos (sem strings vazias)
  const parts = pathname.split("/").filter(Boolean);

  // Remove "dashboard" dos segmentos dinâmicos para evitar duplicidade
  const dynamicParts = parts[0] === "dashboard" ? parts.slice(1) : parts;

  // Detecta quando é rota de detalhe e busca nome amigável
  const { name: contextName } = useEntityNameStore();
  const entityName = React.useMemo(() => {
    const n = contextName;
    return typeof n === "string" && n.trim().length > 0 ? n : null;
  }, [contextName]);

  // Sempre começa com o breadcrumb do Dashboard
  type Crumb = {
    href: string;
    label: string;
    isLast: boolean;
    icon?: IconType;
  };
  const crumbs: Crumb[] = [];

  // Determina se a página atual é o próprio /dashboard
  const isOnlyDashboard =
    dynamicParts.length === 0 || parts.join("/") === "dashboard";

  crumbs.push({
    href: "/dashboard",
    label: LABELS.dashboard,
    isLast: isOnlyDashboard,
    icon: ICON_MAP.dashboard,
  });

  const rootSegment = dynamicParts[0] ?? null;
  const decodeSegment = (value: string) => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };

  const categoryNameFromUrl =
    rootSegment === "categoria" && dynamicParts.length >= 3
      ? decodeSegment(dynamicParts[2])
      : null;

  const segmentsToRender =
    rootSegment === "categoria" && dynamicParts.length > 1
      ? dynamicParts.slice(0, 2)
      : dynamicParts;

  const detailRoots = new Set(["conta", "pagador", "cartao", "categoria"]);

  // Constrói os demais breadcrumbs com base na URL atual (sem prefixar "/dashboard" nos links)
  let hrefAcc = "";
  segmentsToRender.forEach((seg, idx) => {
    hrefAcc += `/${seg}`;
    const isLast = idx === segmentsToRender.length - 1;
    const isDetailId = idx === 1 && rootSegment && detailRoots.has(rootSegment);
    const fallbackLabel = LABELS[seg] ?? decodeSegment(seg);
    const label = isDetailId
      ? (entityName ?? categoryNameFromUrl ?? fallbackLabel)
      : fallbackLabel;
    const iconKey = isDetailId ? rootSegment : seg;
    crumbs.push({
      href: hrefAcc,
      label,
      isLast,
      icon: iconKey ? ICON_MAP[iconKey] : undefined,
    });
  });

  return (
    <header className="bg-background/70 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-10 mb-0 flex h-16 items-center gap-2 px-4 backdrop-blur-xs">
      <div className="flex min-w-0 flex-col">
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((c, i) => {
              const Icon = c.icon;

              return (
                <React.Fragment key={c.href}>
                  <BreadcrumbItem>
                    {c.isLast ? (
                      <BreadcrumbPage className="flex min-w-0 items-center gap-1.5 text-sm font-medium">
                        {Icon ? (
                          <Icon className="text-muted-foreground h-4 w-4 shrink-0" />
                        ) : null}
                        <span className="truncate break-words">{c.label}</span>
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        asChild
                        className="flex min-w-0 items-center gap-1.5 text-sm font-medium"
                      >
                        <Link href={c.href}>
                          {Icon ? (
                            <Icon className="text-muted-foreground h-4 w-4 shrink-0" />
                          ) : null}
                          <span className="truncate break-words">
                            {c.label}
                          </span>
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {i < crumbs.length - 1 ? <BreadcrumbSeparator /> : null}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <CalculatorDialogButton />
      </div>
    </header>
  );
}
