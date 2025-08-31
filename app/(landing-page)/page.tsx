import { getUserSession } from "@/app/actions/users/fetch_users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RiArrowUpLine,
  RiBankCardLine,
  RiBarChartLine,
  RiBookmark3Line,
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiFlashlightLine,
  RiMailLine,
  RiPieChartLine,
  RiShieldCheckLine,
  RiUserSmileLine,
  RiWalletLine,
} from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";

export default async function Index() {
  const session = await getUserSession();
  const isLoggedIn = Boolean((session as any)?.id);
  const features = [
    {
      title: "Contas e Saldos",
      description:
        "Acompanhe saldos consolidados e detalhes por conta em tempo real.",
      icon: <RiBarChartLine className="h-6 w-6" />,
    },
    {
      title: "Faturas e Boletos",
      description: "Visualize faturas do mês e boletos com status e valores.",
      icon: <RiBankCardLine className="h-6 w-6" />,
    },
    {
      title: "Lançamentos Recentes",
      description:
        "Veja rapidamente seus últimos lançamentos e filtre por categoria.",
      icon: <RiWalletLine className="h-6 w-6" />,
    },
    {
      title: "Status de Pagamento",
      description: "Resumo de pagos e pendentes para decisões mais rápidas.",
      icon: <RiCheckboxCircleLine className="h-6 w-6" />,
    },
    {
      title: "Orçamentos e Categorias",
      description:
        "Defina metas por categoria e acompanhe o previsto vs. realizado.",
      icon: <RiPieChartLine className="h-6 w-6" />,
    },
    {
      title: "Condições de Pagamento",
      description: "Entenda como você paga e otimize seus meios de pagamento.",
      icon: <RiBookmark3Line className="h-6 w-6" />,
    },
  ];

  const steps = [
    {
      title: "Crie sua conta",
      description: "Leva menos de 1 minuto para começar.",
      icon: <RiUserSmileLine className="h-6 w-6" />,
    },
    {
      title: "Adicione suas contas",
      description: "Cadastre contas, categorias e orçamentos.",
      icon: <RiCalendarLine className="h-6 w-6" />,
    },
    {
      title: "Acompanhe o progresso",
      description: "Veja gráficos, alertas e insights no dashboard.",
      icon: <RiArrowUpLine className="h-6 w-6" />,
    },
  ];

  const testimonials = [
    {
      name: "Mariana S.",
      role: "Profissional Autônoma",
      avatar: "/avatars/undraw_professional-woman-avatar_ivds.png",
      quote:
        "Finalmente consigo visualizar tudo em um só lugar. Meu controle financeiro melhorou muito!",
    },
    {
      name: "Carlos A.",
      role: "Analista",
      avatar: "/avatars/undraw_finance-guy-avatar_vhop.png",
      quote:
        "Os resumos de pagamento e os alertas me ajudam a não perder prazos.",
    },
    {
      name: "João P.",
      role: "Empreendedor",
      avatar: "/avatars/undraw_male-avatar_zkzx.png",
      quote:
        "O dashboard é direto e útil. Em poucos cliques tenho o que preciso.",
    },
  ];

  return (
    <div className="mt-20 min-h-screen">
      {/* Hero com cor e ilustrações */}
      <section className="relative isolate">
        {/* Fundo gradiente decorativo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_10%_-20%,hsl(var(--primary)/.15),transparent),radial-gradient(1000px_500px_at_110%_10%,#22d3ee20,transparent)] dark:bg-[radial-gradient(1200px_600px_at_10%_-20%,hsl(var(--primary)/.12),transparent),radial-gradient(1000px_500px_at_110%_10%,#22d3ee15,transparent)]"
        />

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-16 md:grid-cols-2">
          {/* Texto */}
          <div className="text-center md:text-left">
            <span className="bg-background/60 text-foreground/70 inline-flex items-center rounded-full border px-3 py-1 text-xs backdrop-blur">
              Organize suas finanças com simplicidade
            </span>
            <h1 className="text-foreground mt-4 text-4xl leading-tight font-semibold text-balance sm:text-5xl">
              Controle total do seu dinheiro em um único lugar
            </h1>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg md:mx-0">
              O opensheets centraliza contas, faturas, lançamentos e orçamentos
              em um dashboard claro, rápido e seguro.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 md:justify-start">
              {isLoggedIn ? (
                <Button asChild size="lg">
                  <Link href="/dashboard">Acesse seu dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg">
                    <Link href="/login">Começar agora</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/login">Fazer login</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Imagem/Mock do app */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="from-primary/30 absolute -inset-6 -z-10 rounded-2xl bg-gradient-to-tr via-sky-400/20 to-fuchsia-400/30 blur-2xl" />
            <Card className="border-primary/20 overflow-hidden">
              <div className="bg-muted/40">
                <Image
                  src="/landing/preview.png"
                  alt="Preview do opensheets"
                  width={1200}
                  height={800}
                  className="h-auto w-full"
                  priority
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 text-center md:text-left">
          <span className="bg-background/60 text-foreground/70 inline-flex items-center rounded-full border px-3 py-1 text-xs backdrop-blur">
            Sobre o produto
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            O jeito moderno de cuidar do seu dinheiro
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Centralize contas, cartões, faturas, lançamentos e orçamentos. Menos
            atrito, mais clareza para agir com confiança.
          </p>
        </div>
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          {/* Coluna: texto + destaques */}
          <div className="leading-relaxed text-pretty">
            <div className="bg-card rounded-2xl border p-6 shadow-sm">
              <p className="text-foreground/90">
                O opensheets foi projetado para eliminar a bagunça financeira do
                dia a dia. Em poucos cliques, você entende saldos, vencimentos e
                prioridades — sem planilhas complexas ou telas cheias de
                distrações.
              </p>
              <ul className="mt-6 grid gap-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="bg-secondary text-primary inline-flex size-8 shrink-0 items-center justify-center rounded-md">
                    <RiFlashlightLine className="size-4" />
                  </span>
                  <div>
                    <div className="font-medium">Automação simples</div>
                    <p className="text-muted-foreground mt-0.5">
                      Alertas e lembretes acionáveis para não perder prazos.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-secondary text-primary inline-flex size-8 shrink-0 items-center justify-center rounded-md">
                    <RiShieldCheckLine className="size-4" />
                  </span>
                  <div>
                    <div className="font-medium">Segurança por padrão</div>
                    <p className="text-muted-foreground mt-0.5">
                      Sessões protegidas e dados tratados com cuidado.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-secondary text-primary inline-flex size-8 shrink-0 items-center justify-center rounded-md">
                    <RiArrowUpLine className="size-4" />
                  </span>
                  <div>
                    <div className="font-medium">Foco em resultado</div>
                    <p className="text-muted-foreground mt-0.5">
                      Interface leve que destaca o que importa.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Coluna: métricas rápidas */}
          <div className="grid grid-cols-3 gap-3 md:grid-cols-3">
            <div className="rounded-lg border p-5 text-center">
              <div className="text-2xl font-semibold">1 min</div>
              <div className="text-muted-foreground mt-1 text-xs">
                para começar
              </div>
            </div>
            <div className="rounded-lg border p-5 text-center">
              <div className="text-2xl font-semibold">0 atritos</div>
              <div className="text-muted-foreground mt-1 text-xs">
                UX direto ao ponto
              </div>
            </div>
            <div className="rounded-lg border p-5 text-center">
              <div className="text-2xl font-semibold">+produtivo</div>
              <div className="text-muted-foreground mt-1 text-xs">
                menos tempo em planilhas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Soluções */}
      <section id="solucoes" className="mx-auto max-w-6xl px-4 pb-4">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold tracking-tight">Soluções</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Recursos que simplificam a organização e dão clareza.
          </p>
        </div>
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-start gap-3 p-6">
              <span className="bg-secondary text-primary inline-flex size-9 items-center justify-center rounded-md">
                <RiFlashlightLine className="size-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">Automação</h3>
                <p className="text-muted-foreground mt-1 text-xs">
                  Fluxos simples para alertas e follow‑ups automáticos.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-3 p-6">
              <span className="bg-secondary text-primary inline-flex size-9 items-center justify-center rounded-md">
                <RiShieldCheckLine className="size-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">Segurança</h3>
                <p className="text-muted-foreground mt-1 text-xs">
                  Sessões seguras e dados protegidos por padrão.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-3 p-6">
              <span className="bg-secondary text-primary inline-flex size-9 items-center justify-center rounded-md">
                <RiArrowUpLine className="size-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">Desempenho</h3>
                <p className="text-muted-foreground mt-1 text-xs">
                  Interface rápida, com foco no que importa.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <Card key={idx} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div
                  className={`mb-4 inline-flex items-center justify-center rounded-md p-2 ${
                    [
                      "bg-secondary text-primary",
                      "bg-secondary text-primary",
                      "bg-secondary text-primary",
                    ][idx % 3]
                  }`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="mx-auto max-w-6xl px-4 py-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((step, idx) => (
            <Card key={idx} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div
                  className={`mb-4 inline-flex items-center justify-center rounded-md p-2 ${
                    [
                      "bg-secondary text-primary",
                      "bg-secondary text-primary",
                      "bg-chart text-primary",
                    ][idx % 3]
                  }`}
                >
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Depoimentos */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold">
            O que dizem nossos usuários
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Resultados reais com um controle financeiro simples.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <Card key={idx} className="border-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {t.role}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mt-4 text-sm italic">
                  “{t.quote}”
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-3xl font-semibold tracking-tight">Contato</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Fale com a gente para dúvidas, sugestões ou parcerias.
          </p>
        </div>
        <div className="grid grid-cols-1 items-start gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <span className="bg-secondary text-primary inline-flex size-9 items-center justify-center rounded-md">
                  <RiMailLine className="size-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">E-mail</h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Estamos disponíveis para responder rapidamente.
                  </p>
                  <div className="mt-3">
                    <a
                      className="text-primary underline underline-offset-4"
                      href="mailto:contato@opensheets.app"
                    >
                      contato@opensheets.app
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <Card className="from-primary/[0.06] border-dashed bg-gradient-to-r via-transparent to-sky-400/[0.06]">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h3 className="text-xl font-semibold">Pronto para começar?</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Crie sua conta gratuitamente e comece a organizar suas finanças
                hoje.
              </p>
            </div>
            <div className="flex gap-3">
              {isLoggedIn ? (
                <Button asChild>
                  <Link href="/dashboard">Acesse seu dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild>
                    <Link href="/login">Criar conta</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/login">Entrar</Link>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
