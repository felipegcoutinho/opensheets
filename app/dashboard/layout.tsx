import MonthPicker from "@/components/month-picker";

export const metadata = {
  title: "OpenSheets | Dashboard",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function DashboardLayout({ children }) {
  return (
    <div>
      <MonthPicker />
      {children}
    </div>
  );
}
