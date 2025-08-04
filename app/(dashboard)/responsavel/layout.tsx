import BannerDescription from "@/components/banner-description";

export const metadata = {
  title: "Responsáveis | opensheets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BannerDescription
      title="Responsáveis"
      subtitle="Visualize as despesas atribuídas a cada responsável. Acompanhe o desempenho financeiro de cada um e faça ajustes conforme necessário. Use o seletor
      abaixo para navegar pelos meses e visualizar as despesas correspondentes."
    >
      {children}
    </BannerDescription>
  );
}
