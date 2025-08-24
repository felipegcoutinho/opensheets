set search_path to public, extensions;

-- Funções (copiadas do estado atual)
create or replace function public.update_updated_at_column() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Remove user in auth schema when profile deleted
create or replace function public.delete_user_from_auth() returns trigger
language plpgsql security definer as $$
begin
  delete from auth.users where id = old.id;
  return old;
end;$$;

create or replace function public.handle_new_user() returns trigger
language plpgsql
security definer
set search_path to '' as $$
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

v_name := COALESCE(
    NULLIF(new.raw_user_meta_data ->> 'name', ''),
    NULLIF(new.raw_user_meta_data ->> 'full_name', '')
);

v_email := new.email;

v_picture := COALESCE(
    NULLIF(new.raw_user_meta_data ->> 'picture', ''),
    NULLIF(new.raw_user_meta_data ->> 'avatar_url', '')
);

INSERT INTO public.profiles (id, name)
VALUES (new.id, v_name)
ON CONFLICT (id) DO NOTHING;

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

INSERT INTO public.pagadores (nome, email, role, status, foto, anotacao, is_hidden, is_auto_send, auth_id)
SELECT 'sistema', NULL, 'sistema', 'ativo', NULL, NULL, true, false, new.id
WHERE NOT EXISTS (
    SELECT 1 FROM public.pagadores WHERE auth_id = new.id AND role = 'sistema'
);

INSERT INTO public.contas (descricao, tipo_conta, logo_image, anotacao, status, is_ignored, auth_id)
SELECT 'Conta padrão', 'corrente', 'padrao_os.png', 'Esta conta foi criada automaticamente', 'ativo', false, new.id
WHERE NOT EXISTS (
    SELECT 1 FROM public.contas WHERE auth_id = new.id AND descricao = 'Conta padrão'
);
RETURN NEW;
END;
$$;

create or replace function public.atualizar_transacoes_como_realizadas() returns trigger
language plpgsql security definer set search_path to 'public' as $$
BEGIN
  UPDATE public.lancamentos
  SET realizado = TRUE
  WHERE cartao_id = NEW.cartao_id
    AND periodo = NEW.periodo
    AND auth_id = NEW.auth_id;
  RETURN NEW;
END;$$;

create or replace function public.reverter_transacoes_para_nao_realizadas() returns trigger
language plpgsql security definer set search_path to 'public' as $$
BEGIN
  UPDATE public.lancamentos
  SET realizado = FALSE
  WHERE cartao_id = OLD.cartao_id
    AND periodo = OLD.periodo
    AND auth_id = OLD.auth_id;
  RETURN OLD;
END;$$;

create or replace function public.handle_fatura_pago() returns trigger
language plpgsql security definer set search_path to 'public' as $$
declare
  categoria_pagamento_id uuid;
  soma_valor numeric;
  pagador_principal_id uuid;
  pagador_sistema_id uuid;
  v_conta_id uuid;
  v_cartao_nome text;
begin
  select c.id into categoria_pagamento_id from public.categorias c where c.nome = 'pagamentos' and c.auth_id = new.auth_id limit 1;
  if categoria_pagamento_id is null then raise exception 'Categoria pagamentos não encontrada para o usuário %.', new.auth_id; end if;
  select p.id into pagador_principal_id from public.pagadores p where p.auth_id = new.auth_id and p.role = 'principal' limit 1;
  if pagador_principal_id is null then raise exception 'Pagador principal não encontrado para %.', new.auth_id; end if;
  select p.id into pagador_sistema_id from public.pagadores p where p.auth_id = new.auth_id and p.role = 'sistema' limit 1;
  if pagador_sistema_id is null then raise exception 'Pagador sistema não encontrado para %.', new.auth_id; end if;
  select c.conta_id, c.descricao into v_conta_id, v_cartao_nome from public.cartoes c where c.id = new.cartao_id limit 1;
  if v_conta_id is null then raise exception 'Cartão % não encontrado ou sem conta.', new.cartao_id; end if;
  select coalesce(sum(l.valor),0) into soma_valor from public.lancamentos l where l.cartao_id = new.cartao_id and l.periodo = new.periodo and l.auth_id = new.auth_id and l.pagador_id = pagador_principal_id;
  insert into public.lancamentos (
    condicao, descricao, forma_pagamento, anotacao, valor, auth_id, data_compra, tipo_transacao, qtde_parcela, periodo, parcela_atual, qtde_recorrencia, created_at, realizado, dividir_lancamento, imagem_url, data_vencimento, cartao_id, conta_id, categoria_id, pagador_id
  ) values (
    'vista', concat('Fatura de ', v_cartao_nome), 'pix', null, soma_valor, new.auth_id, current_date, 'despesa', null, new.periodo, null, null, now(), true, null, null, null, null, v_conta_id, categoria_pagamento_id, pagador_sistema_id
  );
  return new;
end;$$;

create or replace function public.handle_fatura_deletada() returns trigger
language plpgsql security definer set search_path to 'public' as $$
declare
  v_cartao_nome text;
  v_conta_id uuid;
  v_pagador_sistema_id uuid;
  v_categoria_pagamento_id uuid;
begin
  select p.id into v_pagador_sistema_id from public.pagadores p where p.auth_id = old.auth_id and p.role = 'sistema' limit 1;
  if v_pagador_sistema_id is null then return old; end if;
  select c.descricao, c.conta_id into v_cartao_nome, v_conta_id from public.cartoes c where c.id = old.cartao_id limit 1;
  if v_cartao_nome is null or v_conta_id is null then return old; end if;
  select c.id into v_categoria_pagamento_id from public.categorias c where c.nome = 'pagamentos' and c.auth_id = old.auth_id limit 1;
  if v_categoria_pagamento_id is not null then
    delete from public.lancamentos lt where lt.auth_id = old.auth_id and lt.periodo = old.periodo and lt.pagador_id = v_pagador_sistema_id and lt.descricao = concat('Fatura de ', v_cartao_nome) and lt.tipo_transacao = 'despesa' and lt.conta_id = v_conta_id and lt.cartao_id is null and lt.categoria_id = v_categoria_pagamento_id;
  else
    delete from public.lancamentos lt where lt.auth_id = old.auth_id and lt.periodo = old.periodo and lt.pagador_id = v_pagador_sistema_id and lt.descricao = concat('Fatura de ', v_cartao_nome) and lt.tipo_transacao = 'despesa' and lt.conta_id = v_conta_id and lt.cartao_id is null;
  end if;
  return old;
end;$$;

create or replace function public.get_faturas(month text) returns table(
  cartao_id uuid,
  descricao text,
  dt_vencimento text,
  logo_image text,
  status_pagamento text,
  total_valor numeric
) language plpgsql as $$
BEGIN
    RETURN QUERY
    WITH faturas_status AS (
        SELECT f.cartao_id, f.periodo, COALESCE(f.status_pagamento, 'pendente') AS status_pagamento
        FROM public.faturas f
        WHERE f.periodo = month
    ),
    lancamentos_mes AS (
        SELECT t.cartao_id, SUM(t.valor)::numeric AS valor_responsavel
        FROM public.lancamentos t
        WHERE t.periodo = month
        GROUP BY t.cartao_id
    ),
    total_por_cartao AS (
        SELECT tm.cartao_id, SUM(tm.valor_responsavel) AS total_valor
        FROM lancamentos_mes tm
        GROUP BY tm.cartao_id
    )
    SELECT c.id AS cartao_id, c.descricao, c.dt_vencimento, c.logo_image,
           COALESCE(fs.status_pagamento, 'pendente') AS status_pagamento,
           tpc.total_valor
    FROM total_por_cartao tpc
    JOIN public.cartoes c ON c.id = tpc.cartao_id
    LEFT JOIN faturas_status fs ON fs.cartao_id = tpc.cartao_id
    ORDER BY c.descricao;
END;$$;

create or replace function public.resumo_por_periodo(p_auth_id uuid, p_periodo text, p_role text default 'principal')
returns table(periodo text, receitas numeric, despesas numeric, balanco numeric, saldo_previsto numeric)
language sql stable as $$
with base as (
  select l.periodo,
    coalesce(sum(case when l.tipo_transacao = 'receita' then l.valor else 0 end), 0) as receitas,
    coalesce(sum(case when l.tipo_transacao = 'despesa' then l.valor else 0 end), 0) as despesas
  from public.lancamentos l
  where l.auth_id = p_auth_id
    and (
      p_role = 'todos' or l.pagador_id = (
        select p.id from public.pagadores p
        where p.auth_id = p_auth_id
          and p.role = case when p_role = 'você' then 'principal' else p_role end
        limit 1
      )
    )
  group by l.periodo
), ordenado as (
  select b.periodo,
    round(b.receitas,2) as receitas,
    round(b.despesas,2) as despesas,
    round(b.receitas - b.despesas,2) as balanco,
    to_date(case
        when b.periodo like 'janeiro-%' then '01-' || right(b.periodo,4)
        when b.periodo like 'fevereiro-%' then '02-' || right(b.periodo,4)
        when b.periodo like 'março-%' then '03-' || right(b.periodo,4)
        when b.periodo like 'abril-%' then '04-' || right(b.periodo,4)
        when b.periodo like 'maio-%' then '05-' || right(b.periodo,4)
        when b.periodo like 'junho-%' then '06-' || right(b.periodo,4)
        when b.periodo like 'julho-%' then '07-' || right(b.periodo,4)
        when b.periodo like 'agosto-%' then '08-' || right(b.periodo,4)
        when b.periodo like 'setembro-%' then '09-' || right(b.periodo,4)
        when b.periodo like 'outubro-%' then '10-' || right(b.periodo,4)
        when b.periodo like 'novembro-%' then '11-' || right(b.periodo,4)
        when b.periodo like 'dezembro-%' then '12-' || right(b.periodo,4)
      end,'MM-YYYY') as periodo_data
  from base b
), acum as (
  select o.periodo, o.receitas, o.despesas, o.balanco,
    round(sum(o.balanco) over (order by o.periodo_data),2) as saldo_previsto
  from ordenado o
)
select * from acum where periodo = p_periodo;
$$;

-- (Opcional) criar triggers que não estavam listadas (adapte se já existirem)
-- Exemplo: atualizar updated_at em profiles
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
for each row execute function public.update_updated_at_column();

