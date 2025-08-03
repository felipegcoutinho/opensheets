import BannerDescription from "@/components/banner-description";

export const metadata = {
  title: "Ajustes | opensheets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BannerDescription
      title="Ajustes"
      subtitle="Personalize suas preferências e configurações."
      showMonthPicker={false}
    >
      {children}
    </BannerDescription>
  );
}
