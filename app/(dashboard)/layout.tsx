import BannerData from "@/components/banner-data";
import UpcomingPaymentsBanner from "@/components/banner-upcoming-payments";
import NavPage from "@/components/sidebar/nav-page";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import AskNameModal from "@/components/auth/ask-name-modal";
import { getAuthProviders, getFirstName, getLastName } from "@/app/actions/users/fetch_users";

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
  const [firstName, lastName, providers] = await Promise.all([
    getFirstName(),
    getLastName(),
    getAuthProviders(),
  ]);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <NavPage />

      <SidebarInset>
        <header>
          <div className="flex w-full items-center gap-1 px-4 py-2 lg:gap-2 lg:px-6">
            <SidebarTrigger size="icon" className="-ml-1" />
          </div>
        </header>
        <section className="px-4">
          <BannerData />
          <UpcomingPaymentsBanner />
          {/* Solicita nome apenas para login via magic link (providers contém 'email') */}
          {providers?.includes("email") && !providers?.includes("google") ? (
            <AskNameModal firstName={firstName} lastName={lastName} />
          ) : null}
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
