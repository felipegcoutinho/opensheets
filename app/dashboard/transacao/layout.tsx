import { Suspense } from "react";

export const metadata = {
  title: "Transações | openSheets",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({ children }) {
  return (
    <Suspense
      fallback={<p>Aguarde um momento, estamos carregando a página ...</p>}
    >
      {children}
    </Suspense>
  );
}
