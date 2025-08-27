-- Atualiza a função para usar apenas o campo "name" do user_metadata
-- e garante que o trigger exista. Mantém a lógica existente para perfis,
-- categorias, pagadores e conta padrão.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_provider text;
  v_name text;
  v_email text;
  v_picture text;
BEGIN
  v_provider := COALESCE(
      new.raw_app_meta_data ->> 'provider',
      (new.raw_app_meta_data -> 'providers') ->> 0
  );

  -- Usa apenas "name" do user_metadata
  v_name := NULLIF(new.raw_user_meta_data ->> 'name', '');

  v_email := new.email;

  v_picture := COALESCE(
      NULLIF(new.raw_user_meta_data ->> 'picture', ''),
      NULLIF(new.raw_user_meta_data ->> 'avatar_url', '')
  );

  -- 1) Cria profile (name)
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, v_name)
  ON CONFLICT (id) DO NOTHING;

  -- 2) Categorias padrão
  INSERT INTO public.categorias (nome, tipo_categoria, icone, auth_id, usado_para_calculos)
  VALUES
      ('férias', 'receita', 'games', new.id, true),
      ('bares', 'despesa', 'beer', new.id, true),
      ('pagamentos', 'despesa', 'salary', new.id, true),
      ('loteria e apostas', 'despesa', 'funds', new.id, true),
      ('delivery', 'despesa', 'play-store', new.id, true),
      ('terceiros', 'despesa', 'group', new.id, true),
      ('restaurantes', 'despesa', 'food', new.id, true),
      ('vendas', 'receita', 'partnership', new.id, true),
      ('reembolso', 'receita', 'refund', new.id, true),
      ('lazer e hobbies', 'despesa', 'sports', new.id, true),
      ('saúde', 'despesa', 'medicine', new.id, true),
      ('transporte', 'despesa', 'car', new.id, true),
      ('rendimentos', 'receita', 'percent', new.id, true),
      ('dívidas e empréstimos', 'despesa', 'percent', new.id, true),
      ('moradia', 'despesa', 'home-heart', new.id, true),
      ('cuidados pessoais', 'despesa', 'people', new.id, true),
      ('presente', 'receita', 'gift', new.id, true),
      ('mercado', 'despesa', 'shopping-cart', new.id, true),
      ('outras receitas', 'receita', 'question', new.id, true),
      ('impostos e taxas', 'despesa', 'percent', new.id, true),
      ('ajuste de saldo', 'receita', 'salary', new.id, true),
      ('prêmios', 'receita', 'gift', new.id, true),
      ('investimentos', 'despesa', 'funds', new.id, true),
      ('assinaturas e serviços', 'despesa', 'netflix', new.id, true),
      ('compras', 'despesa', 'shopping-bag', new.id, true),
      ('investimentos', 'receita', 'funds', new.id, true),
      ('outras despesas', 'despesa', 'question', new.id, true),
      ('viagem', 'despesa', 'suitcase', new.id, true),
      ('roupas', 'despesa', 'clothing', new.id, true),
      ('salário', 'receita', 'salary', new.id, true),
      ('trabalho', 'despesa', 'briefcase', new.id, true),
      ('alimentação', 'despesa', 'food', new.id, true),
      ('presentes e doações', 'despesa', 'donation', new.id, true),
      ('educação', 'despesa', 'education', new.id, true)
  ON CONFLICT DO NOTHING;

  -- 3) Pagador principal
  IF v_provider = 'google' THEN
      INSERT INTO public.pagadores (nome, email, role, status, foto, anotacao, is_hidden, is_auto_send, auth_id)
      SELECT COALESCE(v_name, 'você'), v_email, 'principal', 'ativo', v_picture, NULL, false, false, new.id
      WHERE NOT EXISTS (
        SELECT 1 FROM public.pagadores WHERE auth_id = new.id AND role = 'principal'
      );
  ELSE
      INSERT INTO public.pagadores (nome, email, role, status, foto, anotacao, is_hidden, is_auto_send, auth_id)
      SELECT 'você', v_email, 'principal', 'ativo', 'undraw_finance-guy-avatar_vhop.png', NULL, false, false, new.id
      WHERE NOT EXISTS (
        SELECT 1 FROM public.pagadores WHERE auth_id = new.id AND role = 'principal'
      );
  END IF;

  -- 3b) Pagador sistema
  INSERT INTO public.pagadores (nome, email, role, status, foto, anotacao, is_hidden, is_auto_send, auth_id)
  SELECT 'sistema', NULL, 'sistema', 'ativo', NULL, NULL, true, false, new.id
  WHERE NOT EXISTS (
      SELECT 1 FROM public.pagadores WHERE auth_id = new.id AND role = 'sistema'
  );

  -- 4) Conta padrão
  INSERT INTO public.contas (descricao, tipo_conta, logo_image, anotacao, status, is_ignored, auth_id)
  SELECT 'Conta padrão', 'corrente', 'padrao_os.png', 'Esta conta foi criada automaticamente', 'ativo', false, new.id
  WHERE NOT EXISTS (
      SELECT 1 FROM public.contas WHERE auth_id = new.id AND descricao = 'Conta padrão'
  );

  RETURN NEW;
END;
$$;

-- Garante que o trigger exista (idempotente)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$;

