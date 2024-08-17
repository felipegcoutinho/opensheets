import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UseDates } from "@/hooks/UseDates";
import { getAccount } from "../actions/accounts";
import { getCards } from "../actions/cards";
import { getTransaction } from "../actions/transactions";
import CreateTransactions from "./modal/create-transactions";
import DeleteTransactions from "./modal/delete-transactions";
import DetailsTransactions from "./modal/details-transactions";
import UpdateTransactions from "./modal/update-transactions";

async function PageTransactions({ searchParams }) {
  const { currentMonthName, currentYear, DateFormat } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getCardsMap = await getCards(month);
  const getAccountMap = await getAccount();
  const getTransactionMap = await getTransaction(month);

  function getDescricao(item) {
    const contaDescricao = item.contas?.descricao;
    const cartaoDescricao = item.cartoes?.descricao;
    return contaDescricao ?? cartaoDescricao;
  }

  function getRowClassNames(item) {
    let classNames = "";
    if (item.categoria === "Saldo Anterior") {
      classNames += " bg-gradient-to-r from-green-50 to-white text-green-700 dark:from-[#0c1c0b] dark:to-black";
    }
    if (item.responsavel === "Sistema") {
      classNames += "bg-gradient-to-r from-neutral-50 to-white text-neutral-500 dark:from-neutral-900 dark:to-black";
    }
    return classNames.trim();
  }

  return (
    <div className="mt-4 w-full">
      <CreateTransactions getCardsMap={getCardsMap} getAccountMap={getAccountMap} />

      <Table className="mt-6">
        <TableHeader>
          <TableRow className="border-b text-xs">
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Transação</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Condição</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Conta/Cartão</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {getTransactionMap?.map((item) => (
            <TableRow className={getRowClassNames(item)} key={item.id}>
              <TableCell>{DateFormat(item.data_compra)}</TableCell>
              <TableCell>
                {item.descricao}
                <span className="text-neutral-400 text-xs px-1">
                  {item.condicao === "Parcelado" && `${item.parcela_atual} de ${item.qtde_parcela}`}
                </span>
              </TableCell>
              <TableCell className={item.tipo_transacao === "Receita" ? "text-green-500" : "text-red-500"}>{item.tipo_transacao}</TableCell>
              <TableCell>{Number(item.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
              <TableCell>{item.condicao}</TableCell>
              <TableCell>{item.forma_pagamento}</TableCell>
              <TableCell>{item.responsavel}</TableCell>
              <TableCell>{getDescricao(item)}</TableCell>
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

                <UpdateTransactions
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

                <DeleteTransactions itemId={item.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default PageTransactions;
