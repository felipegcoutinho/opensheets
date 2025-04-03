import CreateTransactionsTeste from "@/app/criar-lancamentos/page";

export default function CreateTransactions({ getCards, getAccount }) {
  return (
    <CreateTransactionsTeste getCards={getCards} getAccount={getAccount} />
  );
}
