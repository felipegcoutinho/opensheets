-- Migration: Adiciona índices para chaves estrangeiras sem cobertura
-- Contexto: Performance Advisor apontou FKs sem índice nas tabelas públicas
-- Observação: Não usar CONCURRENTLY em migrações do Supabase (rodam em transação)

-- cartoes
CREATE INDEX IF NOT EXISTS idx_cartoes_auth_id ON public.cartoes (auth_id);
CREATE INDEX IF NOT EXISTS idx_cartoes_conta_id ON public.cartoes (conta_id);

-- categorias
CREATE INDEX IF NOT EXISTS idx_categorias_auth_id ON public.categorias (auth_id);

-- contas
CREATE INDEX IF NOT EXISTS idx_contas_auth_id ON public.contas (auth_id);

-- faturas
CREATE INDEX IF NOT EXISTS idx_faturas_auth_id ON public.faturas (auth_id);
CREATE INDEX IF NOT EXISTS idx_faturas_cartao_id ON public.faturas (cartao_id);

-- lancamentos
CREATE INDEX IF NOT EXISTS idx_lancamentos_cartao_id ON public.lancamentos (cartao_id);
CREATE INDEX IF NOT EXISTS idx_lancamentos_categoria_id ON public.lancamentos (categoria_id);
CREATE INDEX IF NOT EXISTS idx_lancamentos_conta_id ON public.lancamentos (conta_id);
CREATE INDEX IF NOT EXISTS idx_lancamentos_pagador_id ON public.lancamentos (pagador_id);

-- orcamentos
CREATE INDEX IF NOT EXISTS idx_orcamentos_auth_id ON public.orcamentos (auth_id);
CREATE INDEX IF NOT EXISTS idx_orcamentos_categoria_id ON public.orcamentos (categoria_id);

-- pagadores
CREATE INDEX IF NOT EXISTS idx_pagadores_auth_id ON public.pagadores (auth_id);

