"use client";
import EmptyCard from "@/components/empty-card";
import Ping from "@/components/ping-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseDates } from "@/hooks/use-dates";
import { RiMailSendLine, RiVerifiedBadgeFill } from "@remixicon/react";
import Link from "next/link";
import UpdatePayer from "./modal/update-payer";
import DeletePayer from "./modal/delete-payer";

export default function TablePayers({ pagadores, avatars = [] as string[] }) {
  const { formatted_current_month } = UseDates();
  const month = formatted_current_month;

  const resolveFotoSrc = (foto?: string) => {
    if (!foto) return undefined;
    if (foto.startsWith("http")) return foto;
    if (foto.startsWith("/")) return foto;
    return `/avatars/${foto}`;
  };

  if (!pagadores || pagadores.length === 0) {
    return (
      <div className="col-span-full">
        <EmptyCard />
      </div>
    );
  }

  const renderGrid = (items: any[]) => {
    if (!items || items.length === 0) {
      return (
        <div className="col-span-full">
          <EmptyCard />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {items.map((item) => {
          const fotoSrc = resolveFotoSrc(item.foto);
          const initials = (item?.nome?.[0] || "P").toUpperCase();
          return (
            <Card
              key={item.id}
              className="flex flex-col items-center gap-2 p-4 text-center"
            >
              <Avatar className="size-16">
                {fotoSrc ? (
                  <AvatarImage src={fotoSrc} alt={item.nome || "Pagador"} />
                ) : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div className="mt-1 w-full">
                <div className="flex items-center justify-center gap-1 text-base leading-tight font-bold capitalize">
                  {item.nome}
                  {item.role === "principal" && (
                    <RiVerifiedBadgeFill size={16} />
                  )}
                  {item.is_auto_send && (
                    <RiMailSendLine
                      size={16}
                      className="text-primary"
                      title="Envio automático ativo"
                    />
                  )}
                </div>
              </div>

              <div className="mt-2">
                <UpdatePayer item={item} avatars={avatars} />
              </div>

              <Link
                href={`/pagador/${item.id}?periodo=${month}`}
                className="bg-secondary mt-1 inline-flex rounded-md px-3 py-1 text-xs font-medium hover:brightness-95"
              >
                Detalhes
              </Link>

              {(item.status || "").toLowerCase() === "inativo" ? (
                <div className="mt-1">
                  <DeletePayer itemId={item.id} itemNome={item.nome} />
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>
    );
  };

  const ativos = pagadores.filter(
    (p: any) => (p.status || "").toLowerCase() === "ativo",
  );
  const inativos = pagadores.filter(
    (p: any) => (p.status || "").toLowerCase() === "inativo",
  );

  return (
    <Tabs defaultValue="ativo">
      <TabsList>
        <TabsTrigger value="ativo" className="flex items-center gap-2">
          <Ping color="bg-green-500" /> Ativos
        </TabsTrigger>
        <TabsTrigger value="inativo" className="flex items-center gap-2">
          <Ping color="bg-zinc-400" /> Inativos
        </TabsTrigger>
      </TabsList>
      <TabsContent value="ativo">{renderGrid(ativos)}</TabsContent>
      <TabsContent value="inativo">{renderGrid(inativos)}</TabsContent>
    </Tabs>
  );
}
