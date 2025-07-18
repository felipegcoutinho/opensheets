import { createClient } from "@/utils/supabase/server";
import { parse } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export async function getIncome(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos_temp")
    .select("valor, categoria_id!inner(id, nome)")
    .eq("tipo_transacao", "receita")
    .eq("periodo", month)
    .eq("responsavel", "você")
    .neq("categoria_id.nome", "saldo anterior");

  if (error) throw error;

  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getExpense(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos_temp")
    .select("valor")
    .eq("tipo_transacao", "despesa")
    .eq("periodo", month)
    .eq("responsavel", "você");

  if (error) throw error;

  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getPaidExpense(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos_temp")
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
    .from("lancamentos_temp")
    .select("condicao, valor.sum()")
    .eq("tipo_transacao", "despesa")
    .eq("periodo", month)
    .eq("responsavel", "você")
    .order("condicao", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getPayment(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos_temp")
    .select("forma_pagamento, valor.sum()")
    .eq("tipo_transacao", "despesa")
    .eq("periodo", month)
    .eq("responsavel", "você");

  if (error) throw error;

  return data;
}

export async function getTransactionsStats(month: string) {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("lancamentos_temp")
    .select("id", { count: "exact", head: true })
    .eq("periodo", month)
    .eq("responsavel", "você");

  if (error) throw error;

  return count ?? 0;
}

export async function getBillsStats(month: string) {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("lancamentos_temp")
    .select("id", { count: "exact", head: true })
    .eq("periodo", month)
    .eq("forma_pagamento", "boleto")
    .eq("responsavel", "você");

  if (error) throw error;

  return count ?? 0;
}

export async function getTransactionsByCategory(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos_temp")
    .select(`valor, tipo_transacao, categoria:categoria_id (id, nome )`)
    .eq("periodo", month)
    .eq("responsavel", "você");

  if (error) throw error;

  return data;
}

export async function getRecentTransactions(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos_temp")
    .select(
      "id, data_compra, data_vencimento, descricao, valor, cartoes (id, logo_image), contas (id, logo_image)",
    )
    .order("created_at", { ascending: false })
    .eq("responsavel", "você")
    .eq("periodo", month)
    .limit(5);

  if (error) throw error;

  return data;
}

export async function getSumPaidExpense(month: string) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("lancamentos_temp")
    .select("valor")
    .eq("periodo", month)
    .eq("tipo_transacao", "despesa")
    .eq("realizado", true)
    .eq("responsavel", "você")
    .neq("responsavel", "sistema");

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
    .from("lancamentos_temp")
    .select("valor")
    .eq("periodo", month)
    .eq("tipo_transacao", "receita")
    .eq("realizado", true)
    .eq("responsavel", "você")
    .neq("responsavel", "sistema");

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
    .from("lancamentos_temp")
    .select(
      `id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, imagem_url, realizado, condicao, 
      forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual,
      qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image), categorias (id, nome)`,
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

export async function getBills(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos_temp")
    .select("id, valor, descricao, data_vencimento, realizado")
    .eq("tipo_transacao", "despesa")
    .eq("forma_pagamento", "boleto")
    .eq("responsavel", "você")
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
    .from("lancamentos_temp")
    .select(
      `id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, imagem_url, realizado, condicao, 
      forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual,
      qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image), categorias (id, nome)`,
    )
    .order("tipo_transacao", { ascending: true })
    .order("data_compra", { ascending: false })
    .order("created_at", { ascending: false })
    .eq("periodo", month)
    .eq("responsavel", "você")
    .eq("condicao", condicao)
    .eq("tipo_transacao", "despesa");

  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return [];
  }

  return data;
}

// Busca a lista de Lançamentos para tabela de faturas
export async function getCardInvoice(month: string, cartao_id: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos_temp")
    .select(
      `id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, imagem_url, realizado, condicao, 
      forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual,
      qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image), categorias (id, nome)`,
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
export async function getCardSum(month: string, cartao_id: number) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("lancamentos_temp")
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
    .from("lancamentos_temp")
    .select(
      `id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, imagem_url, realizado, condicao, 
      forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual,
      qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image), categorias (id, nome), categoria_id!inner(id, nome)`,
    )
    .order("data_compra", { ascending: false })
    .eq("periodo", month)
    .eq("responsavel", "você")
    .eq("tipo_transacao", tipo_transacao)
    .eq("categoria_id.nome", categoria_nome);

  if (error) {
    console.error("Erro ao buscar faturas:", error);
    return null;
  }

  return data;
}

// Função para obter o limite em uso
export async function getLimiteEmUso(cartao_id: number) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("lancamentos_temp")
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
  cartao_id: number,
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
export async function getAccountInvoice(month: string, conta_id: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos_temp")
    .select(
      "id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, imagem_url, realizado, condicao, forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual, qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image), categorias (id, nome)",
    )
    .eq("periodo", month)
    .eq("realizado", true)
    .eq("conta_id", conta_id)
    .or("responsavel.eq.você,responsavel.eq.sistema");

  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return null;
  }

  return data;
}

// Busca as receitas de uma conta bancária específica e soma os valores
export async function getSumAccountIncome(month: string, id: number) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("lancamentos_temp")
    .select(`valor, periodo`)
    .eq("conta_id", id)

    .eq("tipo_transacao", "receita")
    .or("responsavel.eq.você,responsavel.eq.sistema")
    .eq("realizado", true);

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

// Busca as despesas de uma conta bancária específica e soma os valores
export async function getSumAccountExpense(month: string, id: number) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("lancamentos_temp")
    .select(`valor, periodo`)
    .eq("conta_id", id)

    .eq("tipo_transacao", "despesa")
    .or("responsavel.eq.você, responsavel.eq.sistema")
    .eq("realizado", true);

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

export async function getTransactionsByResponsible(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos_temp")
    .select("responsavel, cartoes (descricao, logo_image), valor")
    .order("responsavel", { ascending: true })
    .eq("periodo", month)
    .eq("tipo_transacao", "despesa")
    .neq("responsavel", "sistema")
    .neq("forma_pagamento", "boleto");

  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return null;
  }

  return data;
}

export async function getBillsByResponsible(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos_temp")
    .select("responsavel, descricao, valor")
    .eq("periodo", month)
    .eq("tipo_transacao", "despesa")
    .eq("forma_pagamento", "boleto")
    .order("responsavel", { ascending: true })
    .neq("responsavel", "sistema");

  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return null;
  }

  return data;
}

export async function getTransactionsByResponsableVoce(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos_temp")
    .select(
      `id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, realizado, condicao, 
      forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual,
      qtde_recorrencia, dividir_lancamento, categorias ( id, nome ), cartoes (id, descricao), contas (id, descricao)`,
    )
    .order("tipo_transacao", { ascending: true })
    .order("data_compra", { ascending: false })
    .order("created_at", { ascending: false })
    .eq("responsavel", "você")
    .eq("periodo", month);

  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return [];
  }

  return data;
}

export async function getLancamentostTeste(id: number, month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos_temp")
    .select(
      `id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, imagem_url, realizado, condicao, 
      forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual,
      qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image), categorias (id, nome), pagador_id!inner(id, nome)`,
    )
    .eq("periodo", month)
    .eq("pagador_id.id", id)
    .order("tipo_transacao", { ascending: true })
    .order("data_compra", { ascending: false })
    .order("created_at", { ascending: false });

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
    .from("lancamentos_temp")
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
export async function getResponsaveisList(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lancamentos_temp")
    .select("responsavel")
    .eq("periodo", month);

  if (error) {
    console.error("Erro ao buscar responsaveis:", error);
    return [] as string[];
  }

  const set = new Set<string>();
  data?.forEach((item) => {
    if (item.responsavel) {
      set.add(item.responsavel as string);
    }
  });

  return Array.from(set);
}

export async function getFinancialSummaryForPeriod(
  authId: string,
  periodo: string,
) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "buscar_resumo_financeiro_por_periodo",
    {
      p_auth_id: authId,
      p_periodo: periodo,
    },
  );

  if (error)
    throw new Error(`Erro ao buscar resumo financeiro: ${error.message}`);
  return data;
}
