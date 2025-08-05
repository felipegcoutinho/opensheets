import MonthPicker from "@/components/month-picker/month-picker";

export const metadata = {
  title: "dashboard | opensheets",
};

export default function RootLayout({ children }) {
  return (
    <>
      <MonthPicker />
      {children}
    </>
  );
}
