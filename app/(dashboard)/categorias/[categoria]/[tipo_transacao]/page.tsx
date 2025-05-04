import { getCategoriaBoletos } from "@/app/services/boletos";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMonth } from "@/hooks/get-month";
import { UseDates } from "@/hooks/use-dates";
import UseStyles from "@/hooks/use-styles";

async function page(props) {
  const params = await props.params;
  const month = await getMonth(props);

  const { DateFormat, currentMonthName, currentYear } = UseDates();

  const { getButtonVariant, getResponsavelClass } = UseStyles();

  const categoria = decodeURIComponent(params.categoria);
  const tipoTransacao = decodeURIComponent(params.tipo_transacao);

  const transacoes = await getCategoria(month, categoria, tipoTransacao);
  const boletos = await getCategoriaBoletos(month, categoria);

  // 📈 Calcular valores
  const totalTransacoes =
    transacoes?.reduce((acc, item) => acc + item.valor, 0) || 0;
  const totalBoletos = boletos?.reduce((acc, item) => acc + item.valor, 0) || 0;
  const valorTotal = totalTransacoes + totalBoletos;

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
            Valor total somando Transações e Boletos
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="transacoes" className="w-full">
        {tipoTransacao !== "receita" && (
          <TabsList variant={"underline"} width={"full"}>
            <>
              <TabsTrigger
                value="transacoes"
                variant={"underline"}
                width={"fit"}
              >
                Lançamentos
              </TabsTrigger>
              <TabsTrigger value="boletos" variant={"underline"} width={"fit"}>
                Boletos
              </TabsTrigger>
            </>
          </TabsList>
        )}

        {/* Aba Transações */}
        <TabsContent value="transacoes">
          <Card>
            <CardHeader>
              <CardTitle>Transações</CardTitle>
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

                      <TableCell className="font-bold">
                        {item.descricao}
                      </TableCell>

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
        </TabsContent>

        {/* Aba Boletos */}
        <TabsContent value="boletos">
          <Card>
            <CardHeader>
              <CardTitle>Boletos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data de Vencimento</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Categoria</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {boletos?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-muted-foreground">
                        {DateFormat(item.dt_vencimento)}
                      </TableCell>

                      <TableCell className="font-bold">
                        {item.descricao}
                      </TableCell>

                      <TableCell>
                        <MoneyValues value={item.valor} />
                      </TableCell>

                      <TableCell>{item.categoria_id?.nome}</TableCell>
                    </TableRow>
                  ))}
                  {boletos?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Nenhum boleto encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default page;
