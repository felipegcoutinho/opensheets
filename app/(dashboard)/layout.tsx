import { AppSidebar } from "@/components/app-sidebar";
import Banner from "@/components/banner-data";
import MonthPicker from "@/components/month-picker";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Suspense } from "react";

export const metadata = {
  title: "Dashboard | openSheets",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="px-8">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger size="lg-badge" />
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
