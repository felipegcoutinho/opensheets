import Numbers from "@/components/numbers";
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
import {
  getAccountDetails,
  getAccountInvoice,
  getSumAccountExpense,
  getSumAccountIncome,
} from "@actions/accounts";
import { getCards } from "@actions/cards";
import DetailsTransactions from "@dashboard/transacao/modal/details-transactions";
import { CalendarClockIcon, Check, RefreshCw } from "lucide-react";
import Image from "next/image";

export default async function page(props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { currentMonthName, currentYear, DateFormat } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getAccountDetailMap = await getAccountDetails(params.id);
  const getTransactionInvoiceMap = await getAccountInvoice(month, params.id);

  const sumAccountIncome = await getSumAccountIncome(month, params.id);
  const accountExpense = await getSumAccountExpense(month, params.id);
  const saldo = sumAccountIncome - accountExpense;

  const getCardsMap = await getCards(month);

  const getResponsavelClass = (responsavel) => {
    if (responsavel === "Você") return "text-blue-600";
    if (responsavel === "Sistema") return "text-neutral-600";
    return "text-orange-600";
  };

  return (
    <>
      {getAccountDetailMap?.map((item) => (
        <Card
          className="mt-4 flex w-full items-center gap-10 px-8 py-6"
          key={item.id}
        >
          <Image
            quality={100}
            src={`/logos/${item.logo_image}`}
            className="rounded-full shadow-lg"
            width={60}
            height={60}
            alt="Logo da conta"
          />

          <div className="leading-relaxed">
            <p className="font-bold">Conta {item.tipo_conta}</p>
          </div>

          <div className="leading-relaxed">
            <p className="text-xs">Receitas</p>
            <p className="font-bold">
              <Numbers value={sumAccountIncome} />
            </p>
            <p className="text-xs">Despesas</p>
            <p className="font-bold">
              <Numbers value={accountExpense} />
            </p>
            <p className="text-xs">Saldo</p>
            <p className="font-bold">
              <Numbers value={saldo} />
            </p>
          </div>
        </Card>
      ))}

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Transações</CardTitle>
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
                <TableHead>Categoria</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {getTransactionInvoiceMap?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{DateFormat(item.data_compra)}</TableCell>
                  <TableCell>
                    <span className="font-bold">{item.descricao}</span>
                    <span className="px-1 text-xs text-neutral-400">
                      {item.condicao === "Parcelado" &&
                        `${item.parcela_atual} de ${item.qtde_parcela}`}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="h-6"
                      variant={
                        item.tipo_transacao === "Receita"
                          ? "success"
                          : "destructive"
                      }
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
                    <span
                      className={`font-bold ${getResponsavelClass(item.responsavel)}`}
                    >
                      {item.responsavel}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Numbers value={item.valor} />
                  </TableCell>

                  <TableCell>{item.categoria}</TableCell>

                  <TableCell className="flex gap-2 text-center">
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
                      itemRecorrencia={item.recorrencia}
                      itemQtdeRecorrencia={item.qtde_recorrencia}
                      itemConta={item.contas?.descricao}
                      itemPaid={item.realizado}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
