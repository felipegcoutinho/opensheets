"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import PaymentMethodLogo from "@/components/payment-method-logo";
import { Switch } from "@/components/ui/switch";
import { UseDates } from "@/hooks/use-dates";
import UseStyles from "@/hooks/use-styles";

const CARD_PAYMENT_KEYWORDS = new Set([
  "cartão de crédito",
  "cartao de credito",
  "crédito",
  "credito",
]);

type OnlyCardsListener = (value: boolean) => void;

let sharedOnlyCards = false;
let sharedOnlyCardsInitialized = false;
const sharedListeners = new Set<OnlyCardsListener>();

function initializeSharedOnlyCards() {
  if (sharedOnlyCardsInitialized) return;
  if (typeof window === "undefined") return;
  try {
    const saved = window.sessionStorage.getItem("top-expenses-only-cards");
    if (saved === "true" || saved === "false") {
      sharedOnlyCards = saved === "true";
    }
  } catch {
    // ignore storage errors
  } finally {
    sharedOnlyCardsInitialized = true;
  }
}

function setSharedOnlyCards(value: boolean) {
  sharedOnlyCards = value;
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(
        "top-expenses-only-cards",
        value ? "true" : "false",
      );
    } catch {
      // ignore storage errors
    }
  }
  sharedListeners.forEach((listener) => listener(sharedOnlyCards));
}

function useSharedOnlyCardsState() {
  const [value, setValue] = useState(() => {
    if (typeof window !== "undefined") {
      initializeSharedOnlyCards();
    }
    return sharedOnlyCards;
  });

  useEffect(() => {
    initializeSharedOnlyCards();
    setValue(sharedOnlyCards);

    const listener: OnlyCardsListener = (next) => setValue(next);
    sharedListeners.add(listener);
    return () => {
      sharedListeners.delete(listener);
    };
  }, []);

  const update = useCallback((next: boolean) => {
    if (next === sharedOnlyCards) return;
    setSharedOnlyCards(next);
  }, []);

  return [value, update] as const;
}

type TopExpense = {
  id: string;
  data_compra: string;
  descricao: string;
  valor: number | string;
  forma_pagamento?: string | null;
  cartoes?: {
    id?: string | null;
    logo_image?: string | null;
  } | null;
  contas?: {
    id?: string | null;
    logo_image?: string | null;
  } | null;
};

function normalizePaymentMethod(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

function isCardTransaction(item: TopExpense) {
  const payment = normalizePaymentMethod(item.forma_pagamento);
  if (CARD_PAYMENT_KEYWORDS.has(payment)) return true;
  return Boolean(item.cartoes);
}

function toNumericValue(value: TopExpense["valor"]) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function TopExpensesWidget({
  transactions,
}: {
  transactions: TopExpense[] | null | undefined;
}) {
  const { DateFormat } = UseDates();
  const { getLogo } = UseStyles();
  const [onlyCards, setOnlyCards] = useSharedOnlyCardsState();

  const normalizedTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return [] as TopExpense[];
    return transactions.filter(Boolean) as TopExpense[];
  }, [transactions]);

  const topAll = useMemo(
    () => normalizedTransactions.slice(0, 10),
    [normalizedTransactions],
  );

  const topCards = useMemo(
    () => normalizedTransactions.filter(isCardTransaction).slice(0, 10),
    [normalizedTransactions],
  );

  const displayedTransactions = onlyCards ? topCards : topAll;
  const emptyStateMessage = onlyCards
    ? "Sem despesas de cartões de crédito no período selecionado."
    : "Sem dados para exibir no período selecionado.";

  if (normalizedTransactions.length === 0) {
    return <EmptyCard message={emptyStateMessage} />;
  }

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center justify-between gap-y-2 pb-3">
        <span className="text-muted-foreground text-xs">
          {onlyCards
            ? "Apenas despesas pagas com cartões."
            : "Despesas com boletos e cartões."}
        </span>
        <div className="flex items-center gap-2">
          <label
            htmlFor="top-expenses-only-cards"
            className="text-muted-foreground cursor-pointer text-xs"
          >
            Somente cartões
          </label>
          <Switch
            id="top-expenses-only-cards"
            checked={onlyCards}
            onCheckedChange={setOnlyCards}
            aria-label="Alternar para visualizar somente despesas de cartões"
          />
        </div>
      </div>
      {displayedTransactions.length === 0 ? (
        <EmptyCard message={emptyStateMessage} />
      ) : (
        <div>
          {displayedTransactions.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-dashed py-0 last:border-0"
            >
              <div className="flex items-center">
                <PaymentMethodLogo
                  url_name={`/logos/${getLogo(item)}`}
                  height={40}
                  width={40}
                />
                <div className="flex flex-col items-start gap-1 py-2 text-sm capitalize">
                  {item.descricao}
                  <span className="text-muted-foreground text-xs font-normal">
                    {DateFormat(item.data_compra)}
                  </span>
                </div>
              </div>
              <MoneyValues value={toNumericValue(item.valor)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopExpensesWidget;
