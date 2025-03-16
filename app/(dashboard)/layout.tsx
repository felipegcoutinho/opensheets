import Banner from "@/components/banner-data";
import MonthPicker from "@/components/month-picker";
import NavPage from "@/components/sidebar/nav-page";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { Suspense } from "react";

export const metadata = {
  title: "Dashboard | openSheets",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <NavPage />
      <SidebarInset className="px-8">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="text-orange-400" size="icon" />
          </div>
        </header>
        <Banner />
        <Suspense>
          <MonthPicker />
        </Suspense>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
