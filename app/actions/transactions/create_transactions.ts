"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  ActionResponse,
  TransactionFormData,
  transactionSchema,
} from "../../(dashboard)/lancamento/modal/form-schema";
import { gerarTransacoes } from "./gerarTransacoes";
import { parseFormData } from "./parseFormData";
import { uploadImagem } from "./uploadImagem";
import {
  fetchPayersByIds,
  sendNewTransactionsEmail,
} from "@/app/actions/emails/send_new_transactions";

export async function createTransaction(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: TransactionFormData = {
    descricao: String(formData.get("descricao")),
    valor: String(formData.get("valor")),
    periodo: String(formData.get("periodo")),
    data_compra: (formData.get("data_compra") as string) || "",
    data_vencimento: (formData.get("data_vencimento") as string) || "",
    tipo_transacao: String(formData.get("tipo_transacao")),
    categoria_id: String(formData.get("categoria_id")),
    forma_pagamento: String(formData.get("forma_pagamento")),
    pagador_id: String(formData.get("pagador_id")),
    condicao: String(formData.get("condicao")),
    qtde_parcela: (formData.get("qtde_parcela") as string) || "",
    qtde_recorrencia: (formData.get("qtde_recorrencia") as string) || "",
    conta_id: (formData.get("conta_id") as string) || "",
    cartao_id: (formData.get("cartao_id") as string) || "",
    anotacao: (formData.get("anotacao") as string) || "",
    dividir_lancamento: (formData.get("dividir_lancamento") as string) || "",
    realizado: (formData.get("realizado") as string) || "",
  };

  const validated = transactionSchema.omit({ id: true }).safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Corrija os erros do formulário",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();

  try {
    const dados = await parseFormData(formData);
    // Resolver o campo 'pagador_id' do formulário (que contém o NOME) para o UUID real
    const pagadorNome = String(formData.get("pagador_id") || "").trim();
    if (!pagadorNome) {
      return { success: false, message: "Selecione um pagador." };
    }

    const { data: payerRow, error: payerError } = await supabase
      .from("pagadores")
      .select("id, nome")
      .eq("nome", pagadorNome)
      .single();

    if (payerError || !payerRow) {
      console.error("Pagador não encontrado:", payerError);
      return { success: false, message: "Pagador inválido." };
    }

    dados.pagador_id = payerRow.id as unknown as string;

    // Se for dividido e tiver um segundo pagador (nome), resolver UUID
    const segundoNome = String(formData.get("segundo_pagador_id") || "").trim();
    const dividirMarcado = String(formData.get("dividir_lancamento") || "");
    if (dividirMarcado && segundoNome) {
      const { data: secondRow, error: secondError } = await supabase
        .from("pagadores")
        .select("id, nome")
        .eq("nome", segundoNome)
        .single();
      if (secondError || !secondRow) {
        console.error("Segundo Pagador não encontrado:", secondError);
        return { success: false, message: "Segundo pagador inválido." };
      }
      (dados as any).segundo_pagador_id = secondRow.id as unknown as string;
    }
    const imagem_url = await uploadImagem(formData.get("imagem_url"), supabase);
    const transacoes = gerarTransacoes(dados, imagem_url);

    if (transacoes.length === 0) {
      return { success: false, message: "Nenhuma transação gerada." };
    }

    const { error } = await supabase.from("lancamentos").insert(transacoes);
    revalidatePath("/dashboard");
    revalidatePath("/lancamentos");

    if (error) {
      console.error("Erro ao adicionar transações:", error);
      return { success: false, message: "Erro ao adicionar Lançamento" };
    }

    // Envio de e-mail automático por pagador, se habilitado
    try {
      const groups = new Map<string, any[]>();
      for (const t of transacoes) {
        const pid = t?.pagador_id as unknown as string | undefined;
        if (!pid) continue;
        if (!groups.has(pid)) groups.set(pid, []);
        groups.get(pid)!.push(t);
      }

      const ids = Array.from(groups.keys());
      if (ids.length > 0) {
        const payers = await fetchPayersByIds(ids);
        await Promise.all(
          payers.map(async (payer) => {
            if (!payer?.is_auto_send) return;
            const txs = groups.get(payer.id) || [];
            if (!txs.length) return;
            try {
              await sendNewTransactionsEmail(payer, txs as any[]);
            } catch (e) {
              console.error("Falha ao enviar e-mail automático:", e);
            }
          }),
        );
      }
    } catch (e) {
      console.error("Erro no fluxo de e-mail automático:", e);
      // não bloqueia o fluxo principal
    }

    return { success: true, message: "Lançamento adicionado com sucesso!" };
  } catch (err) {
    console.error("Erro ao adicionar lançamento:", err);
    return { success: false, message: "Erro ao adicionar Lançamento" };
  }
}
