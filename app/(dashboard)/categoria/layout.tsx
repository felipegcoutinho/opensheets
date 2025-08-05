import BannerDescription from "@/components/banner-description";

export const metadata = {
  title: "Categorias | opensheets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BannerDescription
      title="Categorias"
      subtitle="Gerencie suas categorias de despesas e receitas. Acompanhe o desempenho financeiro por categoria e faça ajustes conforme necessário."
    >
      {children}
    </BannerDescription>
  );
}
