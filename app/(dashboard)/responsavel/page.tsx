import {
  getBillsByResponsible,
  getTransactionsByResponsible,
} from "@/app/actions/transactions/fetch_transactions";
import EmptyCard from "@/components/empty-card";
import { getMonth } from "@/hooks/get-month";
import UsersCard from "./users-card";

async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);

  const [transactionsByResponsible, billsByResponsible] = await Promise.all([
    getTransactionsByResponsible(month),
    getBillsByResponsible(month),
  ]);

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
    const nome = item.pagador_id?.nome || "";
    if (!acc[nome]) {
      acc[nome] = {
        cartoes: {},
        boletos: {},
        totalCartao: 0,
        totalBoleto: 0,
      };
    }

    const descricaoCartao = item.cartoes?.descricao || "Pix/Dinheiro/Débito";
    if (!acc[nome].cartoes[descricaoCartao]) {
      acc[nome].cartoes[descricaoCartao] = {
        valor: 0,
        logo_image: item.cartoes?.logo_image,
      };
    }
    acc[nome].cartoes[descricaoCartao].valor += item.valor;
    acc[nome].totalCartao += item.valor;

    return acc;
  }, {});

  billsByResponsible.forEach((item) => {
    const nome = item.pagador_id?.nome || "";
    if (!groupedData[nome]) {
      groupedData[nome] = {
        cartoes: {},
        boletos: {},
        totalCartao: 0,
        totalBoleto: 0,
      };
    }

    const descricaoBoleto = item.descricao;
    groupedData[nome].boletos[descricaoBoleto] =
      (groupedData[nome].boletos[descricaoBoleto] || 0) + item.valor;
    groupedData[nome].totalBoleto += item.valor;
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
