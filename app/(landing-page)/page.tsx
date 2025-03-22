import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, PieChart, Shield, Wallet } from "lucide-react";

export default function Index() {
  const features = [
    {
      title: "Rastreamento de Despesas",
      description:
        "Registre todas as suas despesas diárias de forma fácil e eficaz.",
      icon: <Wallet className="h-6 w-6" />,
    },
    {
      title: "Orçamento Personalizado",
      description:
        "Crie orçamentos personalizados e saiba quanto você pode gastar em cada categoria.",
      icon: <PieChart className="h-6 w-6" />,
    },
    {
      title: "Relatórios Detalhados",
      description:
        "Visualize relatórios detalhados para entender melhor seus hábitos de gastos.",
      icon: <BarChart3 className="h-6 w-6" />,
    },
    {
      title: "Segurança dos Dados",
      description:
        "Seus dados financeiros são armazenados com segurança e privacidade em mente.",
      icon: <Shield className="h-6 w-6" />,
    },
  ];

  return (
    <div className="mt-20 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Hero Section */}
        <div className="mb-20 text-center">
          <h1 className="mb-6 text-5xl text-gray-900 dark:text-white">
            Controle Seus Gastos com Opensheets
          </h1>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-300">
            Bem-vindo ao Opensheets, a solução financeira definitiva para
            gerenciar seus gastos pessoais e manter suas finanças sob controle.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group dark:bg-card border-gray-200 bg-white transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-block rounded-lg p-3">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
