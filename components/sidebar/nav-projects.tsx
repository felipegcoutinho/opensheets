"use client";
import CreateBills from "@/app/(dashboard)/boleto/modal/create-bills";
import CreateTransactions from "@/app/(dashboard)/lancamentos/modal/create-transactions";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { PlusSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";
import { Button } from "../ui/button";

export const NavProjects = memo(function NavProjects({
  links,
  cartoes,
  contas,
  categorias,
  title = "Menu",
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-muted-foreground text-sm">
        {title}
      </SidebarGroupLabel>
      <SidebarMenu className="mt-1">
        {links.map((item) => {
          const isActive = pathname.startsWith(item.url.split("?")[0]);

          return (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                className={`hover:bg-contrast/30 active:bg-contrast ${isActive && "bg-muted-foreground/10"}`}
                asChild
              >
                <div className="flex w-full items-center justify-between">
                  <Link
                    href={item.url}
                    className={`flex items-center gap-2 transition-all ${
                      isActive ? "text-violet-500" : "text-accent-foreground"
                    } `}
                  >
                    <item.icon
                      className={`h-4 w-4 ${
                        isActive ? "text-violet-500" : "text-muted-foreground"
                      }`}
                    />
                    <p>{item.name}</p>
                  </Link>

                  {item.name === "lançamentos" && (
                    <CreateTransactions
                      getCards={cartoes}
                      getAccount={contas}
                      getCategorias={categorias}
                    >
                      <Button
                        className="transition-all hover:scale-110"
                        size="icon"
                        variant="link"
                      >
                        <PlusSquare
                          className="text-muted-foreground"
                          size={18}
                        />
                      </Button>
                    </CreateTransactions>
                  )}

                  {item.name === "boletos" && (
                    <CreateBills
                      getAccountMap={contas}
                      getCategorias={categorias}
                    >
                      <Button
                        className="transition-all hover:scale-110"
                        size="icon"
                        variant="link"
                      >
                        <PlusSquare
                          className="text-muted-foreground"
                          size={18}
                        />
                      </Button>
                    </CreateBills>
                  )}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
});
