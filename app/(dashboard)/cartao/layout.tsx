import BannerDescription from "@/components/banner-description";

export const metadata = {
  title: "Cartões | opensheets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BannerDescription
      title="Cartões"
      subtitle="Acompanhe todos os cartões criados, incluindo seus limites, faturas e transações."
    >
      {children}
    </BannerDescription>
  );
}
