import CreateTransactionsTeste from "@/app/(dashboard)/criar-lancamentos/page";

export default function CreateTransactions({ getCards, getAccount }) {
  return (
    <CreateTransactionsTeste getCards={getCards} getAccount={getAccount} />
  );
}
