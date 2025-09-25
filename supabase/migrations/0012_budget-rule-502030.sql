-- Add coluna para identificar a faixa da regra 50/30/20 nos lançamentos
ALTER TABLE public.lancamentos
  ADD COLUMN IF NOT EXISTS regra_502030_tipo text
    CHECK (regra_502030_tipo IN ('necessidades', 'desejos', 'objetivos'));

-- Configuração por usuário da regra 50/30/20
CREATE TABLE IF NOT EXISTS public.orcamento_regra_502030 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid NOT NULL DEFAULT auth.uid(),
  ativada boolean NOT NULL DEFAULT false,
  percentual_necessidades numeric(5,2) NOT NULL DEFAULT 50,
  percentual_desejos numeric(5,2) NOT NULL DEFAULT 30,
  percentual_objetivos numeric(5,2) NOT NULL DEFAULT 20,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT orcamento_regra_502030_percent_check CHECK (
    percentual_necessidades >= 0 AND
    percentual_desejos >= 0 AND
    percentual_objetivos >= 0 AND
    percentual_necessidades + percentual_desejos + percentual_objetivos = 100
  ),
  CONSTRAINT orcamento_regra_502030_auth_unique UNIQUE (auth_id)
);

-- Atualiza automaticamente o campo updated_at
CREATE OR REPLACE FUNCTION public.trg_orcamento_regra_502030_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_orcamento_regra_502030_updated_at'
      AND tgrelid = 'public.orcamento_regra_502030'::regclass
  ) THEN
    EXECUTE 'DROP TRIGGER trg_orcamento_regra_502030_updated_at ON public.orcamento_regra_502030';
  END IF;
END;
$$;
CREATE TRIGGER trg_orcamento_regra_502030_updated_at
BEFORE UPDATE ON public.orcamento_regra_502030
FOR EACH ROW
EXECUTE FUNCTION public.trg_orcamento_regra_502030_updated_at();

-- Proteções de segurança
ALTER TABLE public.orcamento_regra_502030 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own budget rule" ON public.orcamento_regra_502030
  FOR SELECT TO authenticated
  USING (auth_id = auth.uid());

CREATE POLICY "Users can insert their own budget rule" ON public.orcamento_regra_502030
  FOR INSERT TO authenticated
  WITH CHECK (auth_id = auth.uid());

CREATE POLICY "Users can update their own budget rule" ON public.orcamento_regra_502030
  FOR UPDATE TO authenticated
  USING (auth_id = auth.uid())
  WITH CHECK (auth_id = auth.uid());

CREATE POLICY "Users can delete their own budget rule" ON public.orcamento_regra_502030
  FOR DELETE TO authenticated
  USING (auth_id = auth.uid());
