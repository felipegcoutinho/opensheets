"use server";
import { createClient } from "@/utils/supabase/server";
import { addMonths, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { revalidatePath } from "next/cache";

// Busca a lista de boletos salvos
export async function getBills(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("boletos")
    .select(
      `id, descricao, periodo, dt_vencimento, categoria, status_pagamento, dt_pagamento, valor, condicao,
      qtde_recorrencia, anotacao, responsavel, segundo_responsavel, contas ( id, descricao)`
    )
    .eq("periodo", month);

  if (error) {
    console.error("Erro em buscar boletos:", error);
    return null;
  }

  return data;
}

// Adiciona um novo boleto
export async function addBills(formData: FormData) {
  const {
    descricao,
    dt_vencimento,
    periodo,
    categoria,
    status_pagamento,
    dt_pagamento,
    valor,
    qtde_recorrencia,
    condicao,
    conta_id,
    anotacao,
    responsavel,
    segundo_responsavel,
    dividir_boleto,
  } = Object.fromEntries(formData.entries());

  const supabase = createClient();
  const boletos = [];

  function adicionarBoleto(valor, responsavel, periodo, dt_vencimento) {
    boletos.push({
      descricao,
      dt_vencimento,
      periodo,
      categoria,
      status_pagamento,
      dt_pagamento,
      valor,
      conta_id,
      qtde_recorrencia,
      condicao,
      anotacao,
      responsavel,
      segundo_responsavel,
    });
  }

  function dividirBoleto(valor, periodo, dt_vencimento) {
    adicionarBoleto(valor / 2, responsavel, periodo, dt_vencimento);
    adicionarBoleto(valor / 2, segundo_responsavel, periodo, dt_vencimento);
  }

  const [mesInicial, anoInicial] = periodo.split("-");
  const dataInicial = parse(`01-${mesInicial}-${anoInicial}`, "dd-MMMM-yyyy", new Date(), { locale: ptBR });

  if (condicao === "Vista") {
    if (dividir_boleto === "on") {
      dividirBoleto(valor, periodo, dt_vencimento);
    } else {
      adicionarBoleto(valor, responsavel, periodo, dt_vencimento);
    }
  } else if (condicao === "Recorrente") {
    const quantidadeRecorrencias = parseInt(qtde_recorrencia, 10);

    for (let i = 0; i < quantidadeRecorrencias; i++) {
      const dataRecorrente = addMonths(dataInicial, i);
      const mesRecorrente = dataRecorrente.toLocaleString("pt-BR", { month: "long" });
      const anoRecorrente = dataRecorrente.getFullYear();
      const periodoRecorrente = `${mesRecorrente}-${anoRecorrente}`;
      const dt_vencimentoRecorrente = dataRecorrente.toISOString().split("T")[0];

      if (dividir_boleto === "on") {
        dividirBoleto(valor, periodoRecorrente, dt_vencimentoRecorrente);
      } else {
        adicionarBoleto(valor, responsavel, periodoRecorrente, dt_vencimentoRecorrente);
      }
    }
  }

  try {
    await supabase.from("boletos").insert(boletos);
    revalidatePath("/boleto");
  } catch (error) {
    console.error("Erro ao adicionar boleto:", error);
  }
}

// Deleta um boleto
export async function deleteBills(formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = createClient();

  try {
    await supabase.from("boletos").delete().eq("id", excluir);
    revalidatePath("/boleto");
  } catch (error) {
    console.error("Erro ao adicionar boleto:", error);
  }
}

// Atualiza um boleto
export async function updateBills(formData: FormData) {
  const {
    id,
    descricao,
    dt_vencimento,
    periodo,
    categoria,
    status_pagamento,
    dt_pagamento,
    valor,
    conta_id,
    qtde_recorrencia,
    condicao,
    anotacao,
    responsavel,
    segundo_responsavel,
  } = Object.fromEntries(formData.entries());

  const supabase = createClient();

  try {
    await supabase
      .from("boletos")
      .update({
        id,
        descricao,
        dt_vencimento,
        periodo,
        categoria,
        status_pagamento,
        dt_pagamento,
        valor,
        conta_id,
        qtde_recorrencia,
        condicao,
        anotacao,
        responsavel,
        segundo_responsavel,
      })
      .eq("id", id);
    revalidatePath("/boleto");
  } catch (error) {
    console.error("Erro ao atualizar boleto:", error);
  }
}
