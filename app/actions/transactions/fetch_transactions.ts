import { UseDates } from "@/hooks/use-dates";
import { createClient } from "@/utils/supabase/server";
import { parse } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

const { optionsMeses } = UseDates();

function periodoToDate(periodo: string): Date | null {
  if (!periodo) return null;
  const [mesRaw, anoRaw] = String(periodo).split("-");
  if (!mesRaw || !anoRaw) return null;
  const mes = mesRaw.trim().toLowerCase();
  const ano = Number(String(anoRaw).trim());
  const monthIndex = optionsMeses.indexOf(mes);
  if (isNaN(ano) || monthIndex < 0) return null;
  return new Date(ano, monthIndex, 1);
}

export async function getIncome(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos")
    .select("valor, categoria_id!inner(id, nome), pagadores!inner(role)")
    .eq("tipo_transacao", "receita")
    .eq("periodo", month)
    .eq("pagadores.role", "principal")
    .neq("categoria_id.nome", "saldo anterior");

  if (error) throw error;

  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getExpense(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos")
    .select("valor, pagadores!inner(role)")
    .eq("tipo_transacao", "despesa")
    .eq("periodo", month)
    .eq("pagadores.role", "principal");

  if (error) throw error;

  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getPaidExpense(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos")
    .select("valor")
    .eq("tipo_transacao", "despesa")
    .neq("forma_pagamento", "cartão de crédito")
    .eq("periodo", month)
    .eq("realizado", true);

  if (error) throw error;

  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getConditions(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos")
    .select("condicao, valor.sum(), pagadores!inner(role)")
    .eq("tipo_transacao", "despesa")
    .eq("periodo", month)
    .eq("pagadores.role", "principal")
    .order("condicao", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getPayment(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos")
    .select("forma_pagamento, valor.sum(), pagadores!inner(role)")
    .eq("tipo_transacao", "despesa")
    .eq("periodo", month)
    .eq("pagadores.role", "principal");

  if (error) throw error;

  return data;
}

// Consulta única para agregações de despesas por condicao e forma_pagamento
export async function getExpenseAggregations(month: string) {
  const supabase = createClient();

  // Usa agregações no banco para reduzir payload e latência
  const [{ data: cond, error: e1 }, { data: pay, error: e2 }] =
    await Promise.all([
      supabase
        .from("lancamentos")
        .select("condicao, valor.sum(), pagadores!inner(role)")
        .eq("tipo_transacao", "despesa")
        .eq("periodo", month)
        .eq("pagadores.role", "principal"),
      supabase
        .from("lancamentos")
        .select("forma_pagamento, valor.sum(), pagadores!inner(role)")
        .eq("tipo_transacao", "despesa")
        .eq("periodo", month)
        .eq("pagadores.role", "principal"),
    ]);

  if (e1) throw e1;
  if (e2) throw e2;

  const conditions = (cond || []).map((row: any) => ({
    condicao: String(row.condicao || ""),
    sum: Number((row as any).sum ?? (row as any).valor) || 0,
  }));

  const payments = (pay || []).map((row: any) => ({
    forma_pagamento: String(row.forma_pagamento || ""),
    sum: Number((row as any).sum ?? (row as any).valor) || 0,
  }));

  return { conditions, payments };
}

export async function getTransactionsByCategory(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos")
    .select(
      `id, data_compra, descricao, valor, tipo_transacao, categoria:categoria_id (id, nome, icone ), pagadores!inner(role)`,
    )
    .eq("periodo", month)
    .eq("pagadores.role", "principal")
    .eq("tipo_transacao", "despesa");

  if (error) throw error;

  return data;
}

export async function getRecentTransactions(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos")
    .select(
      "id, data_compra, tipo_transacao, data_vencimento, descricao, valor, cartoes (id, logo_image), contas (id, logo_image), pagadores!inner(role)",
    )
    .order("created_at", { ascending: false })
    .eq("pagadores.role", "principal")
    .eq("periodo", month)
    .limit(5);

  if (error) throw error;

  return data;
}

// Retorna somatórios de receitas e despesas por período em uma única consulta
export async function getIncomeExpenseByPeriods(periods: string[]) {
  const supabase = createClient();

  if (!periods?.length)
    return [] as { periodo: string; incomes: number; expenses: number }[];

  const { data, error } = await supabase
    .from("lancamentos")
    .select("periodo, tipo_transacao, valor.sum(), pagadores!inner(role)")
    .in("periodo", periods)
    .in("tipo_transacao", ["receita", "despesa"]) // garante apenas os dois tipos
    .eq("pagadores.role", "principal");

  if (error) throw error;

  // Agrega para um mapa por período
  const map = new Map<string, { incomes: number; expenses: number }>();
  for (const p of periods) map.set(p, { incomes: 0, expenses: 0 });

  (data || []).forEach((row: any) => {
    const periodo = String(row.periodo);
    const tipo = String(row.tipo_transacao);
    // Supabase/PostgREST retorna agregados como 'sum' quando usamos `valor.sum()`;
    // em algumas configs pode vir como 'valor'. Garantimos ambos.
    const sum = Number((row as any).sum ?? (row as any).valor) || 0;
    const acc = map.get(periodo) || { incomes: 0, expenses: 0 };
    if (tipo === "receita") acc.incomes += sum;
    else if (tipo === "despesa") acc.expenses += sum;
    map.set(periodo, acc);
  });

  return periods.map((periodo) => ({ periodo, ...map.get(periodo)! }));
}

// Totais de despesas por período para um pagador específico (uma única consulta)
export async function getPayerExpenseTotalsByPeriods(
  periods: string[],
  payerId: string,
) {
  const supabase = createClient();

  if (!periods?.length || !payerId)
    return [] as { periodo: string; total: number }[];

  const { data, error } = await supabase
    .from("lancamentos")
    .select("periodo, valor.sum()")
    .in("periodo", periods)
    .eq("pagador_id", payerId)
    .eq("tipo_transacao", "despesa");

  if (error) throw error;

  const map = new Map<string, number>();
  for (const p of periods) map.set(p, 0);

  (data || []).forEach((row: any) => {
    const periodo = String(row.periodo);
    const sum = Number((row as any).sum ?? (row as any).valor) || 0;
    map.set(periodo, (map.get(periodo) || 0) + sum);
  });

  return periods.map((periodo) => ({ periodo, total: map.get(periodo)! }));
}

export async function getSumPaidExpense(month: string) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("lancamentos")
    .select("valor, pagadores!inner(role)")
    .eq("periodo", month)
    .eq("tipo_transacao", "despesa")
    .eq("realizado", true)
    .eq("pagadores.role", "principal");

  if (error) throw error;

  const sumAccountExpensePaid = data.reduce(
    (sum, item) => sum + parseFloat(item.valor),
    0,
  );

  return sumAccountExpensePaid;
}

export async function getSumPaidIncome(month: string) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("lancamentos")
    .select("valor, pagadores!inner(role)")
    .eq("periodo", month)
    .eq("tipo_transacao", "receita")
    .eq("realizado", true)
    .eq("pagadores.role", "principal");

  if (error) throw error;

  const sumAccountIncomePaid = data.reduce(
    (sum, item) => sum + parseFloat(item.valor),
    0,
  );

  return sumAccountIncomePaid;
}

export async function getTransactions(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos")
    .select(
      `id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, imagem_url, realizado, condicao, 
      forma_pagamento, anotacao, valor, qtde_parcela, parcela_atual, dt_pagamento_boleto,
      qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image), categorias (id, nome), pagadores (id, nome, role, foto)`,
    )
    .order("tipo_transacao", { ascending: true })
    .order("data_compra", { ascending: false })
    .order("created_at", { ascending: false })
    .eq("periodo", month);

  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return [];
  }

  return data;
}

// Busca lançamentos para o calendário por faixa de datas (data_compra OU data_vencimento no mês)
export async function getTransactionsForCalendar(month: string) {
  const supabase = createClient();

  // Calcula início e fim do mês a partir do texto "mês-ano" (ex.: "agosto-2025")
  const base = parse(`01-${month}`, "dd-MMMM-yyyy", new Date(), {
    locale: ptBR,
  });
  const start = new Date(base.getFullYear(), base.getMonth(), 1);
  const end = new Date(base.getFullYear(), base.getMonth() + 1, 0);

  const toYMD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const startStr = toYMD(start);
  const endStr = toYMD(end);

  const { data, error } = await supabase
    .from("lancamentos")
    .select(
      `id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, imagem_url, realizado, condicao,
      forma_pagamento, anotacao, valor, qtde_parcela, parcela_atual,
      qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image), categorias (id, nome), pagadores (id, nome, role, foto)`,
    )
    // Apenas pagador principal
    .eq("pagadores.role", "principal")
    // data_compra OU data_vencimento dentro do mês selecionado
    .or(
      `and(data_compra.gte.${startStr},data_compra.lte.${endStr}),and(data_vencimento.gte.${startStr},data_vencimento.lte.${endStr})`,
    )
    .order("data_compra", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar Lançamentos (calendário):", error);
    return [];
  }

  return data;
}

export async function getBills(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos")
    .select(
      "id, valor, descricao, data_vencimento, dt_pagamento_boleto, realizado, pagadores!inner(role)",
    )
    .eq("tipo_transacao", "despesa")
    .eq("forma_pagamento", "boleto")
    .eq("pagadores.role", "principal")
    .eq("periodo", month);

  if (error) throw error;

  return data;
}

export async function getTransactionsByConditions(
  condicao: string,
  month: string,
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos")
    .select(
      `id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, imagem_url, realizado, condicao, 
      forma_pagamento, anotacao, valor, qtde_parcela, parcela_atual, dt_pagamento_boleto,
      qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image), categorias (id, nome), pagadores!inner(role, nome, foto)`,
    )

    .eq("periodo", month)
    .eq("pagadores.role", "principal")
    .eq("condicao", condicao)
    .eq("tipo_transacao", "despesa")
    .order("tipo_transacao", { ascending: true })
    .order("data_compra", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return [];
  }

  return data;
}

// Busca a lista de Lançamentos para tabela de faturas
export async function getCardInvoice(month: string, cartao_id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos")
    .select(
      `id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, imagem_url, realizado, condicao, 
      forma_pagamento, anotacao, valor, qtde_parcela, parcela_atual,
      qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image), categorias (id, nome), pagadores!inner(role, nome, foto)`,
    )
    .eq("cartao_id", cartao_id)
    .eq("periodo", month)
    .order("tipo_transacao", { ascending: true })
    .order("data_compra", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar faturas:", error);
    return null;
  }

  return data;
}

// Busca o valor total das despesas do cartão
export async function getCardSum(month: string, cartao_id: string) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("lancamentos")
    .select(`valor`)
    .eq("cartao_id", cartao_id)
    .eq("periodo", month)
    .eq("tipo_transacao", "despesa");

  if (error) {
    console.error("Erro ao buscar transacoes:", error);
    return null;
  }

  const getCardSum = data.reduce(
    (sum, item) => sum + parseFloat(item.valor),
    0,
  );

  return getCardSum;
}

// Busca a lista de categoria para tabela
export async function getCategoria(
  month: string,
  categoria_nome: string,
  tipo_transacao: string,
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos")
    .select(
      `id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, imagem_url, realizado, condicao, 
      forma_pagamento, anotacao, valor, qtde_parcela, parcela_atual,
      qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image), categorias (id, nome), categoria_id!inner(id, nome), pagadores!inner(role, nome, foto)`,
    )
    .order("data_compra", { ascending: false })
    .eq("periodo", month)
    .eq("pagadores.role", "principal")
    .eq("tipo_transacao", tipo_transacao)
    .eq("categoria_id.nome", categoria_nome);

  if (error) {
    console.error("Erro ao buscar faturas:", error);
    return null;
  }

  return data;
}

// Função para obter o limite em uso
export async function getLimiteEmUso(cartao_id: string) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("lancamentos")
    .select(`valor`)
    .eq("cartao_id", cartao_id)
    .eq("tipo_transacao", "despesa")
    .eq("forma_pagamento", "cartão de crédito")
    .eq("realizado", false);

  if (error) {
    console.error("Erro ao buscar limite em uso:", error);
    return 0;
  }

  const limiteEmUso = data.reduce(
    (sum, item) => sum + parseFloat(item.valor),
    0,
  );
  return limiteEmUso;
}

// Função para calcular o limite disponível
export async function getLimitesCartao(
  cartao_id: string,
  limite_total: number,
) {
  const limiteEmUso = await getLimiteEmUso(cartao_id);
  const limiteDisponivel = limite_total - limiteEmUso;

  return {
    limiteTotal: limite_total,
    limiteEmUso: limiteEmUso,
    limiteDisponivel: limiteDisponivel,
  };
}

// Busca as Lançamentos de uma conta bancária específica na tabela transacoes
export async function getAccountInvoice(month: string, conta_id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos")
    .select(
      "id, data_compra, data_vencimento, dt_pagamento_boleto, periodo, descricao, tipo_transacao, imagem_url, realizado, condicao, forma_pagamento, anotacao, valor, qtde_parcela, parcela_atual, qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image), categorias (id, nome), pagadores!inner(role, nome, foto)",
    )
    .eq("periodo", month)
    .eq("conta_id", conta_id)
    .in("pagadores.role", ["principal", "sistema"]);

  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return null;
  }

  return data;
}

// Busca as receitas de uma conta bancária específica e soma os valores
export async function getSumAccountIncome(month: string, id: string) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("lancamentos")
    .select(`valor, periodo, pagadores!inner(role)`)
    .eq("conta_id", id)
    .eq("tipo_transacao", "receita")
    .in("pagadores.role", ["principal", "sistema"])
    .eq("realizado", true)
    // Somatório apenas do mês selecionado (exibido como "Receitas" do mês)
    .eq("periodo", month);

  if (error) {
    console.error("Erro ao buscar receitas:", error);
    return null;
  }

  const limitDate = parse(`01-${month}`, "dd-MMMM-yyyy", new Date(), {
    locale: ptBR,
  });

  const sumAccountIncome = data.reduce((sum, item) => {
    const itemDate = parse(`01-${item.periodo}`, "dd-MMMM-yyyy", new Date(), {
      locale: ptBR,
    });

    if (itemDate <= limitDate) {
      const valor = parseFloat(item.valor);
      return sum + (isNaN(valor) ? 0 : valor);
    }

    return sum;
  }, 0);

  return sumAccountIncome;
}

// Soma acumulada de receitas da conta até o mês selecionado (inclui meses anteriores)
export async function getSumAccountIncomeToDate(month: string, id: string) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("lancamentos")
    .select(`valor, periodo, pagadores!inner(role)`)
    .eq("conta_id", id)
    .eq("tipo_transacao", "receita")
    .in("pagadores.role", ["principal", "sistema"])
    .eq("realizado", true);

  if (error) {
    console.error("Erro ao buscar receitas acumuladas:", error);
    return 0;
  }

  const limitDate = periodoToDate(month);

  const sumAccountIncome = data.reduce((sum, item) => {
    const itemDate = periodoToDate(item.periodo);
    if (itemDate && limitDate && itemDate <= limitDate) {
      const valor = parseFloat(item.valor);
      return sum + (isNaN(valor) ? 0 : valor);
    }

    return sum;
  }, 0);

  return sumAccountIncome;
}

// Busca as despesas de uma conta bancária específica e soma os valores
export async function getSumAccountExpense(month: string, id: string) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("lancamentos")
    .select(`valor, periodo, pagadores!inner(role)`)
    .eq("conta_id", id)
    .eq("tipo_transacao", "despesa")
    .in("pagadores.role", ["principal", "sistema"])
    .eq("realizado", true)
    // Somatório apenas do mês selecionado (exibido como "Despesas" do mês)
    .eq("periodo", month);

  if (error) {
    console.error("Erro ao buscar despesas:", error);
    return null;
  }

  const limitDate = parse(`01-${month}`, "dd-MMMM-yyyy", new Date(), {
    locale: ptBR,
  });

  const sumAccountExpense = data.reduce((sum, item) => {
    const itemDate = parse(`01-${item.periodo}`, "dd-MMMM-yyyy", new Date(), {
      locale: ptBR,
    });

    if (itemDate <= limitDate) {
      const valor = parseFloat(item.valor);
      return sum + (isNaN(valor) ? 0 : valor);
    }

    return sum;
  }, 0);

  return sumAccountExpense;
}

// Soma acumulada de despesas da conta até o mês selecionado (inclui meses anteriores)
export async function getSumAccountExpenseToDate(month: string, id: string) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("lancamentos")
    .select(`valor, periodo, pagadores!inner(role)`)
    .eq("conta_id", id)
    .eq("tipo_transacao", "despesa")
    .in("pagadores.role", ["principal", "sistema"])
    .eq("realizado", true);

  if (error) {
    console.error("Erro ao buscar despesas acumuladas:", error);
    return 0;
  }

  const limitDate = periodoToDate(month);

  const sumAccountExpense = data.reduce((sum, item) => {
    const itemDate = periodoToDate(item.periodo);
    if (itemDate && limitDate && itemDate <= limitDate) {
      const valor = parseFloat(item.valor);
      return sum + (isNaN(valor) ? 0 : valor);
    }

    return sum;
  }, 0);

  return sumAccountExpense;
}

// Busca saldos acumulados até o mês selecionado para múltiplas contas (reduz N+1)
export async function getAccountsBalancesToDate(
  month: string,
  accountIds: (string | number)[],
) {
  const supabase = createClient();

  if (!accountIds || accountIds.length === 0)
    return {} as Record<string, number>;

  const { error, data } = await supabase
    .from("lancamentos")
    .select(`valor, periodo, conta_id, tipo_transacao, pagadores!inner(role)`)
    .in("conta_id", accountIds)
    .in("pagadores.role", ["principal", "sistema"])
    .eq("realizado", true);

  if (error) {
    console.error("Erro ao buscar saldos de contas:", error);
    return {} as Record<string, number>;
  }

  const limitDate = periodoToDate(month);

  const balances = new Map<string | number, number>();

  for (const item of data) {
    const itemDate = periodoToDate(item.periodo);
    if (!itemDate || !limitDate || itemDate > limitDate) continue;
    const raw = parseFloat(item.valor);
    const valor = Number.isFinite(raw) ? raw : 0;
    const curr = balances.get(item.conta_id) ?? 0;
    const delta = item.tipo_transacao === "receita" ? valor : -valor;
    balances.set(item.conta_id, curr + delta);
  }

  // Converte para objeto simples
  return Object.fromEntries(balances.entries()) as Record<string, number>;
}

// Funções específicas da página "responsáveis" foram removidas.

export async function getTransactionsRoleOwner(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos")
    .select(
      `id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, realizado, condicao, 
      forma_pagamento, anotacao, valor, qtde_parcela, parcela_atual,
      qtde_recorrencia, dividir_lancamento, categorias ( id, nome ), cartoes (id, descricao), contas (id, descricao), pagadores!inner(role)`,
    )
    .order("tipo_transacao", { ascending: true })
    .order("data_compra", { ascending: false })
    .order("created_at", { ascending: false })
    .eq("pagadores.role", "principal")
    .eq("periodo", month);

  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return [];
  }

  return data;
}

// Retorna lista de descricoes unicas para um periodo
export async function getDescriptionsList(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos")
    .select("descricao")
    .eq("periodo", month);

  if (error) {
    console.error("Erro ao buscar descricoes:", error);
    return [] as string[];
  }

  const set = new Set<string>();
  data?.forEach((item) => {
    if (item.descricao) {
      set.add(item.descricao as string);
    }
  });

  return Array.from(set);
}

// Retorna lista de responsaveis unicos para um periodo
// Lista de responsáveis removida; usar pagadores endpoint se necessário.

export async function getFinancialSummaryForPeriod(
  authId: string,
  periodo: string,
) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("resumo_por_periodo", {
    p_auth_id: authId,
    p_periodo: periodo,
  });

  if (error)
    throw new Error(`Erro ao buscar resumo financeiro: ${error.message}`);
  return data;
}

export async function getTransactionsByPayer(month: string, id: string) {
  const supabase = createClient();

  const { data: transactions, error } = await supabase
    .from("lancamentos")
    .select(
      `id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, imagem_url, realizado, condicao, 
      forma_pagamento, anotacao, valor, qtde_parcela, parcela_atual,
      qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image), categorias (id, nome), pagadores (id, nome, role, foto)`,
    )
    .eq("periodo", month)
    .eq("pagador_id", id)
    .eq("tipo_transacao", "despesa")
    .order("data_compra", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar transações do pagador:", error);
  }

  return transactions || [];
}

// Totais por categoria (receita/despesa) em uma única consulta
export async function getCategoryTotals(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos")
    .select(
      `tipo_transacao, valor.sum(), categoria:categoria_id (id, nome, icone), pagadores!inner(role)`,
    )
    .eq("periodo", month)
    .eq("pagadores.role", "principal");

  if (error) throw error;

  // Converte para o formato esperado pelo CategoryWidget
  // Nota: PostgREST retorna o agregado em 'sum'
  return (data || [])
    .filter((row: any) => row?.categoria?.id)
    .map((row: any) => ({
      tipo_transacao: row.tipo_transacao as string,
      categoria: String(row.categoria?.nome ?? "Sem Categoria"),
      id: String(row.categoria?.id ?? "sem_categoria"),
      icone: row.categoria?.icone as string | undefined,
      total: Number((row as any).sum ?? 0),
    }));
}

// Somatórios pagos (realizado=true) por tipo (receita/despesa) em uma chamada
export async function getSumPaidByType(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos")
    .select("tipo_transacao, valor.sum(), pagadores!inner(role)")
    .eq("periodo", month)
    .eq("realizado", true)
    .in("tipo_transacao", ["receita", "despesa"])
    .eq("pagadores.role", "principal");

  if (error) throw error;

  let income = 0;
  let expense = 0;
  (data || []).forEach((row: any) => {
    const sum = Number((row as any).sum ?? (row as any).valor) || 0;
    if (row.tipo_transacao === "receita") income += sum;
    else if (row.tipo_transacao === "despesa") expense += sum;
  });

  return { income, expense };
}
