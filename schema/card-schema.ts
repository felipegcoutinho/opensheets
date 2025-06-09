import { z } from "zod";

export const CardSchema = z.object({
  descricao: z.string().min(1, "Informe a descrição"),
  dt_fechamento: z.string().min(1, "Data de fechamento obrigatória"),
  dt_vencimento: z.string().min(1, "Data de vencimento obrigatória"),
  bandeira: z.string().min(1, "Selecione a bandeira"),
  logo_image: z.string().min(1, "Selecione o logo"),
  tipo: z.string().min(1, "Tipo do cartão obrigatório"),
  status: z.string().min(1, "Selecione o status"),
  limite: z.string().min(1, "Informe o limite"),
  conta_id: z.string().min(1, "Selecione a conta"),
  anotacao: z.string().optional(),
});

export const CardUpdateSchema = CardSchema.extend({
  id: z.string().min(1),
});
