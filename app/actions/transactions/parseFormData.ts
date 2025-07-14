import { parse } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

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
  responsavel?: string;
  valorNumerico: number;
  parcelas: number;
  recorrencias: number;
  cartao_id?: string;
  categoria_id?: string;
  conta_id?: string;
  segundo_responsavel?: string;
  dividir_lancamento: boolean;
  dataInicial: Date;
}

export async function parseFormData(
  formData: FormData,
): Promise<DadosFormulario> {
  const dados = Object.fromEntries(formData.entries());

  const {
    periodo,
    qtde_parcela,
    qtde_recorrencia,
    valor,
    data_compra,
    data_vencimento,
    ...rest
  } = dados;

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
    ...rest,
    parcelas,
    recorrencias,
    valorNumerico,
    periodo: periodo || "",
    dataCompra: data_compra
      ? new Date(data_compra).toISOString().split("T")[0]
      : null,
    dataVencimento: data_vencimento
      ? new Date(data_vencimento + "T00:00:00Z")
      : null,
    dividir_lancamento: dados.dividir_lancamento === "on",
    dataInicial,
  };
}
