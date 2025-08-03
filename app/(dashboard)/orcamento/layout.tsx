import BannerDescription from "@/components/banner-description";

export const metadata = {
  title: "Orçamentos | opensheets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BannerDescription
      title="Orçamentos"
      subtitle="Gerencie seus orçamentos mensais por categorias. Acompanhe o progresso do seu orçamento e faça ajustes conforme necessário. Use o seletor
      abaixo para navegar pelos meses e visualizar os orçamentos correspondentes."
      showMonthPicker={true}
    >
      {children}
    </BannerDescription>
  );
}
