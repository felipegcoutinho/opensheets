import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import { getResponsavelBillList, getResponsavelTransactionList } from "../actions/users";

async function PageUsers({ month }) {
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{responsavel}</CardTitle>
        <User size={24} />
      </CardHeader>
      <CardContent>
        <Section title="Transações" total={totalCartao} items={cartoes} />
        <Separator className="my-2" />
        <Section title="Boletos" total={totalBoleto} items={boletos} />
        <Separator className="my-2" />
        <div className="text-xl font-bold">Total: {totalCartao + totalBoleto}</div>
      </CardContent>
    </Card>
  );
}

function Section({ title, total, items }) {
  return (
    <>
      <Popover>
        <PopoverTrigger>
          {title}: {total}
        </PopoverTrigger>
        <PopoverContent>
          <p className="font-bold">{title}</p>

          {Object.entries(items).map(([descricao, valor]) => (
            <p key={descricao}>
              {descricao}: {valor}
            </p>
          ))}
        </PopoverContent>
      </Popover>
    </>
  );
}
