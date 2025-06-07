import { Card, CardContent } from "@/components/ui/card";
import BarChart3 from "remixicon-react/BarChart2LineIcon";
import PieChart from "remixicon-react/PieChart2LineIcon";
import Shield from "remixicon-react/ShieldLineIcon";
import Wallet from "remixicon-react/WalletLineIcon";
import Bell from "remixicon-react/BellLineIcon";
import TrendingUp from "remixicon-react/ArrowUpLineIcon";
import CreditCard from "remixicon-react/BankCardLineIcon";
import BadgeCheck from "remixicon-react/ShieldCheckLineIcon";
import MousePointer from "remixicon-react/MouseLineIcon";

export default function Index() {
  const features = [
    {
      title: "Rastreamento de Despesas",
      description:
        "Registre todas as suas despesas diárias de maneira simples e rápida.",
      icon: <Wallet className="h-6 w-6" />,
    },
    {
      title: "Orçamento Personalizado",
      description:
        "Defina limites de gastos por categoria e acompanhe seu progresso.",
      icon: <PieChart className="h-6 w-6" />,
    },
    {
      title: "Relatórios Detalhados",
      description:
        "Gráficos interativos que mostram para onde vai o seu dinheiro.",
      icon: <BarChart3 className="h-6 w-6" />,
    },
    {
      title: "Segurança de Dados",
      description:
        "Proteção total das suas informações com criptografia e backups.",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      title: "Integração Bancária",
      description:
        "Conecte suas contas bancárias e visualize tudo em um só lugar.",
      icon: <CreditCard className="h-6 w-6" />,
    },
    {
      title: "Alertas Inteligentes",
      description:
        "Receba notificações quando estiver perto de extrapolar seu orçamento.",
      icon: <Bell className="h-6 w-6" />,
    },
  ];

  const benefits = [
    {
      title: "Facilidade de Uso",
      description: "Interface intuitiva pensada para qualquer pessoa.",
      icon: <MousePointer className="h-6 w-6" />,
    },
    {
      title: "Controle Total",
      description:
        "Organize suas contas e metas financeiras em poucos cliques.",
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      title: "Gratuito",
      description: "Utilize todas as funcionalidades sem pagar nada.",
      icon: <BadgeCheck className="h-6 w-6" />,
    },
  ];

  return (
    <div className="mt-20 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Hero Section */}
        <div className="mb-20 text-center">
          <h1 className="mb-6 text-5xl text-gray-900 dark:text-white">
            Sua Vida Financeira Organizada com opensheets
          </h1>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-300">
            O opensheets é a maneira mais fácil de acompanhar despesas, planejar
            orçamentos e entender suas finanças em detalhes.
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

        {/* Benefits Section */}
        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="group dark:bg-card border-gray-200 bg-white transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-block rounded-lg p-3">
                  {benefit.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
