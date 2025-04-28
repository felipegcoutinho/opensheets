import { getCategoriaBoletos } from "@/app/services/boletos";
import { getCategoria } from "@/app/services/transacoes";
import MoneyValues from "@/components/money-values";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPeriodo } from "@/hooks/periodo";
import { UseDates } from "@/hooks/use-dates";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

async function page(props) {
  const params = await props.params;
  const month = await getPeriodo(props);

  const { DateFormat, currentMonthName, currentYear } = UseDates();

  const categoria = decodeURIComponent(params.categoria);
  const tipoTransacao = decodeURIComponent(params.tipo_transacao);

  const transacoes = await getCategoria(month, categoria, tipoTransacao);
  const boletos = await getCategoriaBoletos(month, categoria);

  // 📈 Calcular valores
  const totalTransacoes =
    transacoes?.reduce((acc, item) => acc + item.valor, 0) || 0;
  const totalBoletos = boletos?.reduce((acc, item) => acc + item.valor, 0) || 0;
  const valorTotal = totalTransacoes + totalBoletos;

  return (
    <div className="mb-4 space-y-6">
      {/* Botão Voltar */}
      <Button variant="ghost" className="mt-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <ArrowLeftIcon size={16} />
          <p>Voltar</p>
        </Link>
      </Button>

      {/* Banner / Resumo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl capitalize">{categoria}</CardTitle>
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
            <Badge
              variant={
                tipoTransacao === "receita" ? "defaultGreen" : "defaultRed"
              }
            >
              {tipoTransacao}
            </Badge>
            <span className="text-xs">
              {currentMonthName}-{currentYear}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <MoneyValues value={valorTotal} />
          </div>
          <div className="text-muted-foreground mt-2 text-sm">
            Valor total somando Transações e Boletos
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="transacoes" className="w-full">
        <TabsList variant={"underline"} width={"full"}>
          <TabsTrigger value="transacoes" variant={"underline"} width={"fit"}>
            Lançamentos
          </TabsTrigger>
          <TabsTrigger value="boletos" variant={"underline"} width={"fit"}>
            Boletos
          </TabsTrigger>
        </TabsList>

        {/* Aba Transações */}
        <TabsContent value="transacoes">
          <Card>
            <CardHeader>
              <CardTitle>Transações</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transacoes?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{DateFormat(item.data_compra)}</TableCell>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell>{item.tipo_transacao}</TableCell>
                      <TableCell>{item.categoria_id?.nome}</TableCell>
                      <TableCell>
                        <MoneyValues value={item.valor} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {transacoes?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Nenhum lançamento encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Boletos */}
        <TabsContent value="boletos">
          <Card>
            <CardHeader>
              <CardTitle>Boletos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data de Vencimento</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {boletos?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{DateFormat(item.dt_vencimento)}</TableCell>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell>{item.status_pagamento}</TableCell>
                      <TableCell>{item.categoria_id?.nome}</TableCell>
                      <TableCell>
                        <MoneyValues value={item.valor} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {boletos?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Nenhum boleto encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default page;
