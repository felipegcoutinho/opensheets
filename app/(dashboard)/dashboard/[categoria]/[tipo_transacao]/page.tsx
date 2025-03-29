import DetailsTransactions from "@/app/(dashboard)/lancamentos/modal/details-transactions";
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
import { UseDates } from "@/hooks/use-dates";
import UseStyles from "@/hooks/use-styles";
import {
  ArrowLeftIcon,
  CalendarClockIcon,
  Check,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

async function page(props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { currentMonthName, currentYear, DateFormat } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const categoria = capitalizeFirstLetter(decodeURIComponent(params.categoria));
  const tipoTransacao = capitalizeFirstLetter(
    decodeURIComponent(params.tipo_transacao),
  );

  const getCategoriaMap = await getCategoria(month, categoria, tipoTransacao);
  const valorTotal = getCategoriaMap?.reduce(
    (acc, item) => acc + item.valor,
    0,
  );

  // Calcula o número total de Lançamentos
  const totalTransacoes = getCategoriaMap?.length || 0;

  const { getButtonVariant } = UseStyles();

  return (
    <div className="mb-4 space-y-6">
      {/* Botão Voltar */}
      <Button variant="ghost" className="mt-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <ArrowLeftIcon size={16} />
          <p>Voltar</p>
        </Link>
      </Button>

      {/* Cabeçalho com Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Button size="sm" variant={getButtonVariant(tipoTransacao)}>
                {tipoTransacao}
              </Button>
              <Badge variant="outline" className="h-6">
                {categoria}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Valor Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              <MoneyValues value={valorTotal} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total de Lançamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalTransacoes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Lançamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Lançamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Transação</TableHead>
                <TableHead>Condição</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {getCategoriaMap?.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell>{DateFormat(item.data_compra)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{item.descricao}</span>
                      {item.condicao === "Parcelado" && (
                        <span className="text-muted-foreground text-xs">
                          Parcela {item.parcela_atual} de {item.qtde_parcela}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={getButtonVariant(item.tipo_transacao)}
                    >
                      {item.tipo_transacao}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1">
                      {item.condicao === "Parcelado" && (
                        <CalendarClockIcon size={12} />
                      )}
                      {item.condicao === "Recorrente" && (
                        <RefreshCw size={12} />
                      )}
                      {item.condicao === "Vista" && <Check size={12} />}
                      <span className="capitalize">{item.condicao}</span>
                    </span>
                  </TableCell>
                  <TableCell>{item.forma_pagamento}</TableCell>
                  <TableCell>
                    <span className="text-primary font-medium">
                      {item.responsavel}
                    </span>
                  </TableCell>
                  <TableCell>
                    <MoneyValues value={item.valor} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DetailsTransactions
                      itemId={item.id}
                      itemPeriodo={item.periodo}
                      itemNotas={item.anotacao}
                      itemDate={item.data_compra}
                      itemDescricao={item.descricao}
                      itemCategoria={item.categoria}
                      itemCondicao={item.condicao}
                      itemResponsavel={item.responsavel}
                      itemTipoTransacao={item.tipo_transacao}
                      itemValor={item.valor}
                      itemFormaPagamento={item.forma_pagamento}
                      itemQtdeParcelas={item.qtde_parcela}
                      itemParcelaAtual={item.parcela_atual}
                      itemRecorrencia={item.recorrencia}
                      itemQtdeRecorrencia={item.qtde_recorrencia}
                      itemCartao={item.cartoes?.descricao}
                      itemPaid={item.realizado}
                      itemConta={item.contas?.descricao}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default page;
