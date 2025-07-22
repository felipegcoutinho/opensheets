import * as z from "zod";

export interface CardFormData {
  id?: string;
  descricao: string;
  dt_vencimento: string;
  dt_fechamento: string;
  anotacao?: string;
  limite: string;
  bandeira: string;
  logo_image: string;
  tipo: string;
  status: string;
  conta_id: string;
}

export interface ActionResponse<T = CardFormData> {
  success: boolean;
  message: string;
  errors?: { [K in keyof T]?: string[] };
}

export const cardSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  dt_vencimento: z.string().min(1, "Vencimento é obrigatório"),
  dt_fechamento: z.string().min(1, "Fechamento é obrigatório"),
  anotacao: z.string().optional(),
  limite: z.string().min(1, "Limite é obrigatório"),
  bandeira: z.string().min(1, "Bandeira é obrigatória"),
  logo_image: z.string().min(1, "Logo é obrigatório"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  status: z.string().min(1, "Status é obrigatório"),
  conta_id: z.string().min(1, "Conta é obrigatória"),
});
