import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 px-1 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {/* Skeleton para Receitas */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Título "Receitas" */}
          <Skeleton className="h-10 w-32" /> {/* Valor de receita */}
          <Skeleton className="h-4 w-20" /> {/* Valor anterior */}
        </div>

        {/* Skeleton para Despesas */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Título "Despesas" */}
          <Skeleton className="h-10 w-32" /> {/* Valor de despesa */}
          <Skeleton className="h-4 w-20" /> {/* Valor anterior */}
        </div>

        {/* Skeleton para Balanço */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Título "Balanço" */}
          <Skeleton className="h-10 w-32" /> {/* Valor de balanço */}
          <Skeleton className="h-4 w-20" /> {/* Valor anterior */}
        </div>

        {/* Skeleton para Previsto */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Título "Previsto" */}
          <Skeleton className="h-10 w-32" /> {/* Valor previsto */}
          <Skeleton className="h-4 w-20" /> {/* Valor anterior */}
        </div>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-2 gap-2">
        {/* Skeleton para Faturas */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" /> {/* Título "Faturas" */}
          <Skeleton className="h-10 w-64" /> {/* Fatura lista */}
          <Skeleton className="h-6 w-40" /> {/* Botão pagar */}
        </div>

        {/* Skeleton para Boletos */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" /> {/* Título "Boletos" */}
          <Skeleton className="h-10 w-64" /> {/* Boleto lista */}
          <Skeleton className="h-6 w-40" /> {/* Botão pagar */}
        </div>

        {/* Skeleton para Condições e Pagamentos */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" /> {/* Título "Condições" */}
          <Skeleton className="h-6 w-48" /> {/* Condição 1 */}
          <Skeleton className="h-6 w-48" /> {/* Condição 2 */}
          <Skeleton className="h-4 w-32" /> {/* Título "Pagamentos" */}
          <Skeleton className="h-6 w-48" /> {/* Pagamento 1 */}
          <Skeleton className="h-6 w-48" /> {/* Pagamento 2 */}
        </div>
        

        {/* Skeleton para Receitas por Categorias */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" /> {/* Título "Receitas por Categorias" */}
          <Skeleton className="h-24 w-full" /> {/* Placeholder categorias */}
        </div>

        {/* Skeleton para Despesas por Categorias */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" /> {/* Título "Despesas por Categorias" */}
          <Skeleton className="h-24 w-full" /> {/* Placeholder categorias */}
        </div>

        {/* Skeleton para Transações, Boletos e Cartões */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" /> {/* Título "Transações" */}
          <Skeleton className="h-6 w-48" /> {/* Transações */}
          <Skeleton className="h-6 w-48" /> {/* Boletos */}
          <Skeleton className="h-6 w-48" /> {/* Cartões */}
        </div>
      </div>
    </div>
  );
}
