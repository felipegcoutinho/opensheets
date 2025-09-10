import BannerData from "@/components/banner-data";
import UpcomingPaymentsBanner from "@/components/banner-upcoming-payments";
import NavPage from "@/components/sidebar/nav-page";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata = {
  title: "dashboard | opensheets",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider open={true}>
      <NavPage />

      <SidebarInset>
        <header>
          <div className="flex w-full items-center gap-1 rounded-b-xl px-4 py-2 lg:gap-2 lg:px-6" />
        </header>
        <section className="px-4">
          <BannerData />
          <UpcomingPaymentsBanner />
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
