import BannerDescription from "@/components/banner-description";

export const metadata = {
  title: "Calendário | opensheets",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <BannerDescription
      title="Calendário"
      subtitle="Visualize e lance transações por dia. Clique em uma data para adicionar um lançamento."
    >
      {children}
    </BannerDescription>
  );
}

