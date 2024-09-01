import { getAccount } from "@/app/actions/accounts";
import { getCardDetails, getCardInvoice, getCards, getCardSum, getLimite } from "@/app/actions/cards";
import DetailsTransactions from "@/app/transacao/modal/details-transactions";
import CardColor, { ColorDot } from "@/components/card-color";
import Numbers from "@/components/numbers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UseDates } from "@/hooks/UseDates";
import mastercard from "@/public/mastercard.svg";
import visa from "@/public/visa.svg";
import Image from "next/image";
import InvoicePayment from "../../invoice-payment";

export default async function page({ params, searchParams }) {
  const { currentMonthName, currentYear, DateFormat } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getCardDetailMap = await getCardDetails(params.id);
  const getCardInvoiceMap = await getCardInvoice(month, params.id);
  const sumCardSum = await getCardSum(month, params.id);

  const getCardsMap = await getCards(month);
  const getAccountMap = await getAccount(); //TODO: getAccountMap is not being used

  const limite = await getLimite(params.id);

  return (
    <>
      {getCardDetailMap?.map((item) => (
        <CardColor styles="flex gap-10 p-10 w-full items-center" aparencia={item.aparencia} id={item.id}>
          <ColorDot aparencia={item.aparencia} descricao={item.descricao} />

          <div className="leading-relaxed">
            <p>Vence dia {item.dt_vencimento}</p>
            <p>Fecha dia {item.dt_fechamento}</p>
          </div>

          <div className="leading-relaxed">
            <p>Limite Disponível</p>
            <p>
              <Numbers number={item.limite - limite} />
            </p>
            <p>{item.contas.descricao}</p>
          </div>

          <div className="leading-relaxed">
            <p>Cartão {item.tipo}</p>
            <Image src={item.bandeira === "Mastercard" ? mastercard : visa} alt="Logo da Bandeira" width={40} height={40} />
          </div>

          {item.anotacao && (
            <div className="leading-relaxed ">
              <p>Notas:</p>
              <p className="text-lg">{item.anotacao}</p>
            </div>
          )}

          <div className="ml-auto">
            Total da fatura
            <p className="text-2xl font-bold">
              <Numbers number={sumCardSum} />
            </p>
            <InvoicePayment month={month} paramsId={params.id} />
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
          {getCardInvoiceMap?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{DateFormat(item.data_compra)}</TableCell>
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
              <TableCell>
                <Numbers number={item.valor} />
              </TableCell>
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
                  itemTipoTransacao={item.tipo_transacao}
                  itemValor={item.valor}
                  itemFormaPagamento={item.forma_pagamento}
                  itemQtdeParcelas={item.qtde_parcela}
                  itemParcelaAtual={item.parcela_atual}
                  itemRecorrencia={item.recorrencia}
                  itemQtdeRecorrencia={item.qtde_recorrencia}
                  itemCartao={item.cartoes?.descricao}
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
