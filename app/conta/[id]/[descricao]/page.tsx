import { getAccountDetail, getAccountExpense, getAccountInvoice } from "@/app/actions/accounts";
import DetailsTransactions from "@/app/transacao/modal/details-transactions";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UseColors } from "@/hooks/UseColors";
import { UseDates } from "@/hooks/UseDates";

export default async function page({ params, searchParams }) {
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getAccountDetailMap = await getAccountDetail(params.id);
  const getAccountExpenseMap = await getAccountExpense(params.id);
  const getTransactionInvoiceMap = await getAccountInvoice(month, params.id);

  const { colorVariants, colorVariantsCard } = UseColors();

  return (
    <>
      {getAccountDetailMap?.map((item) => (
        <Card key={item.id} className="flex gap-10 h-32 w-full items-center">
          <div className="text-xl px-16 flex items-center gap-2">
            {/* <div className={cn(colorVariants[item.aparencia], "w-8 h-8 rounded-full")} /> */}
            <div className="bg-black w-8 h-8 rounded-full" />
            {item.descricao}
          </div>
          <div className="leading-relaxed">
            <p>Conta {item.tipo_conta}</p>
            <p className="text-2xl"> Despesas {getAccountExpenseMap?.map((item) => item.sum)}</p>
          </div>
        </Card>
      ))}

      <Table className="mt-6">
        <TableHeader>
          <TableRow className="border-b text-xs">
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Transação</TableHead>
            <TableHead>Condição</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {getTransactionInvoiceMap?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.data_compra}</TableCell>
              <TableCell>
                {item.descricao}
                <span className="text-neutral-400 text-xs px-1">
                  {item.condicao === "Parcelado" && `${item.parcela_atual} de ${item.qtde_parcela}`}
                </span>
              </TableCell>
              <TableCell className={item.tipo_transacao === "Receita" ? "text-green-500" : "text-red-500"}>{item.tipo_transacao}</TableCell>
              <TableCell>{item.condicao}</TableCell>
              <TableCell>{item.forma_pagamento}</TableCell>
              <TableCell>{item.categoria}</TableCell>
              <TableCell>{item.responsavel}</TableCell>
              <TableCell>{item.valor}</TableCell>
              <TableCell className="text-center flex gap-2">
                <DetailsTransactions />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
