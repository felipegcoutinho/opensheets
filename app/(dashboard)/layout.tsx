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
  title: "Dashboard | opensheets",
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
      <SidebarInset>
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-dashed transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
          <div className="flex w-full items-center gap-1 px-4 py-3 lg:gap-2 lg:px-6">
            <SidebarTrigger size="icon" className="-ml-1" />

            <div className="ml-auto flex items-center gap-2">
              {/* <ModeToggle /> */}
            </div>
          </div>
        </header>

        <div className="px-6">
          <Banner />
          <Suspense>
            <MonthPicker />
          </Suspense>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
