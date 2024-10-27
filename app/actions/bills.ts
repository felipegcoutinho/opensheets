"use server";
import { createClient } from "@/utils/supabase/server";
import { addMonths, format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { revalidatePath } from "next/cache";

// Busca a lista de boletos salvos
export async function getBills(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("boletos")
    .select(
      `id, descricao, periodo, dt_vencimento, categoria, status_pagamento, dt_pagamento, valor, condicao,
      qtde_recorrencia, anotacao, responsavel, contas ( id, descricao)`,
    )
    .eq("periodo", month)
    .order("dt_vencimento", { ascending: true });

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
    });
  }

  if (condicao === "Vista") {
    if (dividir_boleto === "on") {
      adicionarBoleto(valor / 2, responsavel, periodo, dt_vencimento);
      adicionarBoleto(valor / 2, segundo_responsavel, periodo, dt_vencimento);
    } else {
      adicionarBoleto(valor, responsavel, periodo, dt_vencimento);
    }
  } else if (condicao === "Recorrente") {
    const quantidadeRecorrencias = parseInt(qtde_recorrencia, 10);

    const [mesInicial, anoInicial] = periodo.split("-");
    const dataInicial = parse(
      `01-${mesInicial}-${anoInicial}`,
      "dd-MMMM-yyyy",
      new Date(),
      { locale: ptBR },
    );

    for (let i = 0; i < quantidadeRecorrencias; i++) {
      const dataRecorrente = addMonths(dataInicial, i);

      const diaOriginal = new Date(dt_vencimento).getUTCDate();
      const mesRecorrente = dataRecorrente.getUTCMonth();
      const anoRecorrente = dataRecorrente.getUTCFullYear();

      const dataRecorrenteComDia = new Date(
        Date.UTC(anoRecorrente, mesRecorrente, diaOriginal),
      );

      const periodoRecorrente = format(dataRecorrenteComDia, "MMMM-yyyy", {
        locale: ptBR,
      });
      const dt_vencimentoRecorrente = dataRecorrenteComDia
        .toISOString()
        .split("T")[0];

      if (dividir_boleto === "on") {
        adicionarBoleto(
          valor / 2,
          responsavel,
          periodoRecorrente,
          dt_vencimentoRecorrente,
        );
        adicionarBoleto(
          valor / 2,
          segundo_responsavel,
          periodoRecorrente,
          dt_vencimentoRecorrente,
        );
      } else {
        adicionarBoleto(
          valor,
          responsavel,
          periodoRecorrente,
          dt_vencimentoRecorrente,
        );
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
      })
      .eq("id", id);
    revalidatePath("/boleto");
  } catch (error) {
    console.error("Erro ao atualizar boleto:", error);
  }
}

// Busca apenas despesas realizadas de uma conta bancária específica e soma os valores
export async function getSumBillsExpensePaid(month) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("boletos")
    .select(`valor`)
    .eq("periodo", month)
    .eq("status_pagamento", "Pago")
    .eq("responsavel", "Você");

  if (error) {
    console.error("Erro ao buscar boletos pagos:", error);
    return null;
  }

  const sumBillsExpensePaid = data.reduce(
    (sum, item) => sum + parseFloat(item.valor),
    0,
  );

  return sumBillsExpensePaid;
}

export async function payBills(formData: FormData, id) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("boletos")
    .update({ status_pagamento: "Pago" })
    .eq("status_pagamento", "Pendente")
    .eq("id", id);

  if (error) {
    console.error("Erro ao pagar boletos:", error);
    return null;
  }

  return data;
}
