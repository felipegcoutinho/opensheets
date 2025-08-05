import BannerDescription from "@/components/banner-description";

export const metadata = {
  title: "Anotações | opensheets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BannerDescription
      title="Anotações"
      subtitle="Gerencie suas anotações e mantenha o controle sobre suas ideias e tarefas."
    >
      {children}
    </BannerDescription>
  );
}
