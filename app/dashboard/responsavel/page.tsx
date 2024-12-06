import Numbers from "@/components/numbers";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseDates } from "@/hooks/use-dates";
import { User } from "lucide-react";
import {
  getResponsavelBillList,
  getResponsavelTransactionList,
} from "../../actions/users";

async function page(props) {
  const searchParams = await props.searchParams;
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const TransactionListMap = await getResponsavelTransactionList(month);
  const BillListMap = await getResponsavelBillList(month);

  // Agrupa transações e boletos por responsável
  const groupedData = TransactionListMap.reduce((acc, item) => {
    if (!acc[item.responsavel]) {
      acc[item.responsavel] = {
        cartoes: {},
        boletos: {},
        totalCartao: 0,
        totalBoleto: 0,
      };
    }

    const descricaoCartao =
      item.cartoes?.descricao || "Pix, dinheiro ou débito";
    acc[item.responsavel].cartoes[descricaoCartao] =
      (acc[item.responsavel].cartoes[descricaoCartao] || 0) + item.valor;
    acc[item.responsavel].totalCartao += item.valor;

    return acc;
  }, {});

  BillListMap.forEach((item) => {
    if (!groupedData[item.responsavel]) {
      groupedData[item.responsavel] = {
        cartoes: {},
        boletos: {},
        totalCartao: 0,
        totalBoleto: 0,
      };
    }

    const descricaoBoleto = item.descricao;
    groupedData[item.responsavel].boletos[descricaoBoleto] =
      (groupedData[item.responsavel].boletos[descricaoBoleto] || 0) +
      item.valor;
    groupedData[item.responsavel].totalBoleto += item.valor;
  });

  return (
    <div className="my-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Object.entries(groupedData).map(([responsavel, data]) => (
        <CardComponent
          key={responsavel}
          responsavel={responsavel}
          cartoes={data.cartoes}
          totalCartao={data.totalCartao}
          boletos={data.boletos}
          totalBoleto={data.totalBoleto}
        />
      ))}
    </div>
  );
}

export default page;

function CardComponent({
  responsavel,
  cartoes,
  totalCartao,
  boletos,
  totalBoleto,
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex w-full">
        <CardTitle className="flex justify-between gap-2 text-2xl">
          <p>{responsavel}</p>
          <User className="h-6 w-6" />
        </CardTitle>
      </CardHeader>

      <CardContent className="text-sm">
        <div className="grid gap-1">
          <li className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Badge
                variant="outline"
                className="border border-green-banner text-green-banner"
              >
                Cartões
              </Badge>
            </span>
            <span className="text-lg">
              <Numbers number={totalCartao} />
            </span>
          </li>

          <ul className="grid gap-2 p-2">
            {Object.entries(cartoes).map(([descricao, valor]) => (
              <li
                className="flex items-center justify-between text-muted-foreground"
                key={descricao}
              >
                <span>{descricao}</span>
                <span>
                  <Numbers number={valor} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="my-3 w-full border border-dashed border-muted dark:border-neutral-700"></div>

        <div className="grid gap-1">
          <li className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Badge
                variant="outline"
                className="border border-pink-link text-pink-link"
              >
                Boletos
              </Badge>
            </span>
            <span className="text-lg">
              <Numbers number={totalBoleto} />
            </span>
          </li>

          <ul className="grid gap-2 p-2">
            {Object.entries(boletos).map(([descricao, valor]) => (
              <li
                className="flex items-center justify-between text-muted-foreground"
                key={descricao}
              >
                <span>{descricao}</span>
                <span>
                  <Numbers number={valor} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="my-2 w-full border-2 border-muted dark:border-neutral-700"></div>

        <div className="mt-4">
          <li className="flex items-center justify-between font-bold">
            <span className="text-lg text-muted-foreground">Total</span>
            <span className="text-xl">
              <Numbers number={totalCartao + totalBoleto} />
            </span>
          </li>
        </div>
      </CardContent>
    </Card>
  );
}
