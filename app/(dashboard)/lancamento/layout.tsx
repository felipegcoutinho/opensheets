import BannerDescription from "@/components/banner-description";

export const metadata = {
  title: "Lançamentos | Opensheets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BannerDescription
      title="Lançamentos"
      subtitle="Acompanhe todos os lançamentos financeiros do mês selecionado incluindo receitas, despesas e transações previstas. Use o seletor
      abaixo para navegar pelos meses e visualizar as movimentações
      correspondentes."
      showMonthPicker={true}
    >
      {children}
    </BannerDescription>
  );
}
