"use client";

import { UseDates } from "@/hooks/use-dates"; // Hook para obter a data atual
import clsx from "clsx"; // Biblioteca para facilitar o gerenciamento de classes CSS condicionalmente
import { ArrowDownUpIcon, BadgeCentIcon, CreditCard, File, Home, NotebookPenIcon, PiggyBank, Users } from "lucide-react"; // Ícones
import Link from "next/link"; // Componente de Link do Next.js
import { usePathname, useSearchParams } from "next/navigation"; // Hooks do Next.js para obter pathname e parâmetros de busca

function LinkOnHeader({ user }) {
  // Obtém o nome do mês e o ano atual a partir do hook UseDates
  const { currentMonthName, currentYear } = UseDates();

  // Hooks do Next.js para obter o caminho atual e os parâmetros de busca da URL
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isHomePage = pathname === "/";

  // Obtém o valor de 'periodo' da query string, ou usa o mês e ano atuais se não houver
  let month = searchParams.get("periodo") || `${currentMonthName}-${currentYear}`;

  // Se não houver usuário ou estiver na página inicial, retorna null e não renderiza nada
  if (!user || isHomePage) return null;

  // Lista de links a serem exibidos no header
  const links = [
    { href: `/dashboard?periodo=${month}`, Icon: Home, name: "Home" },
    { href: `/transacao?periodo=${month}`, Icon: ArrowDownUpIcon, name: "Transações" },
    { href: `/boleto?periodo=${month}`, Icon: File, name: "Boletos" },
    { href: `/cartao`, Icon: CreditCard, name: "Cartões" },
    { href: `/conta`, Icon: PiggyBank, name: "Contas" },
    { href: `/responsavel?periodo=${month}`, Icon: Users, name: "Responsáveis" },
    { href: `/anotacao?periodo=${month}`, Icon: NotebookPenIcon, name: "Anotações" },
  ];

  // Adiciona um link de Investimentos apenas para o usuário específico
  if (user.email === "coutinho@outlook.com") {
    links.push({ href: `/investimentos`, Icon: BadgeCentIcon, name: "Investimentos" });
  }

  return (
    <>
      {links.map(({ href, Icon, name }) => (
        <Link key={href} href={href}>
          <LinkNavButton Icon={Icon} LinkName={name} isActive={pathname === href} />
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
