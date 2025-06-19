import { fetchAllData } from "@/app/services/fetch-all-data";
import { getResumoFinanceiroPorPeriodo } from "@/app/services/transacoes";
import { UseDates } from "@/hooks/use-dates";

export default async function UtilitiesDashboard(month: string) {
  const {
    incomes,
    expenses,
    previstoAnterior,
    sumPaidExpense,
    sumPaidIncome,
    transactionsByCategory,
    expensesAnterior,
    incomesAnterior,
  } = await fetchAllData(month);

  const sumarioTeste = await getResumoFinanceiroPorPeriodo(
    "925644d7-0cc1-49a2-87dd-09e317a6f4f0",
    month,
  );

  const { getPreviousMonth } = UseDates();

  const formatNumber = (value: any) => parseFloat(value) || 0;

  const resumoAtual =
    sumarioTeste.find((item) => item.periodo === month) || sumarioTeste[0];
  const resumoAnterior =
    sumarioTeste.find((item) => item.periodo === getPreviousMonth(month)) ||
    sumarioTeste[1] ||
    {};

  const saldo = sumPaidIncome - sumPaidExpense;
  const balanco = formatNumber(resumoAtual?.balanco ?? incomes - expenses);
  const balancoAnterior =
    formatNumber(resumoAnterior?.balanco ?? incomesAnterior - expensesAnterior);
  const previsto = formatNumber(resumoAtual?.saldo_previsto ?? 0);

  const summary = [
    {
      title: "Receitas",
      value: formatNumber(
        resumoAtual?.receitas ?? resumoAtual?.total_receitas ?? incomes,
      ),
      previousValue: formatNumber(
        resumoAnterior?.receitas ?? resumoAnterior?.total_receitas ??
          incomesAnterior,
      ),
      color: "bg-chart-1",
    },
    {
      title: "Despesas",
      value: formatNumber(
        resumoAtual?.despesas ?? resumoAtual?.total_despesas ?? expenses,
      ),
      previousValue: formatNumber(
        resumoAnterior?.despesas ?? resumoAnterior?.total_despesas ??
          expensesAnterior,
      ),
      color: "bg-chart-2",
    },
    {
      title: "Balanço",
      value: balanco,
      previousValue: balancoAnterior,
      color: "bg-chart-3",
    },
    {
      title: "Previsto",
      value: previsto,
      previousValue: formatNumber(resumoAnterior?.saldo_previsto ?? previstoAnterior),
      color: "bg-chart-4",
    },
  ];

  function getTotalsCategory(month: string) {
    const totals = new Map<string, number>();

    // Primeiro somar transacoes
    transactionsByCategory.forEach((item) => {
      const categoriaNome = item.categoria?.nome || "Sem Categoria";
      const id = item.categoria?.id || "sem_categoria";
      const valor = parseFloat(item.valor) || 0;
      const tipo = item.tipo_transacao || "despesa";

      const chave = `${tipo}:${categoriaNome}:${id}`;

      totals.set(chave, (totals.get(chave) || 0) + valor);
    });

    // Transformar o Map em array para exibir
    return Array.from(totals.entries()).map(([key, total]) => {
      const [tipo_transacao, categoria, id] = key.split(":");
      return { tipo_transacao, categoria, id, total };
    });
  }

  return {
    incomes,
    expenses,
    saldo,
    incomesAnterior,
    balanco,
    balancoAnterior,
    previsto,
    previstoAnterior: formatNumber(resumoAnterior?.saldo_previsto ?? previstoAnterior),
    summary,
    getTotalsCategory,
    sumarioTeste,
  };
}
