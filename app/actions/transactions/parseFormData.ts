import { parse } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

export interface DadosFormulario {
  dataCompra: string | null;
  dataVencimento: Date | null;
  descricao?: string;
  tipo_transacao?: string;
  periodo: string;
  realizado?: boolean;
  condicao?: string;
  forma_pagamento?: string;
  anotacao?: string;
  pagador_id?: string;
  segundo_pagador_id?: string;
  valorNumerico: number;
  parcelas: number;
  recorrencias: number;
  cartao_id?: string;
  categoria_id?: string;
  conta_id?: string;
  dividir_lancamento: boolean;
  dataInicial: Date;
}

export async function parseFormData(
  formData: FormData,
): Promise<DadosFormulario> {
  const periodo = String(formData.get("periodo") ?? "");
  const qtde_parcela = String(formData.get("qtde_parcela") ?? "");
  const qtde_recorrencia = String(formData.get("qtde_recorrencia") ?? "");
  const valor = String(formData.get("valor") ?? "0");
  const data_compra = formData.get("data_compra");
  const data_vencimento = formData.get("data_vencimento");

  const parcelas = parseInt(qtde_parcela || "1", 10);
  const recorrencias = parseInt(qtde_recorrencia || "1", 10);
  const valorNumerico = parseFloat(valor || "0");

  const [mes, ano] = (periodo || "").split("-");
  const dataInicial = parse(`01-${mes}-${ano}`, "dd-MMMM-yyyy", new Date(), {
    locale: ptBR,
  });

  if (isNaN(dataInicial.getTime())) {
    throw new Error(`Período inválido: ${periodo}`);
  }

  return {
    descricao: String(formData.get("descricao") ?? ""),
    tipo_transacao: String(formData.get("tipo_transacao") ?? ""),
    forma_pagamento: String(formData.get("forma_pagamento") ?? ""),
    anotacao: String(formData.get("anotacao") ?? ""),
    condicao: String(formData.get("condicao") ?? ""),
    pagador_id: String(formData.get("pagador_id") ?? ""),
    segundo_pagador_id: String(formData.get("segundo_pagador_id") ?? ""),
    cartao_id: String(formData.get("cartao_id") ?? ""),
    categoria_id: String(formData.get("categoria_id") ?? ""),
    conta_id: String(formData.get("conta_id") ?? ""),
    dividir_lancamento: formData.get("dividir_lancamento") === "on",
    parcelas,
    recorrencias,
    valorNumerico,
    periodo: periodo || "",
    dataCompra:
      typeof data_compra === "string" && data_compra
        ? new Date(data_compra).toISOString().split("T")[0]
        : null,
    dataVencimento:
      typeof data_vencimento === "string" && data_vencimento
        ? new Date(data_vencimento + "T00:00:00Z")
        : null,
    dataInicial,
  };
}
