export type Maybe<T> = T | null | undefined;

export type Transaction = {
  id?: string;
  descricao?: string | null;
  valor: number | string;
  tipo_transacao?: string | null;
  forma_pagamento?: string | null;
  data_compra?: string | null;
  cartoes?: {
    id?: string | null;
    descricao?: string | null;
    logo_image?: string | null;
  } | null;
  pagadores?: {
    nome?: string | null;
    email?: string | null;
  } | null;
};

export type CardAgg = {
  key: string;
  descricao: string;
  logo_image?: string | null;
  total: number;
};

export type SimpleAgg = { key: string; label: string; total: number };

export function toNumber(n: unknown): number {
  if (typeof n === "number") return n;
  if (typeof n === "string") return Number(n) || 0;
  return 0;
}

export function normalizeFormaPagamento(s: Maybe<string>): string {
  const v = (s || "").trim().toLowerCase();
  if (
    ["cartão de crédito", "cartao de credito", "crédito", "credito"].includes(v)
  )
    return "cartão de crédito";
  if (["cartão de débito", "cartao de debito", "débito", "debito"].includes(v))
    return "cartão de débito";
  if (["boleto"].includes(v)) return "boleto";
  if (["pix"].includes(v)) return "pix";
  if (["dinheiro", "cash"].includes(v)) return "dinheiro";
  return v || "outro";
}

export function aggregateByCard(list: Transaction[]): {
  items: CardAgg[];
  total: number;
} {
  const map = new Map<string, CardAgg>();
  let total = 0;

  for (const t of list) {
    if ((t.tipo_transacao || "") !== "despesa") continue;
    if (normalizeFormaPagamento(t.forma_pagamento) !== "cartão de crédito")
      continue;

    const key = t.cartoes?.id || `outro-${t.cartoes?.descricao || "cartao"}`;
    const desc = t.cartoes?.descricao || "Outros Cartões";
    const val = toNumber(t.valor);

    const prev = map.get(key);
    const next: CardAgg = {
      key,
      descricao: desc,
      logo_image: t.cartoes?.logo_image || null,
      total: (prev?.total || 0) + val,
    };
    map.set(key, next);
    total += val;
  }

  return { items: Array.from(map.values()), total };
}

export function aggregateByBoleto(list: Transaction[]): {
  items: SimpleAgg[];
  total: number;
} {
  const map = new Map<string, number>();
  let total = 0;

  for (const t of list) {
    if ((t.tipo_transacao || "") !== "despesa") continue;
    if (normalizeFormaPagamento(t.forma_pagamento) !== "boleto") continue;

    const key = t.descricao || "Boleto";
    const val = toNumber(t.valor);

    map.set(key, (map.get(key) || 0) + val);
    total += val;
  }

  const items: SimpleAgg[] = Array.from(map.entries()).map(([k, v]) => ({
    key: k,
    label: k,
    total: v,
  }));

  return { items, total };
}

export function aggregateByOtherMethods(list: Transaction[]): {
  items: SimpleAgg[];
  total: number;
} {
  const map = new Map<string, number>();
  let total = 0;

  const allowed = new Set(["pix", "dinheiro", "cartão de débito"]);

  for (const t of list) {
    if ((t.tipo_transacao || "") !== "despesa") continue;

    const forma = normalizeFormaPagamento(t.forma_pagamento);
    if (!allowed.has(forma)) continue;

    const val = toNumber(t.valor);
    map.set(forma, (map.get(forma) || 0) + val);
    total += val;
  }

  const items: SimpleAgg[] = Array.from(map.entries()).map(([key, total]) => ({
    key,
    label: key,
    total,
  }));

  return { items, total };
}

