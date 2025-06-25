import {
  getBillsByResponsible,
  getTransactionsByResponsible,
} from "@/app/actions/transactions/fetch_transactions";
import EmptyCard from "@/components/empty-card";
import { getMonth } from "@/hooks/get-month";
import UsersCard from "./users-card";

async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);

  const transactionsByResponsible = await getTransactionsByResponsible(month);
  const billsByResponsible = await getBillsByResponsible(month);

  if (!transactionsByResponsible.length || !billsByResponsible)
    return <EmptyCard />;

  if (!transactionsByResponsible.length) return <EmptyCard />;

  // Função para reorganizar o objeto
  function prioritizeResponsavel(data, prioridade) {
    const result = {};
    if (data[prioridade]) {
      result[prioridade] = data[prioridade]; // Coloca o responsável prioritário no início
    }
    for (const key in data) {
      if (key !== prioridade) {
        result[key] = data[key];
      }
    }
    return result;
  }

  // Agrupa Lançamentos e boletos por responsável
  const groupedData = transactionsByResponsible.reduce((acc, item) => {
    if (!acc[item.responsavel]) {
      acc[item.responsavel] = {
        cartoes: {},
        boletos: {},
        totalCartao: 0,
        totalBoleto: 0,
      };
    }

    const descricaoCartao = item.cartoes?.descricao || "Pix/Dinheiro/Débito";
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

  billsByResponsible.forEach((item) => {
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

  // Reorganiza os dados para priorizar o responsável "você"
  const prioritizedData = prioritizeResponsavel(groupedData, "você");

  return (
    <div className="my-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {Object.entries(prioritizedData).map(([responsavel, data]) => (
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
