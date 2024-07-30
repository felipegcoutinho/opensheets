import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseDates } from "@/hooks/UseDates";
import { getExpense, getExpenseBill, getIncome } from "../actions/dashboards";

async function PageDashboards({ month }) {
  const { getPreviousMonth, getPreviousTwoMonth } = UseDates();
  const previousMonth = getPreviousMonth(month);
  const previousTwoMonth = getPreviousTwoMonth(month);

  // Função para calcular a previsão do saldo do mês
  const calculateForecast = (previousBalance, income, totalExpenses) => {
    return previousBalance + income - totalExpenses;
  };

  // Obter dados do mês atual
  const receitas = await getIncome(month);
  const despesas = await getExpense(month);
  const despesasBoletos = await getExpenseBill(month);
  const despesasTotal = despesas + despesasBoletos;

  // Obter dados do mês anterior
  const receitasAnterior = await getIncome(previousMonth);
  const despesasAnterior = await getExpense(previousMonth);
  const despesasBoletosAnterior = await getExpenseBill(previousMonth);
  const despesasTotalAnterior = despesasAnterior + despesasBoletosAnterior;

  // Calcular balanços
  const balanco = receitas - despesasTotal;
  const balancoAnterior = receitasAnterior - despesasTotalAnterior;

  // Calcular previsões
  const previsto = calculateForecast(balancoAnterior, receitas, despesasTotal);

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Receitas</CardDescription>
          <CardTitle className="text-4xl">{receitas}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">{receitasAnterior}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Despesas</CardDescription>
          <CardTitle className="text-4xl">{despesasTotal}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">{despesasTotalAnterior}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Balanço</CardDescription>
          <CardTitle className="text-4xl">{balanco}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">{balancoAnterior}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Previsto</CardDescription>
          <CardTitle className="text-4xl">{previsto}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">-</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PageDashboards;
