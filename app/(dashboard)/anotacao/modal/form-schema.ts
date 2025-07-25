import * as z from "zod";

export interface NoteFormData {
  id?: string;
  descricao: string;
  periodo: string;
  anotacao: string;
}

export interface ActionResponse<T = NoteFormData> {
  success: boolean;
  message: string;
  errors?: { [K in keyof T]?: string[] };
}

export const noteSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  periodo: z.string().min(1, "Período é obrigatório"),
  anotacao: z.string().min(1, "Anotação é obrigatória"),
});
