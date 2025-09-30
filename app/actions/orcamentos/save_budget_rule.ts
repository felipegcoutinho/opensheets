"use server";

import type { BudgetRuleConfig } from "@/app/(dashboard)/orcamento/rule/budget-rule";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

interface ActionState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: BudgetRuleConfig;
}

const schema = z
  .object({
    ativada: z
      .string()
      .optional()
      .transform((value) => value === "true" || value === "on"),
    necessidades: z.coerce.number().min(0).max(100),
    desejos: z.coerce.number().min(0).max(100),
    objetivos: z.coerce.number().min(0).max(100),
  })
  .superRefine((value, ctx) => {
    const sum =
      Number(value.necessidades) +
      Number(value.desejos) +
      Number(value.objetivos);
    if (Math.abs(sum - 100) > 0.01) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As porcentagens precisam somar 100%",
        path: ["necessidades"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As porcentagens precisam somar 100%",
        path: ["desejos"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As porcentagens precisam somar 100%",
        path: ["objetivos"],
      });
    }
  });

export async function saveBudgetRule(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = schema.safeParse({
    ativada: formData.get("ativada")?.toString(),
    necessidades: formData.get("necessidades"),
    desejos: formData.get("desejos"),
    objetivos: formData.get("objetivos"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Corrija os campos destacados",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { ativada, necessidades, desejos, objetivos } = parsed.data;

  const supabase = createClient();

  const payload = {
    ativada,
    percentual_necessidades: Number(necessidades.toFixed(2)),
    percentual_desejos: Number(desejos.toFixed(2)),
    percentual_objetivos: Number(objetivos.toFixed(2)),
  };

  try {
    const { data: existing, error: fetchError } = await supabase
      .from("orcamento_regra_502030")
      .select("id")
      .maybeSingle();

    if (fetchError) {
      console.error("Erro ao verificar regra existente:", fetchError);
      return {
        success: false,
        message: "Não foi possível salvar a regra no momento.",
      };
    }

    if (existing?.id) {
      const { error } = await supabase
        .from("orcamento_regra_502030")
        .update(payload)
        .eq("id", existing.id);

      if (error) {
        console.error("Erro ao atualizar regra 50/30/20:", error);
        return {
          success: false,
          message: "Erro ao atualizar configuração.",
        };
      }
    } else {
      const { error } = await supabase
        .from("orcamento_regra_502030")
        .insert(payload);

      if (error) {
        console.error("Erro ao criar regra 50/30/20:", error);
        return {
          success: false,
          message: "Erro ao criar configuração.",
        };
      }
    }

    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard");
    revalidatePath("/orcamento");
    revalidatePath("/lancamentos");
    revalidatePath("/calendario");

    return {
      success: true,
      message: "Regra 50/30/20 atualizada com sucesso!",
      data: {
        ativada,
        percentuais: {
          necessidades,
          desejos,
          objetivos,
        },
      },
    };
  } catch (error) {
    console.error("Erro inesperado ao salvar regra 50/30/20:", error);
    return {
      success: false,
      message: "Erro inesperado ao salvar configuração.",
    };
  }
}
