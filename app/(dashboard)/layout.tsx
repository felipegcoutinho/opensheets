import BannerData from "@/components/banner-data";
import UpcomingPaymentsBanner from "@/components/banner-upcoming-payments";
import NavPage from "@/components/sidebar/nav-page";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Topbar from "../../components/topbar";

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
        <header className="px-4">
          {/* Botão do menu para abrir a sidebar no mobile */}
          <SidebarTrigger aria-label="Abrir menu" />
        </header>
        <Topbar />

        <section className="px-4">
          <BannerData />
          <UpcomingPaymentsBanner />
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
