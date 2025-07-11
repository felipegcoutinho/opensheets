import BannerData from "@/components/banner-data";
import UpcomingPaymentsBanner from "@/components/upcoming-payments-banner";
import MonthPicker from "@/components/month-picker/month-picker";
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
          <div className="flex w-full items-center gap-1 px-4 py-2 lg:gap-2 lg:px-6">
            <SidebarTrigger size="icon" className="-ml-1" />
          </div>
        </header>
        <div className="px-6">
          <BannerData />
          <UpcomingPaymentsBanner />
          <MonthPicker />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
