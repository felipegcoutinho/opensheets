import BannerDescription from "@/components/banner-description";

export const metadata = {
  title: "Insights | opensheets",
};

export default function RootLayout({ children }) {
  return (
    <BannerDescription
      title="Insights"
      subtitle="Obtenha insights valiosos sobre suas finanças e tome decisões informadas."
      showMonthPicker={true}
    >
      {children}
    </BannerDescription>
  );
}
