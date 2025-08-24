"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RiArrowUpLine,
  RiBankCardLine,
  RiBarChartLine,
  RiBookmark3Line,
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiPieChartLine,
  RiUserSmileLine,
  RiWalletLine,
} from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";

export default function Index() {
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
              <Button asChild size="lg">
                <Link href="/login">Começar agora</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Fazer login</Link>
              </Button>
            </div>
          </div>

          {/* Imagem/Mock do app */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="from-primary/30 absolute -inset-6 -z-10 rounded-2xl bg-gradient-to-tr via-sky-400/20 to-fuchsia-400/30 blur-2xl" />
            <Card className="border-primary/20 overflow-hidden">
              <div className="bg-muted/40">
                <Image
                  src="/empty_image.svg"
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

        {/* (removido) seção de logos */}
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <Card key={idx} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div
                  className={`mb-4 inline-flex items-center justify-center rounded-md p-2 ${
                    [
                      "bg-primary/10 text-primary",
                      "bg-sky-400/10 text-sky-500",
                      "bg-fuchsia-400/10 text-fuchsia-500",
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

      {/* Preview do Dashboard (mock) */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <Card className="border-primary/20 from-primary/[0.06] overflow-hidden bg-gradient-to-br to-transparent">
          <CardHeader>
            <CardTitle className="text-xl">
              Um preview do seu dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-md border p-4">
                <div className="bg-muted mb-3 h-4 w-24 rounded" />
                <div className="bg-muted mb-6 h-6 w-40 rounded" />
                <div className="grid grid-cols-6 items-end gap-1">
                  <div className="bg-primary/30 h-8" />
                  <div className="h-14 bg-sky-400/50" />
                  <div className="h-10 bg-fuchsia-400/40" />
                  <div className="bg-primary/60 h-16" />
                  <div className="h-9 bg-sky-400/40" />
                  <div className="h-6 bg-fuchsia-400/30" />
                </div>
              </div>
              <div className="rounded-md border p-4">
                <div className="bg-muted mb-3 h-4 w-28 rounded" />
                <ul className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <li key={i} className="flex items-center justify-between">
                      <div className="bg-muted h-3 w-32 rounded" />
                      <div className="bg-primary/20 h-3 w-12 rounded" />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-md border p-4">
                <div className="bg-muted mb-3 h-4 w-32 rounded" />
                <div className="space-y-2">
                  <div className="h-10 rounded bg-sky-400/20" />
                  <div className="h-10 rounded bg-fuchsia-400/20" />
                  <div className="bg-primary/20 h-10 rounded" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
                      "bg-primary/10 text-primary",
                      "bg-sky-400/10 text-sky-500",
                      "bg-fuchsia-400/10 text-fuchsia-500",
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
              <Button asChild>
                <Link href="/login">Criar conta</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/login">Entrar</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
