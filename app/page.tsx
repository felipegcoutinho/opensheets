import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center ">
      {/* <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <NextLogo />
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav> */}

      <Header />

      <div className="animate-in flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          <div className=" text-black h-screen">
            <header className=" py-4 text-black text-center">
              <h1 className="text-4xl font-bold">Controle Seus Gastos com Opensheets</h1>
            </header>
            <section className="container mx-auto p-8">
              <p className="text-xl">
                Bem-vindo ao Magic Sheets, a solução financeira definitiva para gerenciar seus gastos pessoais e manter suas finanças sob controle.
                Nunca foi tão fácil entender para onde seu dinheiro está indo.
              </p>
            </section>
            <section className="container mx-auto mt-8 p-8  bg-opacity-50  rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Recursos Principais</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <li>
                  <h3 className="text-xl font-semibold">Rastreamento de Despesas</h3>
                  <p>Registre todas as suas despesas diárias de forma fácil e eficaz.</p>
                </li>
                <li>
                  <h3 className="text-xl font-semibold">Orçamento Personalizado</h3>
                  <p>Crie orçamentos personalizados e saiba quanto você pode gastar em cada categoria.</p>
                </li>
                <li>
                  <h3 className="text-xl font-semibold">Relatórios Detalhados</h3>
                  <p>Visualize relatórios detalhados para entender melhor seus hábitos de gastos.</p>
                </li>
                <li>
                  <h3 className="text-xl font-semibold">Segurança dos Dados</h3>
                  <p>Seus dados financeiros são armazenados com segurança e privacidade em mente.</p>
                </li>
              </ul>
            </section>
            <section className="container mx-auto mt-8 p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Comece a Controlar suas Finanças Agora!</h2>
              <p>
                Não deixe suas finanças escaparem do controle. Registre-se no Magic Sheets hoje e comece a trilhar o caminho para uma vida financeira
                saudável.
              </p>
              <button className="bg-blue-500 hover:bg-blue-600 text-black font-bold py-2 px-4 mt-4 rounded-lg">Registre-se Agora</button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
