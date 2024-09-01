import Numbers from "@/components/Numbers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UseDates } from "@/hooks/UseDates";
import { CreditCard, File, User } from "lucide-react";
import { getResponsavelBillList, getResponsavelTransactionList } from "../actions/users";

async function PageUsers({ searchParams }) {
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const TransactionListMap = await getResponsavelTransactionList(month);
  const BillListMap = await getResponsavelBillList(month);

  // Agrupa transações e boletos por responsável
  const groupedData = TransactionListMap.reduce((acc, item) => {
    if (!acc[item.responsavel]) {
      acc[item.responsavel] = { cartoes: {}, boletos: {}, totalCartao: 0, totalBoleto: 0 };
    }

    const descricaoCartao = item.cartoes?.descricao || "Pix, dinheiro ou débito";
    acc[item.responsavel].cartoes[descricaoCartao] = (acc[item.responsavel].cartoes[descricaoCartao] || 0) + item.valor;
    acc[item.responsavel].totalCartao += item.valor;

    return acc;
  }, {});

  BillListMap.forEach((item) => {
    if (!groupedData[item.responsavel]) {
      groupedData[item.responsavel] = { cartoes: {}, boletos: {}, totalCartao: 0, totalBoleto: 0 };
    }

    const descricaoBoleto = item.descricao;
    groupedData[item.responsavel].boletos[descricaoBoleto] = (groupedData[item.responsavel].boletos[descricaoBoleto] || 0) + item.valor;
    groupedData[item.responsavel].totalBoleto += item.valor;
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-4 mt-4">
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
    </div>
  );
}

export default PageUsers;

function CardComponent({ responsavel, cartoes, totalCartao, boletos, totalBoleto }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex w-full">
        <CardTitle className="flex justify-between gap-2 text-2xl">
          <p>{responsavel}</p>
          <User className="h-6 w-6" />
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 text-sm">
        <div className="grid gap-3">
          <li className="flex items-center justify-between">
            <span className="text-blue-700 flex items-center gap-1">
              <CreditCard className="fill-blue-700 text-blue-50" size={16} />
              Cartões
            </span>
            <span className="text-lg text-blue-700">
              <Numbers number={totalCartao} />
            </span>
          </li>

          <ul className="grid gap-2 p-2">
            {Object.entries(cartoes).map(([descricao, valor]) => (
              <li className="flex items-center justify-between" key={descricao}>
                <span className="text-muted-foreground">{descricao}</span>
                <span>
                  <Numbers number={valor} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Separator className="my-2" />

        <div className="grid gap-3">
          <li className="flex items-center justify-between">
            <span className="text-orange-600 flex items-center gap-1">
              <File className="fill-orange-600 text-orange-50" size={16} />
              Boletos
            </span>
            <span className="text-lg text-orange-600">
              <Numbers number={totalBoleto} />
            </span>
          </li>

          <ul className="grid gap-2 p-2">
            {Object.entries(boletos).map(([descricao, valor]) => (
              <li className="flex items-center justify-between" key={descricao}>
                <span className="text-muted-foreground">{descricao}</span>
                <span>
                  <Numbers number={valor} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Separator className="my-2" />

        <div className="mt-4">
          <li className="flex items-center justify-between font-bold">
            <span className="text-muted-foreground text-lg">Total</span>
            <span className="text-xl">
              <Numbers number={totalCartao + totalBoleto} />
            </span>
          </li>
        </div>
      </CardContent>
    </Card>
  );
}
