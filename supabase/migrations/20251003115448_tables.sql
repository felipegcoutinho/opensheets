-- Tables (public schema)
CREATE TABLE IF NOT EXISTS public.anotacoes (
  descricao text,
  anotacao text,
  auth_id uuid NOT NULL DEFAULT auth.uid(),
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.cartoes (
  descricao text NOT NULL,
  auth_id uuid NOT NULL DEFAULT auth.uid(),
  dt_fechamento text,
  anotacao text,
  limite numeric(10,2),
  bandeira text,
  dt_vencimento text NOT NULL,
  logo_image text,
  status text DEFAULT ''::text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conta_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS public.categorias (
  nome text NOT NULL,
  tipo_categoria text NOT NULL,
  icone text,
  auth_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamp with time zone DEFAULT now(),
  usado_para_calculos boolean,
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.contas (
  descricao text,
  auth_id uuid DEFAULT auth.uid(),
  tipo_conta text,
  anotacao text,
  status text,
  logo_image text,
  is_ignored boolean,
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.faturas (
  status_pagamento text,
  periodo text,
  auth_id uuid NOT NULL DEFAULT auth.uid(),
  cartao_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lancamentos (
  condicao text,
  descricao text,
  forma_pagamento text,
  anotacao text,
  valor numeric,
  auth_id uuid NOT NULL DEFAULT auth.uid(),
  data_compra date,
  tipo_transacao text,
  qtde_parcela smallint,
  periodo text,
  parcela_atual smallint,
  qtde_recorrencia integer,
  created_at timestamp with time zone DEFAULT now(),
  realizado boolean,
  dividir_lancamento boolean,
  imagem_url text,
  data_vencimento date,
  cartao_id uuid,
  conta_id uuid,
  categoria_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pagador_id uuid,
  dt_pagamento_boleto date,
  regra_502030_tipo text CHECK (regra_502030_tipo IN ('necessidades', 'desejos', 'objetivos'))
);

CREATE TABLE IF NOT EXISTS public.orcamentos (
  valor_orcado numeric NOT NULL,
  periodo text NOT NULL,
  auth_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  categoria_id uuid
);

CREATE TABLE IF NOT EXISTS public.pagadores (
  nome text NOT NULL,
  email text,
  foto text,
  status text NOT NULL,
  anotacao text,
  auth_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  role text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  is_hidden boolean,
  is_auto_send boolean NOT NULL DEFAULT false,
  last_mail timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  first_name text,
  last_name text
);

CREATE TABLE IF NOT EXISTS public.orcamento_regra_502030 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid NOT NULL DEFAULT auth.uid(),
  ativada boolean NOT NULL DEFAULT false,
  percentual_necessidades numeric(5,2) NOT NULL DEFAULT 50,
  percentual_desejos numeric(5,2) NOT NULL DEFAULT 30,
  percentual_objetivos numeric(5,2) NOT NULL DEFAULT 20,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT orcamento_regra_502030_percent_check CHECK (
    percentual_necessidades >= 0 AND
    percentual_desejos >= 0 AND
    percentual_objetivos >= 0 AND
    percentual_necessidades + percentual_desejos + percentual_objetivos = 100
  ),
  CONSTRAINT orcamento_regra_502030_auth_unique UNIQUE (auth_id)
);

-- Sequences
CREATE SEQUENCE IF NOT EXISTS public.numeric_id_seq;
