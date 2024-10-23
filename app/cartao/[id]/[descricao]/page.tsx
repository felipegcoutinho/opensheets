import {
  getCardDetails,
  getCardInvoice,
  getCards,
  getCardSum,
  getLimite,
} from "@/app/actions/cards";
import { getFaturas } from "@/app/actions/invoices";
import DetailsTransactions from "@/app/transacao/modal/details-transactions";
import ButtonPayment from "@/components/button-payment";
import ButtonUndoPayment from "@/components/button-undo-payment";
import CardColor, { ColorDot } from "@/components/card-color";
import Numbers from "@/components/numbers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UseDates } from "@/hooks/use-dates";
import mastercard from "@/public/mastercard.svg";
import visa from "@/public/visa.svg";
import Image from "next/image";

export default async function page({ params, searchParams }) {
  const { currentMonthName, currentYear, DateFormat } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getCardDetailMap = await getCardDetails(params.id);
  const getCardInvoiceMap = await getCardInvoice(month, params.id);
  const sumCardSum = await getCardSum(month, params.id);

  const getCardsMap = await getCards(month);

  const limite = await getLimite(params.id);

  const fatura_status = await getFaturas(month, params.id);

  return (
    <>
      {getCardDetailMap?.map((item) => (
        <CardColor
          styles="flex gap-10 px-8 py-6 mt-4 w-full items-center"
          aparencia={item.aparencia}
          id={item.id}
        >
          <ColorDot aparencia={item.aparencia} descricao={item.descricao} />

          <div className="leading-loose">
            <p className="text-xs">Vencimento</p>
            <p className="font-bold">{item.dt_vencimento}</p>
            <p className="text-xs">Fechamento</p>
            <p className="font-bold">{item.dt_fechamento}</p>
          </div>

          <div className="leading-loose">
            <p className="text-xs">Limite Disponível</p>
            <p className="font-bold">
              <Numbers number={item.limite - limite} />
            </p>
            <p className="text-xs">Conta de Pagamento</p>
            <p className="font-bold">{item.contas.descricao}</p>
          </div>

          <div className="leading-loose">
            <p className="text-xs">Tipo do Cartão</p>
            <p className="font-bold">Cartão {item.tipo}</p>
            <p className="text-xs">Bandeira</p>
            <Image
              src={item.bandeira === "Mastercard" ? mastercard : visa}
              alt="Logo da Bandeira"
              width={40}
              height={40}
            />
          </div>

          {item.anotacao && (
            <div className="leading-loose">
              <p>Notas:</p>
              <p className="text-lg">{item.anotacao}</p>
            </div>
          )}

          <div className="ml-auto">
            Total da Fatura
            <p className="text-2xl font-bold">
              <Numbers number={sumCardSum} />
            </p>
          </div>
        </CardColor>
      ))}

      <div
        className={`mt-4 rounded p-2 ${
          fatura_status &&
          fatura_status.some((item) => item.status_pagamento === "Pago")
            ? "border-green-500 bg-green-400"
            : "border-orange-500 bg-orange-400"
        }`}
      >
        <div className="flex items-center justify-between">
          {getCardDetailMap?.map((item) => (
            <ButtonPayment
              fatura_status={fatura_status}
              month={month}
              paramsId={params.id}
              descricao={item.descricao}
              valor={sumCardSum}
            />
          ))}

          <ButtonUndoPayment fatura_status={fatura_status} />
        </div>
      </div>

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
                <span className="px-1 text-xs text-neutral-400">
                  {item.condicao === "Parcelado" &&
                    `${item.parcela_atual} de ${item.qtde_parcela}`}
                </span>
              </TableCell>
              <TableCell
                className={
                  item.tipo_transacao === "Receita"
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {item.tipo_transacao}
              </TableCell>
              <TableCell>{item.condicao}</TableCell>
              <TableCell>{item.forma_pagamento}</TableCell>
              <TableCell>{item.categoria}</TableCell>
              <TableCell>{item.responsavel}</TableCell>
              <TableCell>
                <Numbers number={item.valor} />
              </TableCell>
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
                  itemParcelaAtual={item.parcela_atual}
                  itemRecorrencia={item.recorrencia}
                  itemQtdeRecorrencia={item.qtde_recorrencia}
                  itemCartao={item.cartoes?.descricao}
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
