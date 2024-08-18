"use server";
import { createClient } from "@/utils/supabase/server";
import { addMonths, format, parse } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { revalidatePath } from "next/cache";

export async function getTransaction(month) {
  const supabase = createClient();

  const { data: transacao, error } = await supabase
    .from("transacoes")
    .select(
      `id, data_compra, periodo, descricao, tipo_transacao, categoria, realizado, condicao, 
      forma_pagamento, anotacao, responsavel, segundo_responsavel, valor, qtde_parcela, parcela_atual, recorrencia,
      qtde_recorrencia, cartoes (id, descricao), contas (id, descricao)`
    )
    .order("data_compra", { ascending: false })
    .eq("periodo", month);

  if (error) {
    console.error("Erro ao buscar transações:", error);
    return [];
  }

  return transacao;
}

export async function addTransaction(formData: FormData) {
  const {
    data_compra,
    descricao,
    tipo_transacao,
    periodo,
    categoria,
    realizado,
    condicao,
    forma_pagamento,
    anotacao,
    responsavel,
    valor,
    qtde_parcela,
    parcela_atual,
    recorrencia,
    qtde_recorrencia,
    cartao_id,
    conta_id,
    segundo_responsavel,
    dividir_lancamento,
  } = Object.fromEntries(formData.entries());

  const supabase = createClient();

  const transacoes = [];

  function adicionarTransacao(valor, responsavel, periodo, parcela_atual) {
    transacoes.push({
      data_compra,
      descricao,
      tipo_transacao,
      periodo,
      categoria,
      realizado,
      condicao,
      forma_pagamento,
      anotacao,
      responsavel,
      valor,
      qtde_parcela,
      parcela_atual,
      recorrencia,
      qtde_recorrencia,
      cartao_id,
      conta_id,
    });
  }

  if (condicao === "Vista") {
    if (dividir_lancamento === "on") {
      adicionarTransacao(valor / 2, responsavel, periodo, parcela_atual);
      adicionarTransacao(valor / 2, segundo_responsavel, periodo, parcela_atual);
    } else {
      adicionarTransacao(valor, responsavel, periodo, parcela_atual);
    }
  } else if (condicao === "Parcelado") {
    const parcelas = parseInt(qtde_parcela, 10);
    const valorTotal = parseFloat(valor);
    const valorParcela = parseFloat((valorTotal / parcelas).toFixed(2));
    const valorUltimaParcela = parseFloat((valorTotal - valorParcela * (parcelas - 1)).toFixed(2));

    const [mesInicial, anoInicial] = periodo.split("-");
    const dataInicial = parse(`01-${mesInicial}-${anoInicial}`, "dd-MMMM-yyyy", new Date(), { locale: ptBR });

    for (let i = 0; i < parcelas; i++) {
      const dataParcela = addMonths(dataInicial, i);
      const mesParcela = format(dataParcela, "MMMM", { locale: ptBR });
      const anoParcela = dataParcela.getFullYear();
      const periodoParcela = `${mesParcela}-${anoParcela}`;
      const parcelaAtual = i + 1;
      const valorAtual = i === parcelas - 1 ? valorUltimaParcela : valorParcela;

      if (dividir_lancamento === "on") {
        adicionarTransacao(valorAtual / 2, responsavel, periodoParcela, parcelaAtual);
        adicionarTransacao(valorAtual / 2, segundo_responsavel, periodoParcela, parcelaAtual);
      } else {
        adicionarTransacao(valorAtual, responsavel, periodoParcela, parcelaAtual);
      }
    }
  } else if (condicao === "Recorrente") {
    const quantidadeRecorrencias = parseInt(qtde_recorrencia, 10);

    const [mesInicial, anoInicial] = periodo.split("-");
    const dataInicial = parse(`01-${mesInicial}-${anoInicial}`, "dd-MMMM-yyyy", new Date(), { locale: ptBR });

    for (let i = 0; i < quantidadeRecorrencias; i++) {
      const dataRecorrente = addMonths(dataInicial, i);
      const mesRecorrente = format(dataRecorrente, "MMMM", { locale: ptBR });
      const anoRecorrente = dataRecorrente.getFullYear();
      const periodoRecorrente = `${mesRecorrente}-${anoRecorrente}`;

      if (dividir_lancamento === "on") {
        adicionarTransacao(valor / 2, responsavel, periodoRecorrente, null);
        adicionarTransacao(valor / 2, segundo_responsavel, periodoRecorrente, null);
      } else {
        adicionarTransacao(valor, responsavel, periodoRecorrente, null);
      }
    }
  }

  try {
    await supabase.from("transacoes").insert(transacoes);
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error adding transaction:", error);
  }
}

export async function deleteTransaction(formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = createClient();
  await supabase.from("transacoes").delete().eq("id", excluir);
  revalidatePath("/dashboard");
}

export async function updateTransaction(formData: FormData) {
  const {
    id,
    data_compra,
    descricao,
    tipo_transacao,
    periodo,
    categoria,
    realizado,
    condicao,
    forma_pagamento,
    anotacao,
    responsavel,
    segundo_responsavel,
    valor,
    qtde_parcela,
    parcela_atual,
    recorrencia,
    qtde_recorrencia,
    cartao_id,
    conta_id,
  } = Object.fromEntries(formData.entries());

  const supabase = createClient();

  try {
    await supabase
      .from("transacoes")
      .update({
        data_compra,
        descricao,
        tipo_transacao,
        periodo,
        categoria,
        realizado,
        condicao,
        forma_pagamento,
        anotacao,
        responsavel,
        segundo_responsavel,
        valor,
        qtde_parcela,
        parcela_atual,
        recorrencia,
        qtde_recorrencia,
        cartao_id,
        conta_id,
      })
      .eq("id", id);

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
  }
}
