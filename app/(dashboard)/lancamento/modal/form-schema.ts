import * as z from "zod";

export interface TransactionFormData {
  id?: string;
  descricao: string;
  valor: string;
  periodo: string;
  data_compra?: string;
  data_vencimento?: string;
  tipo_transacao: string;
  categoria_id: string;
  forma_pagamento: string;
  pagador_id?: string;
  segundo_pagador_id?: string;
  condicao: string;
  qtde_parcela?: string;
  qtde_recorrencia?: string;
  conta_id?: string;
  cartao_id?: string;
  anotacao?: string;
  dividir_lancamento?: string;
  realizado?: string;
}

export interface ActionResponse<T = TransactionFormData> {
  success: boolean;
  message: string;
  errors?: { [K in keyof T]?: string[] };
}

export const transactionSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
  periodo: z.string().min(1, "Período é obrigatório"),
  data_compra: z.string().optional(),
  data_vencimento: z.string().optional(),
  tipo_transacao: z.string().min(1, "Tipo de transação é obrigatório"),
  categoria_id: z.string().min(1, "Categoria é obrigatória"),
  forma_pagamento: z.string().min(1, "Forma de pagamento é obrigatória"),
  pagador_id: z.string().optional(),
  segundo_pagador_id: z.string().optional(),
  condicao: z.string().min(1, "Condição é obrigatória"),
  qtde_parcela: z.string().optional(),
  qtde_recorrencia: z.string().optional(),
  conta_id: z.string().optional(),
  cartao_id: z.string().optional(),
  anotacao: z.string().optional(),
  dividir_lancamento: z.string().optional(),
  realizado: z.string().optional(),
});
