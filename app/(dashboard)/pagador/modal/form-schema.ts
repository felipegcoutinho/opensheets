import * as z from "zod";

export interface PayerFormData {
  id?: string;
  nome: string;
  email?: string;
  status: string;
  anotacao?: string;
  foto?: string | null;
}

export interface ActionResponse<T = PayerFormData> {
  success: boolean;
  message: string;
  errors?: { [K in keyof T]?: string[] };
}

export const payerSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  status: z.string().min(1, "Status é obrigatório"),
  anotacao: z.string().optional(),
  foto: z.string().nullable().optional().or(z.literal("")),
});
