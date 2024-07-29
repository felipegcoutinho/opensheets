import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAccount } from "../actions/accounts";
import { getCards } from "../actions/cards";
import { getTransaction, updateTransaction } from "../actions/transactions";
import CreateTransactions from "./modal/create-transactions";
import DetailsTransactions from "./modal/details-transactions";
import UpdateTransactions from "./modal/update-transactions";

async function PageTransactions({ month }) {
  const getCardsMap = await getCards(month);
  const getAccountMap = await getAccount();
  const getTransactionMap = await getTransaction(month);

  function getDescricao(item) {
    const contaDescricao = item.contas?.descricao;
    const cartaoDescricao = item.cartoes?.descricao;
    return contaDescricao ?? cartaoDescricao;
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
            <TableHead>Condição</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Conta/Cartão</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {getTransactionMap?.map((item) => (
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
              <TableCell>{getDescricao(item)}</TableCell>
              <TableCell className="text-center flex gap-2">
                <DetailsTransactions />

                <UpdateTransactions
                  itemId={item.id}
                  itemNotas={item.notas}
                  itemDate={item.data_compra}
                  itemDescricao={item.descricao}
                  itemCategoria={item.categoria}
                  itemCondicao={item.condicao}
                  itemResponsavel={item.responsavel}
                  itemSegundoResponsavel={item.segundo_responsavel}
                  itemTipoTransacao={item.tipo_transacao}
                  itemValor={item.valor}
                  itemFormaPagamento={item.forma_pagamento}
                  itemCartao={getDescricao(item)}
                  itemConta={getDescricao(item)}
                  itemQtdeParcelas={item.qtde_parcela}
                  itemRecorrencia={item.recorrencia}
                  itemQtdeRecorrencia={item.qtde_recorrencia}
                  dataAccounts={getAccountMap}
                  dataCards={getCardsMap}
                  itemPeriodo={item.periodo}
                  updateTransaction={updateTransaction}
                />

                {/* <DeleteTransactions itemId={item.id} /> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default PageTransactions;
