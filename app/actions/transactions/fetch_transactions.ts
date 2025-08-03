import { createClient } from "@/utils/supabase/server";
import { parse } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

const supabase = createClient();

const transactions = (month: string) =>
  supabase.from("transacoes").eq("periodo", month);

const transactionsOfYou = (month: string) =>
  transactions(month).eq("responsavel", "você");

const sumValor = (rows: { valor: string }[]) =>
  rows.reduce((sum, { valor }) => sum + parseFloat(valor), 0);

const orderedList = (query: any) =>
  query
    .order("tipo_transacao", { ascending: true })
    .order("data_compra", { ascending: false })
    .order("created_at", { ascending: false });

export async function getIncome(month: string) {
  const { data, error } = await transactionsOfYou(month)
    .select("valor, categoria_id!inner(id, nome)")
    .eq("tipo_transacao", "receita")
    .neq("categoria_id.nome", "saldo anterior");

  if (error) throw error;
  return sumValor(data);
}

export async function getExpense(month: string) {
  const { data, error } = await transactionsOfYou(month)
    .select("valor")
    .eq("tipo_transacao", "despesa");

  if (error) throw error;
  return sumValor(data);
}

export async function getPaidExpense(month: string) {
  const { data, error } = await transactions(month)
    .select("valor")
    .eq("tipo_transacao", "despesa")
    .eq("realizado", true)
    .neq("forma_pagamento", "cartão de crédito");

  if (error) throw error;
  return sumValor(data);
}

export async function getConditions(month: string) {
  const { data, error } = await transactionsOfYou(month)
    .select("condicao, valor.sum()")
    .eq("tipo_transacao", "despesa")
    .order("condicao", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getPayment(month: string) {
  const { data, error } = await transactionsOfYou(month)
    .select("forma_pagamento, valor.sum()")
    .eq("tipo_transacao", "despesa");

  if (error) throw error;
  return data;
}

export async function getTransactionsByCategory(month: string) {
  const { data, error } = await transactionsOfYou(month).select(
    `valor, tipo_transacao, categoria:categoria_id (id, nome, icone )`,
  );

  if (error) throw error;
  return data;
}

export async function getRecentTransactions(month: string) {
  const { data, error } = await transactionsOfYou(month)
    .select(
      "id, data_compra, data_vencimento, descricao, valor, cartoes (id, logo_image), contas (id, logo_image)",
    )
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data;
}

export async function getSumPaidExpense(month: string) {
  const { data, error } = await transactionsOfYou(month)
    .select("valor")
    .eq("tipo_transacao", "despesa")
    .eq("realizado", true);

  if (error) throw error;
  return sumValor(data);
}

export async function getSumPaidIncome(month: string) {
  const { data, error } = await transactionsOfYou(month)
    .select("valor")
    .eq("tipo_transacao", "receita")
    .eq("realizado", true);

  if (error) throw error;
  return sumValor(data);
}

export async function getTransactions(month: string) {
  const { data, error } = await orderedList(
    transactions(month).select(
      `id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, imagem_url, realizado, condicao,
      forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual,
      qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image), categorias(id, nome)`,
    ),
  );

  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return [];
  }

  return data;
}

export async function getBills(month: string) {
  const { data, error } = await transactionsOfYou(month)
    .select("id, valor, descricao, data_vencimento, realizado")
    .eq("tipo_transacao", "despesa")
    .eq("forma_pagamento", "boleto");

  if (error) throw error;
  return data;
}

export async function getTransactionsByConditions(
  condicao: string,
  month: string,
) {
  const { data, error } = await orderedList(
    transactionsOfYou(month)
      .select(
        `id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, imagem_url, realizado, condicao,
        forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual,
        qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image), categorias(id, nome)`,
      )
      .eq("condicao", condicao)
      .eq("tipo_transacao", "despesa"),
  );

  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return [];
  }

  return data;
}

// Busca a lista de Lançamentos para tabela de faturas
export async function getCardInvoice(month: string, cartao_id: number) {
  const { data, error } = await transactions(month)
    .select(
      `id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, imagem_url, realizado, condicao,
      forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual,
      qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image), categorias(id, nome)`,
    )
    .eq("cartao_id", cartao_id)
    .order("data_compra", { ascending: false });

  if (error) {
    console.error("Erro ao buscar faturas:", error);
    return null;
  }

  return data;
}

// Busca o valor total das despesas do cartão
export async function getCardSum(month: string, cartao_id: number) {
  const { data, error } = await transactions(month)
    .select("valor")
    .eq("cartao_id", cartao_id)
    .eq("tipo_transacao", "despesa");

  if (error) {
    console.error("Erro ao buscar transacoes:", error);
    return null;
  }

  return sumValor(data);
}

// Busca a lista de categoria para tabela
export async function getCategoria(
  month: string,
  categoria_nome: string,
  tipo_transacao: string,
) {
  const { data, error } = await transactionsOfYou(month)
    .select(
      `id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, imagem_url, realizado, condicao,
      forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual,
      qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image), categorias(id, nome), categoria_id!inner(id, nome)`,
    )
    .eq("tipo_transacao", tipo_transacao)
    .eq("categoria_id.nome", categoria_nome)
    .order("data_compra", { ascending: false });

  if (error) {
    console.error("Erro ao buscar faturas:", error);
    return null;
  }

  return data;
}

// Função para obter o limite em uso
export async function getLimiteEmUso(cartao_id: number) {
  const { data, error } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("cartao_id", cartao_id)
    .eq("tipo_transacao", "despesa")
    .eq("forma_pagamento", "cartão de crédito")
    .eq("realizado", false);

  if (error) {
    console.error("Erro ao buscar limite em uso:", error);
    return 0;
  }

  return sumValor(data);
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
    limiteEmUso,
    limiteDisponivel,
  };
}

// Busca as Lançamentos de uma conta bancária específica na tabela transacoes
export async function getAccountInvoice(month: string, conta_id: number) {
  const { data, error } = await transactions(month)
    .select(
      `id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, imagem_url, realizado, condicao, forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual, qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image), categorias (id, nome)`,
    )
    .eq("realizado", true)
    .eq("conta_id", conta_id)
    .or("responsavel.eq.você,responsavel.eq.sistema");

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
  const { data, error } = await supabase
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

  const limitDate = parse(`01-${month}`, "dd-MMMM-yyyy", new Date(), {
    locale: ptBR,
  });

  return data.reduce((sum, item) => {
    const itemDate = parse(`01-${item.periodo}`, "dd-MMMM-yyyy", new Date(), {
      locale: ptBR,
    });

    if (itemDate <= limitDate) {
      const valor = parseFloat(item.valor);
      return sum + (isNaN(valor) ? 0 : valor);
    }

    return sum;
  }, 0);
}

// Busca as receitas de uma conta bancária específica e soma os valores
export function getSumAccountIncome(month: string, id: number) {
  return getSumAccountByType(month, id, "receita");
}

// Busca as despesas de uma conta bancária específica e soma os valores
export function getSumAccountExpense(month: string, id: number) {
  return getSumAccountByType(month, id, "despesa");
}

export async function getTransactionsByResponsible(month: string) {
  const { data, error } = await transactions(month)
    .select(
      "responsavel, data_vencimento, cartoes (descricao, logo_image, dt_vencimento), valor",
    )
    .eq("tipo_transacao", "despesa")
    .neq("responsavel", "sistema")
    .neq("forma_pagamento", "boleto")
    .order("responsavel", { ascending: true });

  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return null;
  }

  return data;
}

export async function getBillsByResponsible(month: string) {
  const { data, error } = await transactions(month)
    .select("responsavel, descricao, valor, data_vencimento")
    .eq("tipo_transacao", "despesa")
    .eq("forma_pagamento", "boleto")
    .neq("responsavel", "sistema")
    .order("responsavel", { ascending: true });

  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return null;
  }

  return data;
}

export async function getTransactionsByResponsableVoce(month: string) {
  const { data, error } = await orderedList(
    transactionsOfYou(month).select(
      `id, data_compra, data_vencimento, periodo, descricao, tipo_transacao, realizado, condicao,
      forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual,
      qtde_recorrencia, dividir_lancamento, categorias ( id, nome ), cartoes (id, descricao), contas (id, descricao)`,
    ),
  );

  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return [];
  }

  return data;
}

// Retorna lista de descricoes unicas para um periodo
export async function getDescriptionsList(month: string) {
  const { data, error } = await transactions(month).select("descricao");

  if (error) {
    console.error("Erro ao buscar descricoes:", error);
    return [] as string[];
  }

  const set = new Set<string>();
  data?.forEach((item) => {
    if (item.descricao) set.add(item.descricao as string);
  });

  return Array.from(set);
}

// Retorna lista de responsaveis unicos para um periodo
export async function getResponsaveisList(month: string) {
  const { data, error } = await transactions(month).select("responsavel");

  if (error) {
    console.error("Erro ao buscar responsaveis:", error);
    return [] as string[];
  }

  const set = new Set<string>();
  data?.forEach((item) => {
    if (item.responsavel) set.add(item.responsavel as string);
  });

  return Array.from(set);
}

export async function getFinancialSummaryForPeriod(
  authId: string,
  periodo: string,
) {
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
