import { createClient } from "@/utils/supabase/server";
import { parse } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

const TRANSACTION_FIELDS = `
  id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, imagem_url, realizado, condicao,
  forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual,
  qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image), categorias (id, nome)
`;

type ValorRow = { valor: string };

const sumValues = (rows: ValorRow[] = []) =>
  rows.reduce((sum, { valor }) => sum + parseFloat(valor), 0);

function baseQuery(month: string, responsible?: string) {
  const supabase = createClient();
  let query = supabase.from("transacoes").eq("periodo", month);
  if (responsible) query = query.eq("responsavel", responsible);
  return query;
}

async function sumFromQuery(query: any, join?: string) {
  const select = ["sum:valor.sum()"];
  if (join) select.push(join);
  const { data, error } = await query.select(select.join(", ")).maybeSingle();
  if (error) throw error;
  return data?.sum ?? 0;
}

function parsePeriod(periodo: string) {
  return parse(`01-${periodo}`, "dd-MMMM-yyyy", new Date(), {
    locale: ptBR,
  });
}

async function getUnique(column: "descricao" | "responsavel", month: string) {
  const { data, error } = await baseQuery(month, undefined).select(column);
  if (error) {
    console.error(`Erro ao buscar ${column}s:`, error);
    return [] as string[];
  }
  return Array.from(
    new Set(
      (data as Record<string, string>[]).map((r) => r[column]).filter(Boolean),
    ),
  );
}

export async function getIncome(month: string) {
  return sumFromQuery(
    baseQuery(month)
      .eq("tipo_transacao", "receita")
      .neq("categoria_id.nome", "saldo anterior"),
    "categoria_id!inner()",
  );
}

export async function getExpense(month: string) {
  return sumFromQuery(baseQuery(month).eq("tipo_transacao", "despesa"));
}

export async function getPaidExpense(month: string) {
  return sumFromQuery(
    baseQuery(month, undefined)
      .eq("tipo_transacao", "despesa")
      .neq("forma_pagamento", "cartão de crédito")
      .eq("realizado", true),
  );
}

export async function getConditions(month: string) {
  const { data, error } = await baseQuery(month)
    .eq("tipo_transacao", "despesa")
    .select("condicao, valor.sum()")
    .order("condicao", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getPayment(month: string) {
  const { data, error } = await baseQuery(month)
    .eq("tipo_transacao", "despesa")
    .select("forma_pagamento, valor.sum()");
  if (error) throw error;
  return data;
}

export async function getTransactionsByCategory(month: string) {
  const { data, error } = await baseQuery(month).select(
    "valor, tipo_transacao, categoria:categoria_id (id, nome, icone )",
  );
  if (error) throw error;
  return data;
}

export async function getRecentTransactions(month: string) {
  const { data, error } = await baseQuery(month)
    .select(
      "id, data_compra, data_vencimento, descricao, valor, cartoes (id, logo_image), contas (id, logo_image)",
    )
    .order("created_at", { ascending: false })
    .limit(5);
  if (error) throw error;
  return data;
}

export async function getSumPaidExpense(month: string) {
  return sumFromQuery(
    baseQuery(month).eq("tipo_transacao", "despesa").eq("realizado", true),
  );
}

export async function getSumPaidIncome(month: string) {
  return sumFromQuery(
    baseQuery(month).eq("tipo_transacao", "receita").eq("realizado", true),
  );
}

export async function getTransactions(month: string) {
  const { data, error } = await baseQuery(month, undefined)
    .select(TRANSACTION_FIELDS)
    .order("tipo_transacao", { ascending: true })
    .order("data_compra", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return [];
  }
  return data;
}

export async function getBills(month: string) {
  const { data, error } = await baseQuery(month)
    .eq("tipo_transacao", "despesa")
    .eq("forma_pagamento", "boleto")
    .select("id, valor, descricao, data_vencimento, realizado");
  if (error) throw error;
  return data;
}

export async function getTransactionsByConditions(
  condicao: string,
  month: string,
) {
  const { data, error } = await baseQuery(month)
    .eq("condicao", condicao)
    .eq("tipo_transacao", "despesa")
    .select(TRANSACTION_FIELDS)
    .order("tipo_transacao", { ascending: true })
    .order("data_compra", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return [];
  }
  return data;
}

export async function getCardInvoice(month: string, cartao_id: number) {
  const { data, error } = await baseQuery(month, undefined)
    .eq("cartao_id", cartao_id)
    .select(TRANSACTION_FIELDS)
    .order("data_compra", { ascending: false });
  if (error) {
    console.error("Erro ao buscar faturas:", error);
    return null;
  }
  return data;
}

export async function getCardSum(month: string, cartao_id: number) {
  return sumFromQuery(
    baseQuery(month, undefined)
      .eq("cartao_id", cartao_id)
      .eq("tipo_transacao", "despesa"),
  );
}

export async function getCategoria(
  month: string,
  categoria_nome: string,
  tipo_transacao: string,
) {
  const { data, error } = await baseQuery(month)
    .eq("tipo_transacao", tipo_transacao)
    .eq("categoria_id.nome", categoria_nome)
    .select(`${TRANSACTION_FIELDS}, categoria_id!inner(id, nome)`)
    .order("data_compra", { ascending: false });
  if (error) {
    console.error("Erro ao buscar faturas:", error);
    return null;
  }
  return data;
}

export async function getLimiteEmUso(cartao_id: number) {
  const { data, error } = await createClient()
    .from("transacoes")
    .select("sum:valor.sum()")
    .eq("cartao_id", cartao_id)
    .eq("tipo_transacao", "despesa")
    .eq("forma_pagamento", "cartão de crédito")
    .eq("realizado", false)
    .single();

  if (error) {
    console.error("Erro ao buscar limite em uso:", error);
    return 0;
  }
  return data?.sum ?? 0;
}

export async function getLimitesCartao(
  cartao_id: number,
  limite_total: number,
) {
  const limiteEmUso = await getLimiteEmUso(cartao_id);
  const limiteDisponivel = limite_total - limiteEmUso;
  return {
    limiteTotal: limite_total,
    limiteEmUso,
    limiteDisponivel,
  };
}

export async function getAccountInvoice(month: string, conta_id: number) {
  const { data, error } = await baseQuery(month, undefined)
    .eq("realizado", true)
    .eq("conta_id", conta_id)
    .or("responsavel.eq.você,responsavel.eq.sistema")
    .select(TRANSACTION_FIELDS);
  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return null;
  }
  return data;
}

async function getSumAccountByType(
  month: string,
  id: number,
  tipo: "receita" | "despesa",
) {
  const { data, error } = await createClient()
    .from("transacoes")
    .select("valor, periodo")
    .eq("conta_id", id)
    .eq("tipo_transacao", tipo)
    .or("responsavel.eq.você,responsavel.eq.sistema")
    .eq("realizado", true);

  if (error) {
    console.error(
      `Erro ao buscar ${tipo === "receita" ? "receitas" : "despesas"}:`,
      error,
    );
    return null;
  }

  const limitDate = parsePeriod(month);
  const filtered = (data || []).filter(
    (item) => parsePeriod(item.periodo) <= limitDate,
  );
  return sumValues(filtered);
}

export const getSumAccountIncome = (month: string, id: number) =>
  getSumAccountByType(month, id, "receita");

export const getSumAccountExpense = (month: string, id: number) =>
  getSumAccountByType(month, id, "despesa");

export async function getTransactionsByResponsible(month: string) {
  const { data, error } = await baseQuery(month, undefined)
    .eq("tipo_transacao", "despesa")
    .neq("responsavel", "sistema")
    .neq("forma_pagamento", "boleto")
    .select(
      "responsavel, data_vencimento, cartoes (descricao, logo_image, dt_vencimento), valor",
    )
    .order("responsavel", { ascending: true });
  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return null;
  }
  return data;
}

export async function getBillsByResponsible(month: string) {
  const { data, error } = await baseQuery(month, undefined)
    .eq("tipo_transacao", "despesa")
    .eq("forma_pagamento", "boleto")
    .neq("responsavel", "sistema")
    .select("responsavel, descricao, valor, data_vencimento")
    .order("responsavel", { ascending: true });
  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return null;
  }
  return data;
}

export async function getTransactionsByResponsableVoce(month: string) {
  const { data, error } = await baseQuery(month)
    .select(TRANSACTION_FIELDS)
    .order("tipo_transacao", { ascending: true })
    .order("data_compra", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return [];
  }
  return data;
}

export const getDescriptionsList = (month: string) =>
  getUnique("descricao", month);

export const getResponsaveisList = (month: string) =>
  getUnique("responsavel", month);

export async function getFinancialSummaryForPeriod(
  authId: string,
  periodo: string,
) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "buscar_resumo_financeiro_por_periodo",
    { p_auth_id: authId, p_periodo: periodo },
  );

  if (error)
    throw new Error(`Erro ao buscar resumo financeiro: ${error.message}`);
  return data;
}
