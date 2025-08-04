import BannerDescription from "@/components/banner-description";

export const metadata = {
  title: "Contas | opensheets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BannerDescription
      title="Contas"
      subtitle="Acompanhe suas contas bancárias, incluindo contas ativas e inativas, saldos, transações e extratos."
    >
      {children}
    </BannerDescription>
  );
}
