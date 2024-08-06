import { getAccount, getAccountDetails, getAccountInvoice, getSumAccountExpense, getSumAccountIncome } from "@/app/actions/accounts";
import { getCards } from "@/app/actions/cards";
import DetailsTransactions from "@/app/transacao/modal/details-transactions";
import CardColor, { ColorDot } from "@/components/card-color";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UseDates } from "@/hooks/UseDates";

export default async function page({ params, searchParams }) {
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getAccountDetailMap = await getAccountDetails(params.id);
  const getTransactionInvoiceMap = await getAccountInvoice(month, params.id);

  const accountExpense = await getSumAccountExpense(month, params.id);
  const sumAccountIncome = await getSumAccountIncome(month, params.id);

  const getCardsMap = await getCards(month);
  const getAccountMap = await getAccount(); //TODO: getAccountMap is not being used

  return (
    <>
      {getAccountDetailMap?.map((item) => (
        <CardColor styles="flex gap-10 h-32 w-full items-center" aparencia={item.aparencia} id={item.id}>
          <div className="px-16 flex items-center gap-2">
            <ColorDot aparencia={item.aparencia} descricao={item.descricao} />
          </div>
          <div className="leading-relaxed">
            <p>Conta {item.tipo_conta}</p>
            <p className="text-xl"> Receitas {sumAccountIncome}</p>
            <p className="text-xl"> Despesas {accountExpense}</p>
            <p className="text-xl"> Saldo {sumAccountIncome - accountExpense}</p>
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
                <DetailsTransactions
                  itemId={item.id}
                  itemPeriodo={item.periodo}
                  itemNotas={item.anotacao}
                  itemDate={item.data_compra}
                  itemDescricao={item.descricao}
                  itemCategoria={item.categoria}
                  itemCondicao={item.condicao}
                  itemResponsavel={item.responsavel}
                  itemSegundoResponsavel={item.segundo_responsavel}
                  itemTipoTransacao={item.tipo_transacao}
                  itemValor={item.valor}
                  itemFormaPagamento={item.forma_pagamento}
                  itemQtdeParcelas={item.qtde_parcela}
                  itemRecorrencia={item.recorrencia}
                  itemQtdeRecorrencia={item.qtde_recorrencia}
                  getAccountMap={getAccountMap}
                  getCardsMap={getCardsMap}
                  itemCartao={item.cartoes?.id}
                  itemConta={item.contas?.id}
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
