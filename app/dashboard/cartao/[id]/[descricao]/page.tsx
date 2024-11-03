import ButtonPayment from "@/components/button-payment";
import ButtonUndoPayment from "@/components/button-undo-payment";
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
import mastercard from "@/public/mastercard.svg";
import visa from "@/public/visa.svg";
import {
  getCardDetails,
  getCardInvoice,
  getCards,
  getCardSum,
  getLimite,
} from "@actions/cards";
import { getFaturas } from "@actions/invoices";
import DetailsTransactions from "@dashboard/transacao/modal/details-transactions";
import {
  CalendarClockIcon,
  Check,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

export default async function page(props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { currentMonthName, currentYear, DateFormat } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getCardDetailMap = await getCardDetails(params.id);
  const getCardInvoiceMap = await getCardInvoice(month, params.id);
  const sumCardSum = await getCardSum(month, params.id);

  const getCardsMap = await getCards(month);

  const limite = await getLimite(params.id);

  const fatura_status = await getFaturas(month, params.id);

  const getResponsavelClass = (responsavel) => {
    if (responsavel === "Você") return "text-blue-600";
    if (responsavel === "Sistema") return "text-neutral-600";
    return "text-orange-600";
  };

  return (
    <>
      {getCardDetailMap?.map((item) => (
        <CardColor
          styles="flex gap-10 px-8 py-6 mt-4 w-full items-center"
          aparencia={item.aparencia}
          id={item.id}
          key={item.id}
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
            <div className="text-2xl font-bold">
              <Numbers number={sumCardSum} />
            </div>
          </div>
        </CardColor>
      ))}

      <div
        className={`mt-4 rounded p-2 dark:border-none border${
          fatura_status &&
          fatura_status.some((item) => item.status_pagamento === "Pago")
            ? "border-green-500 bg-green-50 dark:bg-green-900"
            : "border-orange-500 bg-orange-50 dark:bg-orange-900"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {fatura_status && fatura_status.length > 0 && (
              <CheckCircle2 size={24} className="text-green-100" fill="green" />
            )}

            {getCardDetailMap?.map((item) => (
              <ButtonPayment
                key={item.id}
                fatura_status={fatura_status}
                month={month}
                paramsId={params.id}
                descricao={item.descricao}
                valor={sumCardSum}
              />
            ))}
          </div>

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
            <TableHead>Responsável</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {getCardInvoiceMap?.map((item) => (
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
