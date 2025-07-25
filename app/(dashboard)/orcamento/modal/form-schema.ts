import * as z from "zod";

export interface BudgetFormData {
  id?: string;
  categoria_id: string;
  periodo: string;
  valor_orcado: string;
}

export interface ActionResponse<T = BudgetFormData> {
  success: boolean;
  message: string;
  errors?: { [K in keyof T]?: string[] };
}

export const budgetSchema = z.object({
  id: z.string().optional(),
  categoria_id: z.string().min(1, "Categoria é obrigatória"),
  periodo: z.string().min(1, "Período é obrigatório"),
  valor_orcado: z.string().min(1, "Valor é obrigatório"),
});
