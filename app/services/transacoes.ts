// /services/transacoes.ts
import { createClient } from "@/utils/supabase/server";

export async function getIncome(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("tipo_transacao", "Receita")
    .eq("periodo", month)
    .neq("categoria", "Saldo Anterior")
    .eq("responsavel", "Você");
  if (error) throw error;
  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getExpense(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("tipo_transacao", "Despesa")
    .eq("periodo", month)
    .eq("responsavel", "Você");
  if (error) throw error;
  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getLastPrevious(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("tipo_transacao", "Receita")
    .eq("periodo", month)
    .eq("categoria", "Saldo Anterior");
  if (error) throw error;
  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getExpensePaid(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("tipo_transacao", "Despesa")
    .neq("forma_pagamento", "Cartão de Crédito")
    .eq("periodo", month)
    .eq("realizado", true);
  if (error) throw error;
  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getConditions(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("condicao, valor.sum()")
    .eq("tipo_transacao", "Despesa")
    .eq("periodo", month)
    .eq("responsavel", "Você")
    .order("condicao", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getPayment(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("forma_pagamento, valor.sum()")
    .eq("tipo_transacao", "Despesa")
    .eq("periodo", month)
    .eq("responsavel", "Você")
    .order("forma_pagamento", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getTransactionsStats(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("count()")
    .eq("periodo", month)
    .eq("responsavel", "Você");
  if (error) throw error;
  return data;
}

export async function getExpenseByCategory(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("categoria, tipo_transacao, valor.sum()")
    .eq("tipo_transacao", "Despesa")
    .eq("periodo", month)
    .eq("responsavel", "Você")
    .order("categoria", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getIncomeByCategory(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("categoria, tipo_transacao, valor.sum()")
    .eq("tipo_transacao", "Receita")
    .eq("periodo", month)
    .eq("responsavel", "Você")
    .order("categoria", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getRecentTransactions(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select(
      "id, data_compra, descricao, valor, cartoes (id, logo_image), contas (id, logo_image)",
    )
    .order("created_at", { ascending: false })
    .eq("responsavel", "Você")
    .eq("periodo", month)
    .limit(5);
  if (error) throw error;
  return data;
}

export async function getSumAccountExpensePaid(month) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("periodo", month)
    .eq("tipo_transacao", "Despesa")
    .eq("realizado", true)
    .eq("responsavel", "Você")
    .neq("responsavel", "Sistema");
  if (error) throw error;
  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getSumAccountIncomePaid(month) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("periodo", month)
    .eq("tipo_transacao", "Receita")
    .eq("realizado", true)
    .neq("responsavel", "Sistema");
  if (error) throw error;
  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getTransactions(month: string) {
  const supabase = await createClient();

  const { data: transacao, error } = await supabase
    .from("transacoes")
    .select(
      `id, data_compra, periodo, descricao, tipo_transacao, categoria , imagem_url, realizado, condicao, 
      forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual, recorrencia,
      qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image)`,
    )
    .order("created_at", { ascending: false })
    .eq("periodo", month);

  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return [];
  }

  return transacao;
}

// Busca a lista de Lançamentos para tabela de faturas
export async function getCardInvoice(month, cartao_id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select(
      `id, data_compra, periodo, descricao, tipo_transacao, categoria, condicao, 
      forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual, recorrencia,
      qtde_recorrencia, cartoes (id, descricao, logo_image)`,
    )
    .order("data_compra", { ascending: false })
    .eq("periodo", month)
    .eq("cartao_id", cartao_id);

  if (error) {
    console.error("Erro ao buscar faturas:", error);
    return null;
  }

  return data;
}

// Busca o valor total das despesas do cartão
export async function getCardSum(month, cartao_id) {
  const supabase = await createClient();

  const { error, data } = await supabase
    .from("transacoes")
    .select(`valor`)
    .eq("cartao_id", cartao_id)
    .eq("periodo", month)
    .eq("tipo_transacao", "Despesa");

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
export async function getCategoria(month, categoriaId, tipo_transacao) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select(
      `id, data_compra, realizado, periodo, descricao, tipo_transacao, categoria, condicao, 
      forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual, recorrencia,
      qtde_recorrencia, cartoes (id, descricao), contas (id, descricao)`,
    )
    .order("data_compra", { ascending: false })
    .eq("periodo", month)
    .eq("responsavel", "Você")
    .eq("tipo_transacao", tipo_transacao)
    .eq("categoria", categoriaId);

  if (error) {
    console.error("Erro ao buscar faturas:", error);
    return null;
  }

  return data;
}

// Função para obter o limite em uso
export async function getLimiteEmUso(cartao_id) {
  const supabase = await createClient();

  const { error, data } = await supabase
    .from("transacoes")
    .select(`valor`)
    .eq("cartao_id", cartao_id)
    .eq("tipo_transacao", "Despesa")
    .eq("forma_pagamento", "Cartão de Crédito")
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
export async function getLimitesCartao(cartao_id, limite_total) {
  const limiteEmUso = await getLimiteEmUso(cartao_id);
  const limiteDisponivel = limite_total - limiteEmUso;

  return {
    limiteTotal: limite_total,
    limiteEmUso: limiteEmUso,
    limiteDisponivel: limiteDisponivel,
  };
}

// Busca as Lançamentos de uma conta bancária específica na tabela transacoes
export async function getAccountInvoice(month, id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select(
      "id, data_compra, periodo, descricao, tipo_transacao, categoria, condicao, forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual, recorrencia, qtde_recorrencia, contas (id, descricao)",
    )
    .eq("periodo", month)
    .or("responsavel.eq.Você,responsavel.eq.Sistema")
    .eq("conta_id", id);

  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return null;
  }

  return data;
}

// Busca as receitas de uma conta bancária específica e soma os valores
export async function getSumAccountIncome(month, id) {
  const supabase = await createClient();

  const { error, data } = await supabase
    .from("transacoes")
    .select(`valor`)
    .eq("conta_id", id)
    .eq("periodo", month)
    .eq("tipo_transacao", "Receita")
    .or("responsavel.eq.Você,responsavel.eq.Sistema")
    .eq("realizado", true);

  if (error) {
    console.error("Erro ao buscar receitas:", error);
    return null;
  }

  const sumAccountIncome = data.reduce((sum, item) => {
    const valor = parseFloat(item.valor);
    return sum + (isNaN(valor) ? 0 : valor);
  }, 0);

  return sumAccountIncome;
}

// Busca as despesas de uma conta bancária específica e soma os valores
export async function getSumAccountExpense(month, id) {
  const supabase = await createClient();

  const { error, data } = await supabase
    .from("transacoes")
    .select(`valor`)
    .eq("conta_id", id)
    .eq("periodo", month)
    .eq("tipo_transacao", "Despesa")
    .or("responsavel.eq.Você, responsavel.eq.Sistema")
    .eq("realizado", true);

  if (error) {
    console.error("Erro ao buscar despesas:", error);
    return null;
  }

  const sumAccountExpense = data.reduce((sum, item) => {
    const valor = parseFloat(item.valor);
    return sum + (isNaN(valor) ? 0 : valor);
  }, 0);

  return sumAccountExpense;
}

export async function getResponsavelTransactionList(month) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("responsavel, cartoes (descricao, logo_image), valor")
    .order("responsavel", { ascending: true })
    .eq("periodo", month)
    .eq("tipo_transacao", "Despesa")
    .neq("responsavel", "Sistema");

  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return null;
  }

  return data;
}