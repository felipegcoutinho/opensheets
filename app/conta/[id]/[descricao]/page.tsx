import {
  getAccountDetails,
  getAccountInvoice,
  getSumAccountExpense,
  getSumAccountIncome,
} from "@/app/actions/accounts";
import { getCards } from "@/app/actions/cards";
import DetailsTransactions from "@/app/transacao/modal/details-transactions";
import CardColor, { ColorDot } from "@/components/card-color";
import Numbers from "@/components/numbers";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UseDates } from "@/hooks/use-dates";
import { CalendarClockIcon, Check, RefreshCw } from "lucide-react";

export default async function page({ params, searchParams }) {
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
        <CardColor
          styles="flex gap-10 px-8 py-6 mt-4 w-full items-center"
          aparencia={item.aparencia}
          id={item.id}
        >
          <ColorDot aparencia={item.aparencia} descricao={item.descricao} />

          <div className="leading-relaxed">
            <p className="font-bold">Conta {item.tipo_conta}</p>
          </div>

          <div className="leading-relaxed">
            <p className="text-xs">Receitas</p>
            <p className="font-bold">
              <Numbers number={sumAccountIncome} />
            </p>
            <p className="text-xs">Despesas</p>
            <p className="font-bold">
              <Numbers number={accountExpense} />
            </p>
            <p className="text-xs">Saldo</p>
            <p className="font-bold">
              <Numbers number={saldo} />
            </p>
          </div>
        </CardColor>
      ))}

      <Table className="mt-6">
        <TableHeader>
          <TableRow className="border-b text-xs">
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
              <TableCell className="font-bold">
                {DateFormat(item.data_compra)}
              </TableCell>
              <TableCell>
                {item.descricao}
                <span className="px-1 text-xs text-neutral-400">
                  {item.condicao === "Parcelado" &&
                    `${item.parcela_atual} de ${item.qtde_parcela}`}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    item.tipo_transacao === "Receita"
                      ? "defaultGreen"
                      : "defaultRed"
                  }
                >
                  {item.tipo_transacao}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-1">
                  {item.condicao === "Parcelado" && (
                    <CalendarClockIcon size={12} />
                  )}
                  {item.condicao === "Recorrente" && <RefreshCw size={12} />}
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
                <Numbers number={item.valor} />
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
    </>
  );
}
