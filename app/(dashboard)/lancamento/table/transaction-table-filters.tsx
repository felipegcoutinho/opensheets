"use client";

import type { BudgetRuleConfig } from "@/app/(dashboard)/orcamento/rule/budget-rule";
import {
  BUDGET_RULE_BUCKETS,
  formatBucketLabel,
} from "@/app/(dashboard)/orcamento/rule/budget-rule";
import PaymentMethodLogo from "@/components/payment-method-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryIconsMap } from "@/hooks/use-category-icons";
import { Table } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import CreateTransactions from "../modal/create-transactions"; // Ajuste o caminho conforme necessário
import { ComboboxFilter } from "./combo-filter"; // Ajuste o caminho conforme necessário

interface TransactionTableFiltersProps<TData> {
  table: Table<TData>; // Adicionado para acesso a métodos/estados da tabela se necessário
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  getColumnFilterValue: (columnId: string) => string;
  setColumnFilterValue: (columnId: string, value: string) => void;
  getAccount: any; // Mantenha os tipos originais ou melhore-os
  getCards: any;
  getCategorias: any;
  hidden?: boolean;
  tipoTransacaoOptions: string[];
  condicaoOptions: string[];
  formaPagamentoOptions: string[];
  responsavelOptions: string[];
  categoriaOptions: string[];
  contaCartaoOptions: string[];
  budgetRule: BudgetRuleConfig;
}

export function TransactionTableFilters<TData>({
  globalFilter,
  setGlobalFilter,
  getColumnFilterValue,
  setColumnFilterValue,
  getAccount,
  getCards,
  getCategorias,
  hidden,
  tipoTransacaoOptions,
  condicaoOptions,
  formaPagamentoOptions,
  responsavelOptions,
  categoriaOptions,
  contaCartaoOptions,
  budgetRule,
}: TransactionTableFiltersProps<TData>) {
  if (hidden) {
    return null;
  }

  // URL <-> Filtros: sincronização
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = useRef(false);

  // Mapeamento entre ids de coluna e nomes de params
  const filterParamKeys = useMemo(
    () => ({
      tipo_transacao: "tipo_transacao",
      condicao: "condicao",
      forma_pagamento: "forma_pagamento",
      responsavel: "responsavel",
      categoria: "categoria",
      conta_cartao: "conta_cartao",
      regra_502030_tipo: "regra_502030_tipo",
      q: "q", // busca global
    }),
    [],
  );

  // Inicializa filtros a partir da URL (executa uma vez)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const params = searchParams;

    const maybeSet = (columnId: string, paramKey: string) => {
      const v = params.get(paramKey);
      if (v && v !== "all" && v !== "todas") {
        setColumnFilterValue(columnId, v);
      }
    };

    maybeSet("tipo_transacao", filterParamKeys.tipo_transacao);
    maybeSet("condicao", filterParamKeys.condicao);
    maybeSet("forma_pagamento", filterParamKeys.forma_pagamento);
    maybeSet("responsavel", filterParamKeys.responsavel);
    maybeSet("categoria", filterParamKeys.categoria);
    maybeSet("conta_cartao", filterParamKeys.conta_cartao);
    maybeSet("regra_502030_tipo", filterParamKeys.regra_502030_tipo);

    const q = params.get(filterParamKeys.q);
    if (q) setGlobalFilter(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lê valores atuais dos filtros
  const currentFilters = {
    tipo_transacao: getColumnFilterValue("tipo_transacao"),
    condicao: getColumnFilterValue("condicao"),
    forma_pagamento: getColumnFilterValue("forma_pagamento"),
    responsavel: getColumnFilterValue("responsavel"),
    categoria: getColumnFilterValue("categoria"),
    conta_cartao: getColumnFilterValue("conta_cartao"),
    regra_502030_tipo: getColumnFilterValue("regra_502030_tipo"),
    q: globalFilter,
  };

  // Atualiza a URL quando filtros mudarem
  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());

    const setOrDelete = (key: string, value?: string) => {
      const v = (value || "").trim();
      if (!v || v === "all" || v === "todas") params.delete(key);
      else params.set(key, v);
    };

    setOrDelete(filterParamKeys.tipo_transacao, currentFilters.tipo_transacao);
    setOrDelete(filterParamKeys.condicao, currentFilters.condicao);
    setOrDelete(
      filterParamKeys.forma_pagamento,
      currentFilters.forma_pagamento,
    );
    setOrDelete(filterParamKeys.responsavel, currentFilters.responsavel);
    setOrDelete(filterParamKeys.categoria, currentFilters.categoria);
    setOrDelete(filterParamKeys.conta_cartao, currentFilters.conta_cartao);
    setOrDelete(
      filterParamKeys.regra_502030_tipo,
      currentFilters.regra_502030_tipo,
    );
    setOrDelete(filterParamKeys.q, currentFilters.q);

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentFilters.tipo_transacao,
    currentFilters.condicao,
    currentFilters.forma_pagamento,
    currentFilters.responsavel,
    currentFilters.categoria,
    currentFilters.conta_cartao,
    currentFilters.regra_502030_tipo,
    currentFilters.q,
    pathname,
  ]);

  // Reage a mudanças externas na URL (ex.: botão voltar/avançar)
  useEffect(() => {
    if (!initialized.current) return;

    const params = searchParams;

    const setIfChanged = (columnId: string, paramKey: string) => {
      const urlV = params.get(paramKey) || "";
      const curV = getColumnFilterValue(columnId) || "";
      if ((urlV || curV) && urlV !== curV) {
        setColumnFilterValue(columnId, urlV);
      }
    };

    setIfChanged("tipo_transacao", filterParamKeys.tipo_transacao);
    setIfChanged("condicao", filterParamKeys.condicao);
    setIfChanged("forma_pagamento", filterParamKeys.forma_pagamento);
    setIfChanged("responsavel", filterParamKeys.responsavel);
    setIfChanged("categoria", filterParamKeys.categoria);
    setIfChanged("conta_cartao", filterParamKeys.conta_cartao);
    setIfChanged("regra_502030_tipo", filterParamKeys.regra_502030_tipo);

    const urlQ = params.get(filterParamKeys.q) || "";
    if ((urlQ || globalFilter) && urlQ !== globalFilter) {
      setGlobalFilter(urlQ);
    }
  }, [searchParams?.toString()]);

  return (
    <div className="mb-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <CreateTransactions
        getCards={getCards}
        getAccount={getAccount}
        getCategorias={getCategorias}
        budgetRule={budgetRule}
      >
        <Button
          variant="default"
          className="w-full transition-all hover:scale-110 sm:w-auto"
        >
          Novo Lançamento
        </Button>
      </CreateTransactions>

      <div className="flex w-full flex-col items-start gap-2 sm:w-auto sm:flex-row sm:items-center">
        <Select
          value={getColumnFilterValue("tipo_transacao")}
          onValueChange={(value) =>
            setColumnFilterValue("tipo_transacao", value)
          }
        >
          <SelectTrigger
            className={`w-full border border-dashed shadow-none sm:w-[130px] ${
              getColumnFilterValue("tipo_transacao") &&
              getColumnFilterValue("tipo_transacao") !== "all"
                ? "ring-primary bg-primary/10 font-bold ring-1"
                : ""
            }`}
          >
            <SelectValue placeholder="Transação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <span className="capitalize">Todos</span>
            </SelectItem>
            {tipoTransacaoOptions.map((option) => (
              <SelectItem key={option} value={option}>
                <span className="capitalize">{option}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={getColumnFilterValue("condicao")}
          onValueChange={(value) => setColumnFilterValue("condicao", value)}
        >
          <SelectTrigger
            className={`w-full border border-dashed shadow-none sm:w-[130px] ${
              getColumnFilterValue("condicao") &&
              getColumnFilterValue("condicao") !== "all"
                ? "ring-primary bg-primary/10 font-bold ring-1"
                : ""
            }`}
          >
            <SelectValue placeholder="Condição" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <span className="capitalize">Todos</span>
            </SelectItem>
            {condicaoOptions.map((option) => (
              <SelectItem key={option} value={option}>
                <span className="capitalize">{option}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={getColumnFilterValue("forma_pagamento")}
          onValueChange={(value) =>
            setColumnFilterValue("forma_pagamento", value)
          }
        >
          <SelectTrigger
            className={`w-full border border-dashed shadow-none sm:w-[130px] ${
              getColumnFilterValue("forma_pagamento") &&
              getColumnFilterValue("forma_pagamento") !== "all"
                ? "ring-primary bg-primary/10 font-bold ring-1"
                : ""
            }`}
          >
            <SelectValue placeholder="Pagamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <span className="capitalize">Todas</span>
            </SelectItem>
            {formaPagamentoOptions.map((option) => (
              <SelectItem key={option} value={option}>
                <span className="capitalize">{option}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={getColumnFilterValue("responsavel")}
          onValueChange={(value) => setColumnFilterValue("responsavel", value)}
        >
          <SelectTrigger
            className={`w-full border border-dashed shadow-none sm:w-[130px] ${
              getColumnFilterValue("responsavel") &&
              getColumnFilterValue("responsavel") !== "all"
                ? "ring-primary bg-primary/10 font-bold ring-1"
                : ""
            }`}
          >
            <SelectValue placeholder="Pagador" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <span className="capitalize">Todos</span>
            </SelectItem>
            {responsavelOptions.map((option) => (
              <SelectItem key={option} value={option}>
                <span className="capitalize">{option}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={getColumnFilterValue("regra_502030_tipo")}
          onValueChange={(value) =>
            setColumnFilterValue("regra_502030_tipo", value)
          }
        >
          <SelectTrigger
            className={`w-full border border-dashed shadow-none sm:w-[130px] ${
              getColumnFilterValue("regra_502030_tipo") &&
              getColumnFilterValue("regra_502030_tipo") !== "all"
                ? "ring-primary bg-primary/10 font-bold ring-1"
                : ""
            }`}
          >
            <SelectValue placeholder="Regra" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <span className="capitalize">Todas</span>
            </SelectItem>
            {BUDGET_RULE_BUCKETS.map((bucket) => (
              <SelectItem key={bucket} value={bucket}>
                <span className="capitalize">{formatBucketLabel(bucket)}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ComboboxFilter
          placeholder="Categoria"
          options={categoriaOptions}
          value={getColumnFilterValue("categoria")}
          onChange={(value) =>
            setColumnFilterValue("categoria", value as string)
          }
          getIcon={(nome) => {
            const cat = getCategorias?.find?.((c) => c.nome === nome);
            const Icon = cat ? categoryIconsMap[cat.icone] : undefined;
            return Icon ? <Icon className="mr-2 h-4 w-4" /> : null;
          }}
        />

        <ComboboxFilter
          placeholder="Conta/Cartão"
          options={contaCartaoOptions}
          value={getColumnFilterValue("conta_cartao")}
          onChange={(value) =>
            setColumnFilterValue("conta_cartao", value as string)
          }
          getIcon={(desc) => {
            const conta = getAccount?.find?.((a) => a.descricao === desc);
            const cartao = getCards?.find?.((c) => c.descricao === desc);
            const logo = conta?.logo_image || cartao?.logo_image;
            return logo ? (
              <PaymentMethodLogo
                url_name={`/logos/${logo}`}
                width={20}
                height={20}
              />
            ) : null;
          }}
        />

        <Input
          placeholder="Pesquisar"
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="w-full shadow-none sm:w-[110px]"
        />
      </div>
    </div>
  );
}
