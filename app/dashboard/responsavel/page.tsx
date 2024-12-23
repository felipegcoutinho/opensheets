import { UseDates } from "@/hooks/use-dates";
import {
  getResponsavelBillList,
  getResponsavelTransactionList,
} from "../../actions/users";
import UsersCard from "./users-card";

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
    if (!acc[item.responsavel].cartoes[descricaoCartao]) {
      acc[item.responsavel].cartoes[descricaoCartao] = {
        valor: 0,
        logo_image: item.cartoes?.logo_image,
      };
    }
    acc[item.responsavel].cartoes[descricaoCartao].valor += item.valor;
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
    <div className="my-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {Object.entries(groupedData).map(([responsavel, data]) => (
        <UsersCard
          key={responsavel}
          responsavel={responsavel}
          cartoes={data.cartoes}
          logo={data.logo_image}
          totalCartao={data.totalCartao}
          boletos={data.boletos}
          totalBoleto={data.totalBoleto}
        />
      ))}
    </div>
  );
}

export default page;
