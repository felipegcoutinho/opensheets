import Header from "@/components/header";

export const metadata = {
  title: "opensheets",
  description:
    "Aplicação para finanças pessoais, com o objetivo de ajudar a organizar e controlar suas finanças.",
};

export default function RootLayout({ children }) {
  return (
    <>
      <Header />
      <main className="animate-in mx-auto flex max-w-(--breakpoint-2xl) flex-col px-2 antialiased max-sm:px-2">
        {children}
      </main>
    </>
  );
}
