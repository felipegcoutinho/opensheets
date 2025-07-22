import * as z from "zod";

export interface BudgetFormData {
  id?: string;
  valor_orcado: string;
  periodo: string;
  categoria_id: string;
}

export interface ActionResponse<T = BudgetFormData> {
  success: boolean;
  message: string;
  errors?: { [K in keyof T]?: string[] };
}

export const budgetSchema = z.object({
  id: z.string().optional(),
  valor_orcado: z.string().min(1, "Valor é obrigatório"),
  periodo: z.string().min(1, "Período é obrigatório"),
  categoria_id: z.string().min(1, "Categoria é obrigatória"),
});
