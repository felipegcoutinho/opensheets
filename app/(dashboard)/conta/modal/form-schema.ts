import * as z from "zod";

export interface AccountFormData {
  id?: string;
  descricao: string;
  tipo_conta: string;
  logo_image: string;
  status: string;
  anotacao?: string;
  is_ignored?: string;
}

export interface ActionResponse<T = AccountFormData> {
  success: boolean;
  message: string;
  errors?: { [K in keyof T]?: string[] };
}

export const accountSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  tipo_conta: z.string().min(1, "Tipo da Conta é obrigatório"),
  logo_image: z.string().min(1, "Logo é obrigatória"),
  status: z.string().min(1, "Status é obrigatório"),
  anotacao: z.string().optional(),
  is_ignored: z.string().optional(),
});
