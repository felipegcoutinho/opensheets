import { getUserSession } from "@/app/actions/users/fetch_users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function Index() {
  const session = await getUserSession();
  const isLoggedIn = Boolean((session as any)?.id);

  return (
    <div className="flex flex-col gap-20 pt-28">
      {/* Hero */}
      <section className="mx-auto max-w-4xl text-center">
        <Badge variant="outline" className="mb-4">
          Controle financeiro simples
        </Badge>
        <h1 className="mb-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Você tem 30 minutos para uma série, mas não 5 para suas finanças?
        </h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-balance">
          O opensheets ajuda você a acompanhar receitas, despesas, contas e
          cartões em um só lugar. Visualize métricas, acompanhe pagamentos e
          mantenha o orçamento sob controle.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {isLoggedIn ? (
            <Button asChild size="lg" className="shadow-sm">
              <Link href="/dashboard">Acesse seu dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg" className="shadow-sm">
                <Link href="/login/signup">Começar agora</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Fazer login</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="mx-auto max-w-4xl">
        <h2 className="mb-3 text-3xl font-semibold tracking-tight">
          Sobre o opensheets
        </h2>
        <p className="text-muted-foreground">
          Criamos uma ferramenta focada em tornar a gestão financeira pessoal
          descomplicada. No opensheets, você centraliza o registro de receitas e
          despesas, gerencia contas e cartões, acompanha orçamentos, e visualiza
          indicadores essenciais do seu mês. Sem ruído, sem complexidade
          desnecessária: apenas o que importa para você manter a vida financeira
          em dia.
        </p>
      </section>

      {/* Recursos / Soluções */}
      <section id="recursos" className="mx-auto w-full max-w-5xl">
        <h2 className="mb-6 text-center text-3xl font-semibold tracking-tight">
          Tudo o que você precisa
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard com indicadores</CardTitle>
              <CardDescription>
                KPIs, gráficos e visão geral do período.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Monitore gastos, receitas, tendências e status de pagamento em um
              único lugar.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Lançamentos e categorias</CardTitle>
              <CardDescription>
                Registre receitas e despesas com detalhes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Categorize, anexe observações e filtre facilmente para encontrar o
              que precisa.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contas e cartões</CardTitle>
              <CardDescription>
                Acompanhe saldos, faturas e pagamentos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Tenha clareza sobre vencimentos, parcelas e condições de
              pagamento.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Orçamentos e metas</CardTitle>
              <CardDescription>
                Defina limites e acompanhe a execução.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Compare o planejado vs. realizado e ajuste onde for necessário.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Calendário de pagamentos</CardTitle>
              <CardDescription>Evite atrasos e juros.</CardDescription>
            </CardHeader>
            <CardContent>
              Visualize compromissos por período e mantenha a rotina de
              pagamentos organizada.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pagadores e anotações</CardTitle>
              <CardDescription>
                Relacione transações a pessoas e registre notas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Tenha histórico por pagador e registre informações importantes
              para consultas futuras.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="mx-auto w-full max-w-5xl">
        <h2 className="mb-6 text-center text-3xl font-semibold tracking-tight">
          Como funciona
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>1. Crie sua conta</CardTitle>
              <CardDescription>Leva menos de 1 minuto.</CardDescription>
            </CardHeader>
            <CardContent>
              Acesse pelo e-mail e comece a organizar sua vida financeira agora.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>2. Configure e lance</CardTitle>
              <CardDescription>
                Contas, cartões, receitas e despesas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Registre seus dados e personalize categorias para refletir sua
              realidade.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>3. Acompanhe e ajuste</CardTitle>
              <CardDescription>
                Dashboards, orçamentos e relatórios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Acompanhe indicadores, compare períodos e faça ajustes com base em
              dados.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Seção de Preço */}
      <section id="preco" className="mx-auto w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Preço simples
          </h2>
          <p className="text-muted-foreground">
            Tudo o que você precisa por um valor acessível.
          </p>
        </div>

        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">Plano Mensal</CardTitle>
            <CardDescription>
              Sem complicação. Cancele quando quiser.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">R$ 6,99</span>
              <span className="text-muted-foreground">/ mês</span>
            </div>
            <ul className="mt-6 space-y-2 text-sm">
              <li>• Dashboard com indicadores</li>
              <li>• Controle de contas e cartões</li>
              <li>• Lançamentos e categorias</li>
              <li>• Orçamentos e relatórios</li>
            </ul>
          </CardContent>
          <CardFooter className="justify-between">
            <div className="text-muted-foreground text-xs">
              Sem taxas ocultas
            </div>
            {isLoggedIn ? (
              <Button asChild>
                <Link href="/dashboard">Ir para o dashboard</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login">Assinar por R$ 6,99/mês</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto w-full max-w-4xl">
        <h2 className="mb-4 text-3xl font-semibold tracking-tight">
          Perguntas frequentes
        </h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Posso cancelar quando quiser?</CardTitle>
            </CardHeader>
            <CardContent>
              Sim. O plano é mensal e você pode cancelar a qualquer momento.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Meus dados ficam seguros?</CardTitle>
            </CardHeader>
            <CardContent>
              Tratamos seus dados com cuidado e boas práticas. Você controla o
              que registra e pode remover quando quiser.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>O que preciso para começar?</CardTitle>
            </CardHeader>
            <CardContent>
              Apenas criar sua conta e começar a lançar suas movimentações.
              Simples assim.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contato / CTA final */}
      <section id="contato" className="mx-auto max-w-4xl text-center">
        <h2 className="mb-3 text-3xl font-semibold tracking-tight">
          Pronto para organizar suas finanças?
        </h2>
        <p className="text-muted-foreground mx-auto mb-6 max-w-2xl">
          Comece em poucos cliques e tenha clareza total do seu dinheiro.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {isLoggedIn ? (
            <Button asChild size="lg" className="shadow-sm">
              <Link href="/dashboard">Ir para o dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg" className="shadow-sm">
                <Link href="/login/signup">Criar conta</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Entrar</Link>
              </Button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
