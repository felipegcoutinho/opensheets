"use client";

import { UseDates } from "@/hooks/use-dates"; // Hook para obter a data atual
import clsx from "clsx"; // Biblioteca para facilitar o gerenciamento de classes CSS condicionalmente
import { ArrowDownUpIcon, BadgeCentIcon, CreditCard, File, Home, NotebookPenIcon, PiggyBank, Users } from "lucide-react"; // Ícones
import Link from "next/link"; // Componente de Link do Next.js
import { usePathname, useSearchParams } from "next/navigation"; // Hooks do Next.js para obter pathname e parâmetros de busca

function LinkOnHeader({ user }) {
  const { currentMonthName, currentYear } = UseDates();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isHomePage = pathname === "/";

  let month = searchParams.get("periodo") || `${currentMonthName}-${currentYear}`;

  if (!user || isHomePage) return null;

  const links = [
    { href: `/dashboard?periodo=${month}`, Icon: Home, name: "Home", path: "/dashboard" },
    { href: `/transacao?periodo=${month}`, Icon: ArrowDownUpIcon, name: "Transações", path: "/transacao" },
    { href: `/boleto?periodo=${month}`, Icon: File, name: "Boletos", path: "/boleto" },
    { href: `/cartao`, Icon: CreditCard, name: "Cartões", path: "/cartao" },
    { href: `/conta`, Icon: PiggyBank, name: "Contas", path: "/conta" },
    { href: `/responsavel?periodo=${month}`, Icon: Users, name: "Responsáveis", path: "/responsavel" },
    { href: `/anotacao?periodo=${month}`, Icon: NotebookPenIcon, name: "Anotações", path: "/anotacao" },
  ];

  if (user.email === "coutinho@outlook.com") {
    links.push({ href: `/investimentos`, Icon: BadgeCentIcon, name: "Investimentos", path: "/investimentos" });
  }

  return (
    <>
      {links.map(({ href, Icon, name, path }) => (
        <Link key={href} href={href}>
          <LinkNavButton Icon={Icon} LinkName={name} isActive={pathname === path} />
        </Link>
      ))}
    </>
  );
}

export default LinkOnHeader;

export function LinkNavButton({ Icon, LinkName, isActive }) {
  return (
    <span
      className={clsx(
        "flex items-center gap-1 transition-colors duration-200",
        isActive
          ? "text-emerald-600 dark:text-orange-600" // Estilo para link ativo
          : "text-neutral-900 hover:text-orange-600 dark:text-white" // Estilo para link inativo
      )}
    >
      <Icon size={16} />
      <span>{LinkName}</span>
    </span>
  );
}
