import * as z from "zod";

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  errors?: { [K in keyof T]?: string[] };
  inputs?: T;
}

export const cardFormSchema = z.object({
  logo_image: z.string().min(1),
  descricao: z.string().min(1),
  dt_fechamento: z.coerce.number().min(1).max(31),
  dt_vencimento: z.coerce.number().min(1).max(31),
  bandeira: z.string().min(1),
  tipo: z.string().min(1),
  status: z.string().min(1),
  limite: z.string().min(1),
  conta_id: z.string().min(1),
  anotacao: z.string().optional(),
});
export type CardFormSchema = z.infer<typeof cardFormSchema>;

export const updateCardFormSchema = cardFormSchema.extend({
  id: z.string().min(1),
});
export type UpdateCardFormSchema = z.infer<typeof updateCardFormSchema>;
