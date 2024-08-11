import { getAccount } from "@/app/actions/accounts";
import { getCardDetails, getCardInvoice, getCards, getCardSum } from "@/app/actions/cards";
import DetailsTransactions from "@/app/transacao/modal/details-transactions";
import CardColor, { ColorDot } from "@/components/card-color";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UseDates } from "@/hooks/UseDates";
import InvoicePayment from "../../invoice-payment";

export default async function page({ params, searchParams }) {
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getCardDetailMap = await getCardDetails(params.id);
  const getCardInvoiceMap = await getCardInvoice(month, params.id);
  const sumCardSum = await getCardSum(month, params.id);

  const getCardsMap = await getCards(month);
  const getAccountMap = await getAccount(); //TODO: getAccountMap is not being used

  return (
    <>
      {getCardDetailMap?.map((item) => (
        <CardColor styles="flex gap-10 h-32 w-full items-center" aparencia={item.aparencia} id={item.id}>
          <div className="text-xl px-16 flex items-center gap-2">
            <ColorDot aparencia={item.aparencia} descricao={item.descricao} />
          </div>
          <div className="leading-relaxed">
            <p>Vence dia {item.dt_vencimento}</p>
            <p>Fecha dia {item.dt_fechamento}</p>
            <p>{item.bandeira}</p>
          </div>
          <div className="leading-relaxed">
            <p>{item.limite}</p>
            <p>{item.tipo}</p>
            <p>{item.contas.descricao}</p>
            <p>{item.anotacao}</p>
          </div>
          <div className="leading-relaxed">
            <InvoicePayment month={month} paramsId={params.id} />
          </div>
          Valor da fatura: R$ {sumCardSum}
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
          {getCardInvoiceMap?.map((item) => (
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
