import BannerData from "@/components/banner-data";
import UpcomingPaymentsBanner from "@/components/banner-upcoming-payments";
import NavPage from "@/components/sidebar/nav-page";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export const metadata = {
  title: "dashboard | opensheets",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <NavPage />

      <SidebarInset>
        <header>
          <div className="flex w-full items-center gap-1 rounded-b-xl px-4 py-2 lg:gap-2 lg:px-6">
            <SidebarTrigger size="icon" className="-ml-1" />
          </div>
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
