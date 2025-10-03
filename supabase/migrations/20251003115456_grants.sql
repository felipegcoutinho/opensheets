-- Table GRANTs snapshot (public)
-- NOTE: Adjust roles as needed in target project.
GRANT ALL PRIVILEGES ON TABLE public.anotacoes TO postgres;
GRANT SELECT,INSERT,UPDATE,DELETE ON TABLE public.anotacoes TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.anotacoes TO service_role;

GRANT ALL PRIVILEGES ON TABLE public.cartoes TO postgres;
GRANT SELECT,INSERT,UPDATE,DELETE ON TABLE public.cartoes TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.cartoes TO service_role;

GRANT ALL PRIVILEGES ON TABLE public.categorias TO postgres;
GRANT ALL PRIVILEGES ON TABLE public.categorias TO anon;
GRANT ALL PRIVILEGES ON TABLE public.categorias TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.categorias TO service_role;
GRANT INSERT ON TABLE public.categorias TO supabase_auth_admin;

GRANT ALL PRIVILEGES ON TABLE public.contas TO postgres;
GRANT SELECT,INSERT,UPDATE,DELETE ON TABLE public.contas TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.contas TO service_role;

GRANT ALL PRIVILEGES ON TABLE public.faturas TO postgres;
GRANT ALL PRIVILEGES ON TABLE public.faturas TO anon;
GRANT ALL PRIVILEGES ON TABLE public.faturas TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.faturas TO service_role;

GRANT ALL PRIVILEGES ON TABLE public.lancamentos TO postgres;
GRANT ALL PRIVILEGES ON TABLE public.lancamentos TO anon;
GRANT ALL PRIVILEGES ON TABLE public.lancamentos TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.lancamentos TO service_role;

GRANT ALL PRIVILEGES ON TABLE public.orcamentos TO postgres;
GRANT ALL PRIVILEGES ON TABLE public.orcamentos TO anon;
GRANT ALL PRIVILEGES ON TABLE public.orcamentos TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.orcamentos TO service_role;

GRANT ALL PRIVILEGES ON TABLE public.pagadores TO postgres;
GRANT ALL PRIVILEGES ON TABLE public.pagadores TO anon;
GRANT ALL PRIVILEGES ON TABLE public.pagadores TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.pagadores TO service_role;

GRANT ALL PRIVILEGES ON TABLE public.profiles TO postgres;
GRANT SELECT,INSERT,UPDATE ON TABLE public.profiles TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.profiles TO service_role;
