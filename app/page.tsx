export default async function Index() {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-20">
      <div className="flex max-w-4xl flex-1 flex-col gap-20 px-3 animate-in">
        <main className="flex flex-1 flex-col gap-6">
          <div className="h-screen text-black">
            <header className="py-4 text-center">
              <h1 className="text-4xl font-bold text-black dark:text-white">
                Controle Seus Gastos com Opensheets
              </h1>
            </header>
            <section className="container mx-auto p-8 text-black dark:text-white">
              <p className="text-xl">
                Bem-vindo ao Magic Sheets, a solução financeira definitiva para
                gerenciar seus gastos pessoais e manter suas finanças sob
                controle. Nunca foi tão fácil entender para onde seu dinheiro
                está indo.
              </p>
            </section>
            <section className="container mx-auto mt-8 rounded bg-opacity-50 p-8 text-black dark:text-white">
              <h2 className="mb-4 text-2xl font-bold">Recursos Principais</h2>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <li>
                  <h3 className="text-xl font-semibold">
                    Rastreamento de Despesas
                  </h3>
                  <p>
                    Registre todas as suas despesas diárias de forma fácil e
                    eficaz.
                  </p>
                </li>
                <li>
                  <h3 className="text-xl font-semibold">
                    Orçamento Personalizado
                  </h3>
                  <p>
                    Crie orçamentos personalizados e saiba quanto você pode
                    gastar em cada categoria.
                  </p>
                </li>
                <li>
                  <h3 className="text-xl font-semibold">
                    Relatórios Detalhados
                  </h3>
                  <p>
                    Visualize relatórios detalhados para entender melhor seus
                    hábitos de gastos.
                  </p>
                </li>
                <li>
                  <h3 className="text-xl font-semibold">Segurança dos Dados</h3>
                  <p>
                    Seus dados financeiros são armazenados com segurança e
                    privacidade em mente.
                  </p>
                </li>
              </ul>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
