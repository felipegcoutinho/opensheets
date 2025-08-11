-- Migration: Full schema export (tables, functions, policies) generated 2025-08-10
-- WARNING: Review before applying to a fresh project. Adjust extensions list as needed.

-- ============== EXTENSIONS (only those actually installed) ==============
create extension if not exists "pgcrypto" with schema extensions;
create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists "pg_stat_statements" with schema extensions;
create extension if not exists "pg_net" with schema extensions;
create extension if not exists "pgjwt" with schema extensions;
create extension if not exists "pg_graphql" with schema graphql;
create extension if not exists pgsodium;

-- (Optional/common) Uncomment if required by your environment
-- create extension if not exists "pg_trgm";
-- create extension if not exists "citext";

-- ============== TABLES ==============
-- Note: Order chosen to satisfy FK dependencies.

-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text
);

-- contas
create table if not exists public.contas (
  id uuid primary key default gen_random_uuid(),
  descricao text,
  auth_id uuid default auth.uid() references public.profiles(id) on delete cascade,
  tipo_conta text,
  anotacao text,
  status text,
  logo_image text,
  is_ignored boolean
);

-- cartoes
create table if not exists public.cartoes (
  id uuid primary key default gen_random_uuid(),
  descricao text not null,
  auth_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  dt_fechamento text,
  anotacao text,
  limite numeric,
  bandeira text,
  dt_vencimento text not null,
  logo_image text,
  status text default ''::text,
  conta_id uuid not null references public.contas(id) on delete cascade
);

-- categorias
create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo_categoria text not null,
  icone text,
  auth_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  usado_para_calculos boolean
);

-- anotacoes
create table if not exists public.anotacoes (
  id uuid primary key default gen_random_uuid(),
  descricao text,
  anotacao text,
  auth_id uuid not null default auth.uid() references public.profiles(id) on delete cascade
);

-- pagadores
create table if not exists public.pagadores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text,
  foto text,
  status text not null,
  anotacao text,
  auth_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  role text
);

-- orcamentos
create table if not exists public.orcamentos (
  id uuid primary key default gen_random_uuid(),
  valor_orcado numeric not null,
  periodo text not null,
  auth_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  categoria_id uuid references public.categorias(id) on delete set null,
  constraint orcamentos_valor_orcado_check check (valor_orcado >= 0)
);
comment on table public.orcamentos is 'Armazena os orçamentos mensais por categoria para cada usuário.';
comment on column public.orcamentos.valor_orcado is 'O valor máximo definido para o orçamento daquela categoria no período.';
comment on column public.orcamentos.periodo is 'O período de validade do orçamento, geralmente no formato YYYY-MM.';

-- faturas
create table if not exists public.faturas (
  id uuid primary key default gen_random_uuid(),
  status_pagamento text,
  periodo text,
  auth_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  cartao_id uuid references public.cartoes(id) on delete set null
);

-- transacoes
create table if not exists public.transacoes (
  id uuid primary key default gen_random_uuid(),
  condicao text,
  descricao text,
  forma_pagamento text,
  anotacao text,
  valor numeric,
  auth_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  data_compra date,
  tipo_transacao text,
  qtde_parcela smallint,
  periodo text,
  parcela_atual smallint,
  qtde_recorrencia integer,
  created_at timestamptz default now(),
  responsavel text not null,
  realizado boolean,
  dividir_lancamento boolean,
  imagem_url text,
  data_vencimento date,
  cartao_id uuid references public.cartoes(id) on delete set null,
  conta_id uuid references public.contas(id) on delete set null,
  categoria_id uuid references public.categorias(id) on delete set null
);

-- ============== FUNCTIONS ==============
-- (Existing user-defined functions)

create or replace function public.atualizar_transacoes_como_realizadas()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
BEGIN
  UPDATE public.transacoes
  SET realizado = TRUE
  WHERE cartao_id = NEW.cartao_id
    AND periodo = NEW.periodo
    AND auth_id = NEW.auth_id;

  RETURN NEW;
END;
$$;

create or replace function public.buscar_resumo_financeiro_por_periodo(p_auth_id uuid, p_periodo text, p_responsavel text DEFAULT 'você')
returns table(periodo text, receitas numeric, despesas numeric, balanco numeric, saldo_previsto numeric)
language sql
as $$
  with resumo as (
    SELECT
      periodo,
      ROUND(SUM(CASE WHEN tipo_transacao = 'receita' THEN valor ELSE 0 END), 2) AS receitas,
      ROUND(SUM(CASE WHEN tipo_transacao = 'despesa' THEN valor ELSE 0 END), 2) AS despesas,
      ROUND(
        SUM(CASE WHEN tipo_transacao = 'receita' THEN valor ELSE 0 END) -
        SUM(CASE WHEN tipo_transacao = 'despesa' THEN valor ELSE 0 END), 2
      ) AS balanco,
      ROUND(
        SUM(
          SUM(CASE WHEN tipo_transacao = 'receita' THEN valor ELSE 0 END) -
          SUM(CASE WHEN tipo_transacao = 'despesa' THEN valor ELSE 0 END)
        ) OVER (
          ORDER BY TO_DATE(
            CASE
              WHEN periodo LIKE 'janeiro-%' THEN '01-' || RIGHT(periodo, 4)
              WHEN periodo LIKE 'fevereiro-%' THEN '02-' || RIGHT(periodo, 4)
              WHEN periodo LIKE 'março-%' THEN '03-' || RIGHT(periodo, 4)
              WHEN periodo LIKE 'abril-%' THEN '04-' || RIGHT(periodo, 4)
              WHEN periodo LIKE 'maio-%' THEN '05-' || RIGHT(periodo, 4)
              WHEN periodo LIKE 'junho-%' THEN '06-' || RIGHT(periodo, 4)
              WHEN periodo LIKE 'julho-%' THEN '07-' || RIGHT(periodo, 4)
              WHEN periodo LIKE 'agosto-%' THEN '08-' || RIGHT(periodo, 4)
              WHEN periodo LIKE 'setembro-%' THEN '09-' || RIGHT(periodo, 4)
              WHEN periodo LIKE 'outubro-%' THEN '10-' || RIGHT(periodo, 4)
              WHEN periodo LIKE 'novembro-%' THEN '11-' || RIGHT(periodo, 4)
              WHEN periodo LIKE 'dezembro-%' THEN '12-' || RIGHT(periodo, 4)
            END,
            'MM-YYYY'
          )
        ), 2
      ) AS saldo_previsto
    FROM transacoes
    WHERE responsavel = p_responsavel
      AND auth_id = p_auth_id
    GROUP BY periodo
  )
  SELECT * FROM resumo WHERE periodo = p_periodo;
$$;

create or replace function public.get_faturas(month text)
returns table(cartao_id uuid, descricao text, dt_vencimento text, logo_image text, status_pagamento text, total_valor numeric)
language plpgsql
as $$BEGIN
    RETURN QUERY
    WITH faturas_status AS (
        SELECT
            f.cartao_id,
            f.periodo,
            COALESCE(f.status_pagamento, 'pendente') AS status_pagamento
        FROM
            public.faturas f
        WHERE
            f.periodo = month
    ),
    transacoes_mes AS (
        SELECT
            t.cartao_id,
            SUM(t.valor)::numeric AS valor_responsavel
        FROM
            public.transacoes t
        WHERE
            t.periodo = month
        GROUP BY
            t.cartao_id
    ),
    total_por_cartao AS (
        SELECT
            tm.cartao_id,
            SUM(tm.valor_responsavel) AS total_valor
        FROM
            transacoes_mes tm
        GROUP BY
            tm.cartao_id
    )
    SELECT
        c.id AS cartao_id,
        c.descricao,
        c.dt_vencimento,
        c.logo_image,
        COALESCE(fs.status_pagamento, 'pendente') AS status_pagamento,
        tpc.total_valor
    FROM
        total_por_cartao tpc
    JOIN
        public.cartoes c ON c.id = tpc.cartao_id
    LEFT JOIN
        faturas_status fs ON fs.cartao_id = tpc.cartao_id
    ORDER BY
        c.descricao;
END;$$;

create or replace function public.handle_fatura_deletada()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$begin
  delete from public.transacoes
  where periodo = old.periodo
    and auth_id = old.auth_id
    and descricao like concat('Fatura de ', (select descricao from public.cartoes where id = old.cartao_id))
    and responsavel = 'sistema';
  return old;
end;$$;

create or replace function public.handle_fatura_pago()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$DECLARE
  categoria_pagamento_id uuid;
  soma_valor NUMERIC;
BEGIN
  SELECT id INTO categoria_pagamento_id
  FROM categorias
  WHERE nome = 'pagamentos'
    AND auth_id = NEW.auth_id
  LIMIT 1;

  IF categoria_pagamento_id IS NULL THEN
    RAISE EXCEPTION 'Categoria "pagamentos" não encontrada para o usuário.';
  END IF;

  SELECT COALESCE(SUM(valor), 0)
  INTO soma_valor
  FROM public.transacoes
  WHERE cartao_id = NEW.cartao_id
    AND periodo = NEW.periodo
    AND responsavel = 'você';

  IF soma_valor = 0 THEN
    soma_valor := 0.00;
  END IF;

  INSERT INTO public.transacoes (
    categoria_id,
    condicao,
    descricao,
    forma_pagamento,
    anotacao,
    valor,
    auth_id,
    data_compra,
    tipo_transacao,
    conta_id,
    qtde_parcela,
    periodo,
    parcela_atual,
    qtde_recorrencia,
    created_at,
    responsavel,
    cartao_id,
    realizado
  )
  SELECT
    categoria_pagamento_id,
    'vista',
    CONCAT('Fatura de ', c.descricao),
    'pix',
    NULL,
    soma_valor,
    NEW.auth_id,
    CURRENT_DATE,
    'despesa',
    c.conta_id,
    NULL,
    NEW.periodo,
    NULL,
    NULL,
    NOW(),
    'sistema',
    NULL,
    TRUE
  FROM public.cartoes c
  WHERE c.id = NEW.cartao_id
  LIMIT 1;

  RETURN NEW;
END;$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to ''
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  )
  on conflict (id) do nothing;

  insert into public.categorias (nome, tipo_categoria, icone, auth_id, usado_para_calculos)
  values
    ('Salário',       'receita', 'Wallet',        new.id, true),
    ('Freelance',     'receita', 'Briefcase',     new.id, true),
    ('Investimentos', 'receita', 'PiggyBank',     new.id, true),
    ('Alimentação',   'despesa', 'Utensils',      new.id, true),
    ('Transporte',    'despesa', 'Car',           new.id, true),
    ('Moradia',       'despesa', 'Home',          new.id, true),
    ('Lazer',         'despesa', 'Clapperboard',  new.id, true),
    ('Saúde',         'despesa', 'HeartPulse',    new.id, true),
    ('Educação',      'despesa', 'BookOpen',      new.id, true),
    ('Serviços',      'despesa', 'Wifi',          new.id, true),
    ('Impostos',      'despesa', 'Receipt',       new.id, true);

  insert into public.pagadores (nome, email, role, status, foto, anotacao, auth_id)
  values
    ('Você',   null, 'principal', 'ativo', 'mastercard.png', null, new.id),
    ('Sistema', null, 'sistema',   'ativo', 'mastercard.png', null, new.id);

  insert into public.contas (descricao, tipo_conta, logo_image, anotacao, status, is_ignored,  auth_id)
  values
    ('Conta padrão', 'corrente', 'padrao_os.png', 'Esta conta foi criada automaticamente', 'ativo', false, new.id);

  return new;
end;
$$;

create or replace function public.reverter_transacoes_para_nao_realizadas()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
BEGIN
  UPDATE public.transacoes
  SET realizado = FALSE
  WHERE cartao_id = OLD.cartao_id
    AND periodo = OLD.periodo
    AND auth_id = OLD.auth_id;

  RETURN OLD;
END;
$$;

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============== TRIGGERS (none were listed; leave placeholders if needed) ==============
-- Add CREATE TRIGGER statements here if they exist in original DB.

-- ============== RLS POLICIES ==============
-- Enable RLS on tables.
alter table public.profiles enable row level security;
alter table public.contas enable row level security;
alter table public.cartoes enable row level security;
alter table public.categorias enable row level security;
alter table public.anotacoes enable row level security;
alter table public.pagadores enable row level security;
alter table public.orcamentos enable row level security;
alter table public.faturas enable row level security;
alter table public.transacoes enable row level security;

-- profiles policies
create policy if not exists "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy if not exists "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
create policy if not exists "Users can view their own profile" on public.profiles for select using (auth.uid() = id);

-- contas policies
create policy if not exists "Users can delete only their own records" on public.contas for delete using (auth_id = (select auth.uid()));
create policy if not exists "Users can insert their own records" on public.contas for insert with check (auth_id = (select auth.uid()));
create policy if not exists "Users can update only their own records" on public.contas for update using (auth_id = (select auth.uid())) with check (auth_id = (select auth.uid()));
create policy if not exists "Users can view only their own records" on public.contas for select using (auth_id = (select auth.uid()));

-- cartoes policies (single ALL policy in export)
create policy if not exists "Enable all action based on user_id" on public.cartoes for all using ((select auth.uid()) = auth_id) with check ((select auth.uid()) = auth_id);

-- categorias policies
create policy if not exists "Users can delete their own categorias" on public.categorias for delete using (auth.uid() = auth_id);
create policy if not exists "Users can insert their own categorias" on public.categorias for insert with check (auth.uid() = auth_id);
create policy if not exists "Users can update their own categorias" on public.categorias for update using (auth.uid() = auth_id);
create policy if not exists "Users can view their own categorias" on public.categorias for select using (auth.uid() = auth_id);

-- anotacoes policies (single ALL policy)
create policy if not exists "Enable all action based on user_id" on public.anotacoes for all using (((select auth.uid()) = auth_id)) with check (((select auth.uid()) = auth_id));

-- pagadores policies
create policy if not exists "Users can delete their own pagadores" on public.pagadores for delete using (auth.uid() = auth_id);
create policy if not exists "Users can insert their own pagadores" on public.pagadores for insert with check (auth.uid() = auth_id);
create policy if not exists "Users can update their own pagadores" on public.pagadores for update using (auth.uid() = auth_id);
create policy if not exists "Users can view their own pagadores" on public.pagadores for select using (auth.uid() = auth_id);

-- orcamentos policies
create policy if not exists "Users can delete their own orcamentos" on public.orcamentos for delete using (auth_id = (select auth.uid()));
create policy if not exists "Users can insert their own orcamentos" on public.orcamentos for insert with check (auth_id = (select auth.uid()));
create policy if not exists "Users can update their own orcamentos" on public.orcamentos for update using (auth_id = (select auth.uid())) with check (auth_id = (select auth.uid()));
create policy if not exists "Users can view their own orcamentos" on public.orcamentos for select using (auth_id = (select auth.uid()));

-- faturas policies
create policy if not exists "Users can delete their own faturas" on public.faturas for delete using (auth.uid() = auth_id);
create policy if not exists "Users can insert their own faturas" on public.faturas for insert with check (auth.uid() = auth_id);
create policy if not exists "Users can update their own faturas" on public.faturas for update using (auth.uid() = auth_id);
create policy if not exists "Users can view their own faturas" on public.faturas for select using (auth.uid() = auth_id);

-- transacoes policies
create policy if not exists "Users can delete only their own records" on public.transacoes for delete using (auth_id = (select auth.uid()));
create policy if not exists "Users can insert their own records" on public.transacoes for insert with check (auth_id = (select auth.uid()));
create policy if not exists "Users can update only their own records" on public.transacoes for update using (auth_id = (select auth.uid())) with check (auth_id = (select auth.uid()));
create policy if not exists "Users can view only their own records" on public.transacoes for select using (auth_id = (select auth.uid()));

-- ============== DONE ==============
