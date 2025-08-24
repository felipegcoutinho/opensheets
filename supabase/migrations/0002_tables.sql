-- Esquema de tabelas públicas
set search_path to public, extensions;

-- PERFIL DE USUÁRIOS (mirror de auth.users via trigger de criação)
create table if not exists public.profiles (
  id uuid primary key,
  updated_at timestamptz default now(),
  name text
);

-- CONTAS
create table if not exists public.contas (
  descricao text,
  auth_id uuid default auth.uid(),
  tipo_conta text,
  anotacao text,
  status text,
  logo_image text,
  is_ignored boolean,
  id uuid primary key default gen_random_uuid()
);

-- CARTOES
create table if not exists public.cartoes (
  descricao text not null,
  auth_id uuid not null default auth.uid(),
  dt_fechamento text,
  anotacao text,
  limite numeric,
  bandeira text,
  dt_vencimento text not null,
  logo_image text,
  status text default ''::text,
  id uuid primary key default gen_random_uuid(),
  conta_id uuid not null references public.contas(id)
);

-- ANOTACOES
create table if not exists public.anotacoes (
  descricao text,
  anotacao text,
  auth_id uuid not null default auth.uid(),
  id uuid primary key default gen_random_uuid()
);

-- CATEGORIAS
create table if not exists public.categorias (
  nome text not null,
  tipo_categoria text not null,
  icone text,
  auth_id uuid not null default auth.uid(),
  created_at timestamptz default now(),
  usado_para_calculos boolean,
  id uuid primary key default gen_random_uuid()
);

-- PAGADORES
create table if not exists public.pagadores (
  nome text not null,
  email text,
  foto text,
  status text not null,
  anotacao text,
  auth_id uuid not null default auth.uid(),
  created_at timestamptz not null default now(),
  role text,
  id uuid primary key default gen_random_uuid(),
  is_hidden boolean,
  is_auto_send boolean not null default false,
  last_mail timestamptz
);

-- ORCAMENTOS
create table if not exists public.orcamentos (
  valor_orcado numeric not null,
  periodo text not null, -- YYYY-MM
  auth_id uuid not null default auth.uid(),
  created_at timestamptz not null default now(),
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid references public.categorias(id),
  comment text
);
comment on table public.orcamentos is 'Armazena os orçamentos mensais por categoria para cada usuário.';
comment on column public.orcamentos.valor_orcado is 'O valor máximo definido para o orçamento daquela categoria no período.';
comment on column public.orcamentos.periodo is 'O período de validade do orçamento, geralmente no formato YYYY-MM.';

-- FATURAS
create table if not exists public.faturas (
  status_pagamento text,
  periodo text,
  auth_id uuid not null default auth.uid(),
  cartao_id uuid references public.cartoes(id),
  id uuid primary key default gen_random_uuid()
);

-- LANCAMENTOS
create table if not exists public.lancamentos (
  condicao text,
  descricao text,
  forma_pagamento text,
  anotacao text,
  valor numeric,
  auth_id uuid not null default auth.uid(),
  data_compra date,
  tipo_transacao text,
  qtde_parcela smallint,
  periodo text,
  parcela_atual smallint,
  qtde_recorrencia int,
  created_at timestamptz default now(),
  realizado boolean,
  dividir_lancamento boolean,
  imagem_url text,
  data_vencimento date,
  cartao_id uuid references public.cartoes(id),
  conta_id uuid references public.contas(id),
  categoria_id uuid references public.categorias(id),
  id uuid primary key default gen_random_uuid(),
  pagador_id uuid references public.pagadores(id)
);

-- FKs adicionais
alter table public.contas    add constraint contas_auth_id_fkey     foreign key (auth_id) references public.profiles(id) on delete cascade deferrable initially deferred;
alter table public.cartoes   add constraint cartoes_auth_id_fkey    foreign key (auth_id) references public.profiles(id) on delete cascade deferrable initially deferred;
alter table public.anotacoes add constraint anotacoes_auth_id_fkey  foreign key (auth_id) references public.profiles(id) on delete cascade deferrable initially deferred;
alter table public.categorias add constraint categorias_auth_id_fkey foreign key (auth_id) references public.profiles(id) on delete cascade deferrable initially deferred;
alter table public.pagadores add constraint pagadores_auth_id_fkey  foreign key (auth_id) references public.profiles(id) on delete cascade deferrable initially deferred;
alter table public.orcamentos add constraint orcamentos_auth_id_fkey foreign key (auth_id) references public.profiles(id) on delete cascade deferrable initially deferred;
alter table public.faturas   add constraint faturas_auth_id_fkey    foreign key (auth_id) references public.profiles(id) on delete cascade deferrable initially deferred;
alter table public.lancamentos add constraint lancamentos_auth_id_fkey foreign key (auth_id) references public.profiles(id) on delete cascade deferrable initially deferred;

-- Ativar RLS
alter table public.profiles enable row level security;
alter table public.contas enable row level security;
alter table public.cartoes enable row level security;
alter table public.anotacoes enable row level security;
alter table public.categorias enable row level security;
alter table public.pagadores enable row level security;
alter table public.orcamentos enable row level security;
alter table public.faturas enable row level security;
alter table public.lancamentos enable row level security;
