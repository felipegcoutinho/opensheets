import * as z from "zod";

export interface CategoryFormData {
  id?: string;
  nome: string;
  tipo_categoria: string;
  usado_para_calculos?: string;
}

export interface ActionResponse<T = CategoryFormData> {
  success: boolean;
  message: string;
  errors?: { [K in keyof T]?: string[] };
}

export const categorySchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo_categoria: z.string().min(1, "Tipo de categoria é obrigatório"),
  usado_para_calculos: z.string().optional(),
});
