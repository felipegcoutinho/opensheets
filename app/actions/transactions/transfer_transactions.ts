"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { randomUUID } from "crypto";

export async function transferTransactions(formData: FormData) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const auth_id = user?.id;

  const {
    conta_origem_id,
    conta_destino_id,
    valor,
    data_transferencia,
    anotacao,
  } = Object.fromEntries(formData.entries()) as Record<string, string>;

  const { data: catDespesa } = await supabase
    .from("categorias")
    .select("id")
    .eq("nome", "Outros despesas")
    .single();

  const { data: catReceita } = await supabase
    .from("categorias")
    .select("id")
    .eq("nome", "Outros receitas")
    .single();

  const valorNumerico = parseFloat(
    valor.replace(/[R$\.\s]/g, "").replace(",", "."),
  );
  const periodo = format(new Date(data_transferencia), "MMMM-yyyy", {
    locale: ptBR,
  });

  const transfer_id = randomUUID();

  const base = {
    periodo,
    data_compra: data_transferencia,
    valor: valorNumerico,
    anotacao: anotacao || null,
    auth_id,
    responsavel: "você",
    condicao: "vista",
    forma_pagamento: "transferência",
    realizado: true,
    qtde_parcela: null,
    parcela_atual: null,
    qtde_recorrencia: null,
    cartao_id: null,
    categoria_id: null,
    dividir_lancamento: false,
    descricao: "Transferência",
    transfer_id,
  };

  const { error } = await supabase.from("transacoes").insert([
    {
      ...base,
      conta_id: conta_origem_id,
      tipo_transacao: "despesa",
      categoria_id: catDespesa?.id ?? null,
    },
    {
      ...base,
      conta_id: conta_destino_id,
      tipo_transacao: "receita",
      categoria_id: catReceita?.id ?? null,
    },
  ]);

  if (error) {
    console.error("Erro ao realizar transferência:", error);
    throw error;
  }

  revalidatePath("/lancamentos");
  revalidatePath("/conta");

  return { success: true };
}
