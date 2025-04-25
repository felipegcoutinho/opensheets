import { getTransactions } from "@/app/services/transacoes";
import { getPeriodo } from "@/hooks/periodo";
import Dashboard from "./dashboard";

async function page(props) {
  const month = await getPeriodo(props);
  const lancamentos = await getTransactions(month);

  const analysisRequest = {
    messages: [
      {
        role: "system",
        content:
          "Você é um assistente financeiro. Analise os lançamentos financeiros abaixo e forneça uma análise detalhada.",
      },
      {
        role: "user",
        content: JSON.stringify(lancamentos), // Aqui passamos os dados dos lançamentos para a IA
      },
    ],
  };

  const result = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(analysisRequest),
  });

  const analysis = await result.json();

  return (
    <div>
      <Dashboard lancamentos={lancamentos} analysis={analysis} />
    </div>
  );
}

export default page;
