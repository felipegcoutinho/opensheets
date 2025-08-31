"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "../../(dashboard)/lancamento/modal/form-schema";

export async function updateTransaction(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const supabase = createClient();
  const {
    id,
    data_compra,
    data_vencimento,
    dt_pagamento_boleto,
    descricao,
    tipo_transacao,
    periodo,
    realizado,
    condicao,
    forma_pagamento,
    anotacao,
    valor,
    qtde_parcela,
    parcela_atual,
    qtde_recorrencia,
    cartao_id,
    categoria_id,
    conta_id,
    dividir_lancamento,
    imagem_url_atual, // URL da imagem existente
  } = Object.fromEntries(formData.entries());

  // Normaliza booleanos vindos do FormData
  const hasRealizado = formData.has("realizado");
  const realizadoBool = hasRealizado
    ? (() => {
        if (typeof realizado === "string") {
          const val = realizado.toLowerCase();
          return val === "true" || val === "on" || val === "1";
        }
        return Boolean(realizado);
      })()
    : undefined;

  const hasDtPagamentoBoleto = formData.has("dt_pagamento_boleto");

  let imageUrl = imagem_url_atual; // Use o URL existente como padrão
  const imageFile = formData.get("imagem_url"); // Novo arquivo enviado

  // Verificar se há um novo arquivo de imagem
  if (imageFile && imageFile instanceof File && imageFile.size > 0) {
    const fileName = `${Date.now()}_${imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("comprovantes")
      .upload(fileName, imageFile);

    if (uploadError) {
      console.error("Erro ao fazer upload da imagem:", uploadError);
      throw new Error("Erro ao fazer upload da imagem");
    } else {
      // Gerar URL assinada para a nova imagem
      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from("comprovantes")
          .createSignedUrl(fileName, 31536000);

      if (signedUrlError) {
        console.error("Erro ao gerar Signed URL:", signedUrlError);
        throw new Error("Erro ao gerar URL assinada");
      }

      imageUrl = signedUrlData.signedUrl;
    }
  }

  // Atualizar a transação no banco de dados
  try {
    // Mapear nome do pagador (enviado no campo 'pagador_id' do form) para UUID real
    let pagador_id: string | null = null;
    const pagadorNomeForm = formData.get("pagador_id");
    if (typeof pagadorNomeForm === "string" && pagadorNomeForm.trim()) {
      const { data: payerRow, error: payerError } = await supabase
        .from("pagadores")
        .select("id, nome")
        .eq("nome", pagadorNomeForm.trim())
        .single();
      if (!payerError && payerRow) {
        pagador_id = (payerRow.id as unknown as string) || null;
      }
    }

    const updatePayload: Record<string, any> = {
      data_compra,
      data_vencimento,
      descricao,
      tipo_transacao,
      periodo,
      imagem_url: imageUrl,
      condicao,
      forma_pagamento,
      anotacao,
      pagador_id,
      valor,
      qtde_parcela,
      parcela_atual,
      qtde_recorrencia,
      cartao_id,
      categoria_id,
      conta_id,
      dividir_lancamento,
    };

    if (hasRealizado) {
      updatePayload.realizado = realizadoBool;
    }
    if (hasDtPagamentoBoleto) {
      updatePayload.dt_pagamento_boleto =
        typeof dt_pagamento_boleto === "string" && dt_pagamento_boleto.trim()
          ? dt_pagamento_boleto
          : null;
    }

    await supabase.from("lancamentos").update(updatePayload).eq("id", id);

    console.log("Transação atualizada com sucesso!");
    revalidatePath("/lancamentos");
  } catch (error) {
    console.error("Erro ao atualizar a transação:", error);
    throw error;
  }
}

export async function togglePagamento(id: string, realizadoAtual: boolean) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lancamentos")
    .update({ realizado: !realizadoAtual })
    .eq("id", id);
  if (error) {
    console.error("Erro ao atualizar status de pagamento:", error);
    return { error };
  }
  return { data };
}

export async function payBills(id: string, realizadoAtual: boolean) {
  const supabase = createClient();
  const novoStatus = !realizadoAtual;
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const todayStr = `${y}-${m}-${d}`;
  const payload = novoStatus
    ? { realizado: true, dt_pagamento_boleto: todayStr }
    : { realizado: false, dt_pagamento_boleto: null };

  const { error } = await supabase
    .from("lancamentos")
    .update(payload)
    .eq("id", id);
  if (error) {
    console.error("Erro ao atualizar boleto:", error);
    return { success: false, message: "Erro ao pagar boleto." };
  }

  revalidatePath("/dashboard");
  return { success: true, message: "Boleto pago com sucesso." };
}
