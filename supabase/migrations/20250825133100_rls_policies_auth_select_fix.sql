-- Migration: Ajusta policies RLS para evitar reavaliação por linha
-- Troca chamadas a auth.*() por subconsulta (select auth.*()) em USING/WITH CHECK
-- Referência: https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT * FROM (
      VALUES
        -- profiles
        ('Users can delete their own profile', 'public.profiles', 'id = (select auth.uid())', 'id = (select auth.uid())'),
        ('Users can insert their own profile', 'public.profiles', 'id = (select auth.uid())', 'id = (select auth.uid())'),
        ('Users can update their own profile', 'public.profiles', 'id = (select auth.uid())', 'id = (select auth.uid())'),
        ('Users can view their own profile',   'public.profiles', 'id = (select auth.uid())', NULL),
        -- categorias
        ('Users can delete their own categorias', 'public.categorias', 'auth_id = (select auth.uid())', 'auth_id = (select auth.uid())'),
        ('Users can insert their own categorias', 'public.categorias', 'auth_id = (select auth.uid())', 'auth_id = (select auth.uid())'),
        ('Users can update their own categorias', 'public.categorias', 'auth_id = (select auth.uid())', 'auth_id = (select auth.uid())'),
        ('Users can view their own categorias',   'public.categorias', 'auth_id = (select auth.uid())', NULL),
        -- pagadores
        ('Users can delete their own pagadores', 'public.pagadores', 'auth_id = (select auth.uid())', 'auth_id = (select auth.uid())'),
        ('Users can insert their own pagadores', 'public.pagadores', 'auth_id = (select auth.uid())', 'auth_id = (select auth.uid())'),
        ('Users can update their own pagadores', 'public.pagadores', 'auth_id = (select auth.uid())', 'auth_id = (select auth.uid())'),
        ('Users can view their own pagadores',   'public.pagadores', 'auth_id = (select auth.uid())', NULL),
        -- faturas
        ('Users can delete their own faturas', 'public.faturas', 'auth_id = (select auth.uid())', 'auth_id = (select auth.uid())'),
        ('Users can insert their own faturas', 'public.faturas', 'auth_id = (select auth.uid())', 'auth_id = (select auth.uid())'),
        ('Users can update their own faturas', 'public.faturas', 'auth_id = (select auth.uid())', 'auth_id = (select auth.uid())'),
        ('Users can view their own faturas',   'public.faturas', 'auth_id = (select auth.uid())', NULL),
        -- lancamentos (nomes de policy reportados no Advisor)
        ('Users can delete their own pagadores', 'public.lancamentos', 'auth_id = (select auth.uid())', 'auth_id = (select auth.uid())'),
        ('Users can insert their own pagadores', 'public.lancamentos', 'auth_id = (select auth.uid())', 'auth_id = (select auth.uid())'),
        ('Users can update their own pagadores', 'public.lancamentos', 'auth_id = (select auth.uid())', 'auth_id = (select auth.uid())'),
        ('Users can view their own pagadores',   'public.lancamentos', 'auth_id = (select auth.uid())', NULL)
    ) AS t(name, full_table, using_expr, check_expr)
  LOOP
    IF EXISTS (
      SELECT 1
      FROM pg_policies p
      JOIN pg_class c ON c.oid = p.polrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE p.polname = pol.name AND n.nspname || '.' || c.relname = pol.full_table
    ) THEN
      EXECUTE format(
        'ALTER POLICY %I ON %s USING (%s)%s',
        pol.name,
        pol.full_table,
        pol.using_expr,
        CASE WHEN pol.check_expr IS NULL THEN '' ELSE format(' WITH CHECK (%s)', pol.check_expr) END
      );
    END IF;
  END LOOP;
END $$;

