import { getPayers } from "@/app/actions/payers/fetch_payers";
import CreatePagador from "./modal/create-pagador";
import Image from "next/image";
import Link from "next/link";
import EmptyCard from "@/components/empty-card";
import Ping from "@/components/ping-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { RiVerifiedBadgeFill } from "@remixicon/react";
import { PaymentMethodLogo } from "@/components/payment-method-logo";

export default async function page() {
  const pagadores = await getPayers();

  return (
    <div className="w-full">
      <CreatePagador />

      <Tabs defaultValue="ativos">
        <TabsList className="mb-2">
          <TabsTrigger value="ativos" className="flex items-center gap-2">
            <Ping color="bg-green-500" /> Ativos
          </TabsTrigger>
          <TabsTrigger value="inativos" className="flex items-center gap-2">
            <Ping color="bg-zinc-400" /> Inativos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ativos">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-4">
            {pagadores?.length > 0 ? (
              pagadores.map(
                (item) =>
                  item.status === "ativo" && (
                    <div key={item.id} className="col-span-3 lg:col-span-1">
                      <Card className="mx-auto max-h-72 w-full p-4 text-center">
                        <div className="bg-muted flex justify-center rounded p-4">
                          <PaymentMethodLogo
                            url_name={`/logos/${item.foto}`}
                            width={60}
                            height={60}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-center gap-1 font-bold">
                            <span className="text-lg">{item.nome}</span>

                            {item.role === "principal" && (
                              <span className="text-blue-600">
                                <RiVerifiedBadgeFill className="h-4 w-4" />
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {item.email}
                          </p>
                        </div>

                        {item.anotacao && (
                          <p className="text-muted-foreground text-sm">
                            {item.anotacao}
                          </p>
                        )}

                        <Link href={`/pagador/${item.id}`}>
                          <p className="text-primary mt-2 hover:underline">
                            detalhes
                          </p>
                        </Link>
                      </Card>
                    </div>
                  ),
              )
            ) : (
              <EmptyCard />
            )}
          </div>
        </TabsContent>

        <TabsContent value="inativos">
          <div className="grid gap-4 saturate-0 sm:grid-cols-1 lg:grid-cols-3">
            {pagadores?.length > 0 ? (
              pagadores.map(
                (item) =>
                  item.status === "inativo" && (
                    <div key={item.id} className="col-span-3 lg:col-span-1">
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <Image
                            quality={100}
                            src={`/logos/${item.foto}`}
                            className="rounded-full border"
                            width={52}
                            height={52}
                            alt={item.nome}
                          />
                          <div>
                            <h2 className="text-lg font-semibold">
                              {item.nome}
                            </h2>
                            <p className="text-muted-foreground text-sm">
                              {item.email}
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">{item.anotacao}</p>
                        <Link href={`/pagador/${item.id}`}>
                          <p className="text-primary">Ver detalhes</p>
                        </Link>
                      </div>
                    </div>
                  ),
              )
            ) : (
              <EmptyCard />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
