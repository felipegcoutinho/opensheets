import BannerDescription from "@/components/banner-description";

export const metadata = {
  title: "Pagadores | opensheets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BannerDescription
      title="Pagadores"
      subtitle="Gerencie as pessoas ou entidades responsáveis pelos pagamentos."
    >
      {children}
    </BannerDescription>
  );
}
