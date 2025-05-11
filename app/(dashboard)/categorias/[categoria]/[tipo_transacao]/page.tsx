import { getCategoria } from "@/app/services/transacoes";
import MoneyValues from "@/components/money-values";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMonth } from "@/hooks/get-month";
import { UseDates } from "@/hooks/use-dates";
import UseStyles from "@/hooks/use-styles";

async function page(props: { params: { month: string } }) {
  const params = await props.params;
  const month = await getMonth(props);

  const { DateFormat, currentMonthName, currentYear } = UseDates();

  const { getButtonVariant, getResponsavelClass } = UseStyles();

  const categoria = decodeURIComponent(params.categoria);
  const tipoTransacao = decodeURIComponent(params.tipo_transacao);

  const transacoes = await getCategoria(month, categoria, tipoTransacao);

  // 📈 Calcular valores
  const totalTransacoes =
    transacoes?.reduce((acc, item) => acc + item.valor, 0) || 0;
  const valorTotal = totalTransacoes;

  return (
    <div className="mb-4 space-y-6">
      {/* Banner / Resumo */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-xl capitalize">{categoria}</CardTitle>
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
            <Badge
              variant={
                tipoTransacao === "receita" ? "defaultGreen" : "defaultRed"
              }
            >
              {tipoTransacao}
            </Badge>
            <span className="text-xs">
              {currentMonthName}-{currentYear}
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold">
            <MoneyValues value={valorTotal} />
          </div>
          <div className="text-muted-foreground mt-2 text-sm">
            Valor total somando os lançamentos por categoria
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lançamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Transação</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Categoria</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transacoes?.map((item) => (
                <TableRow key={item.id} className="whitespace-nowrap">
                  <TableCell className="text-muted-foreground">
                    {DateFormat(item.data_compra)}
                  </TableCell>

                  <TableCell className="font-bold">{item.descricao}</TableCell>

                  <TableCell>
                    <Button
                      size="sm"
                      variant={getButtonVariant(item.tipo_transacao)}
                    >
                      {item.tipo_transacao}
                    </Button>
                  </TableCell>

                  <TableCell>
                    <MoneyValues value={item.valor} />
                  </TableCell>

                  <TableCell>
                    <span
                      className={`${getResponsavelClass(item.responsavel)}`}
                    >
                      {item.responsavel}
                    </span>
                  </TableCell>

                  <TableCell>{item.categoria_id?.nome}</TableCell>
                </TableRow>
              ))}
              {transacoes?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Nenhum lançamento encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default page;
