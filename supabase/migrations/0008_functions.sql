-- Functions (public)
CREATE OR REPLACE FUNCTION public.atualizar_transacoes_como_realizadas()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$BEGIN
  UPDATE public.lancamentos
  SET realizado = TRUE
  WHERE cartao_id = NEW.cartao_id
    AND periodo = NEW.periodo
    AND auth_id = NEW.auth_id;

  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.delete_user_from_auth()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_faturas(month text)
 RETURNS TABLE(cartao_id uuid, descricao text, dt_vencimento text, logo_image text, status_pagamento text, total_valor numeric)
 LANGUAGE plpgsql
SET search_path TO ''
AS $function$BEGIN
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
    lancamentos_mes AS (
        SELECT
            t.cartao_id,
            SUM(t.valor)::numeric AS valor_responsavel
        FROM
            public.lancamentos t
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
            lancamentos_mes tm
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_fatura_deletada()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_cartao_nome               text;
  v_conta_id                  uuid;
  v_pagador_sistema_id        uuid;
  v_categoria_pagamento_id    uuid;
begin
  -- 1) Pagador 'sistema'
  select p.id
    into v_pagador_sistema_id
  from public.pagadores p
  where p.auth_id = old.auth_id
    and p.role = 'sistema'
  limit 1;

  if v_pagador_sistema_id is null then
    -- Sem pagador 'sistema' não há o que deletar com segurança
    return old;
  end if;

  -- 2) Dados do cartão que originou a fatura (nome e conta)
  select c.descricao, c.conta_id
    into v_cartao_nome, v_conta_id
  from public.cartoes c
  where c.id = old.cartao_id
  limit 1;

  if v_cartao_nome is null or v_conta_id is null then
    -- Cartão não encontrado: evita remoções erradas
    return old;
  end if;

  -- 3) Categoria "pagamentos" do usuário (opcional, se existir)
  select c.id
    into v_categoria_pagamento_id
  from public.categorias c
  where c.nome = 'pagamentos'
    and c.auth_id = old.auth_id
  limit 1;

  -- 4) Deleção da fatura correspondente
  if v_categoria_pagamento_id is not null then
    delete from public.lancamentos lt
     where lt.auth_id      = old.auth_id
       and lt.periodo      = old.periodo
       and lt.pagador_id   = v_pagador_sistema_id
       and lt.descricao    = concat('Fatura de ', v_cartao_nome)
       and lt.tipo_transacao = 'despesa'
       and lt.conta_id     = v_conta_id
       and lt.cartao_id    is null
       and lt.categoria_id = v_categoria_pagamento_id;
  else
    -- Se a categoria não existir, ainda assim tentamos apagar pela assinatura forte
    delete from public.lancamentos lt
     where lt.auth_id      = old.auth_id
       and lt.periodo      = old.periodo
       and lt.pagador_id   = v_pagador_sistema_id
       and lt.descricao    = concat('Fatura de ', v_cartao_nome)
       and lt.tipo_transacao = 'despesa'
       and lt.conta_id     = v_conta_id
       and lt.cartao_id    is null;
  end if;

  return old;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_fatura_pago()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  categoria_pagamento_id uuid;
  soma_valor numeric;
  pagador_principal_id uuid;
  pagador_sistema_id uuid;
  v_conta_id uuid;
  v_cartao_nome text;
begin
  -- 1) Categoria "pagamentos" do usuário
  select c.id
    into categoria_pagamento_id
  from public.categorias c
  where c.nome = 'pagamentos'
    and c.auth_id = new.auth_id
  limit 1;

  if categoria_pagamento_id is null then
    raise exception 'Categoria "pagamentos" não encontrada para o usuário %.', new.auth_id;
  end if;

  -- 2) Pagador principal (equivale ao "você") e pagador do sistema
  select p.id
    into pagador_principal_id
  from public.pagadores p
  where p.auth_id = new.auth_id
    and p.role = 'principal'
  limit 1;

  if pagador_principal_id is null then
    raise exception 'Pagador com role "principal" não encontrado para o usuário %.', new.auth_id;
  end if;

  select p.id
    into pagador_sistema_id
  from public.pagadores p
  where p.auth_id = new.auth_id
    and p.role = 'sistema'
  limit 1;

  if pagador_sistema_id is null then
    raise exception 'Pagador com role "sistema" não encontrado para o usuário %.', new.auth_id;
  end if;

  -- 3) Dados do cartão (conta e nome para descrição)
  select c.conta_id, c.descricao
    into v_conta_id, v_cartao_nome
  from public.cartoes c
  where c.id = new.cartao_id
  limit 1;

  if v_conta_id is null then
    raise exception 'Cartão % não encontrado ou sem conta vinculada.', new.cartao_id;
  end if;

  -- 4) Soma do período no cartão para o pagador "principal"
  select coalesce(sum(l.valor), 0)
    into soma_valor
  from public.lancamentos l
  where l.cartao_id = new.cartao_id
    and l.periodo   = new.periodo
    and l.auth_id   = new.auth_id
    and l.pagador_id = pagador_principal_id;

  -- 5) Insere o lançamento da fatura como despesa (pagador = "sistema")
  insert into public.lancamentos (
    condicao,
    descricao,
    forma_pagamento,
    anotacao,
    valor,
    auth_id,
    data_compra,
    tipo_transacao,
    qtde_parcela,
    periodo,
    parcela_atual,
    qtde_recorrencia,
    created_at,
    realizado,
    dividir_lancamento,
    imagem_url,
    data_vencimento,
    cartao_id,
    conta_id,
    categoria_id,
    pagador_id
  )
  values (
    'vista',
    concat('Fatura de ', v_cartao_nome),
    'pix',
    null,
    soma_valor,
    new.auth_id,
    current_date,
    'despesa',
    null,
    new.periodo,
    null,
    null,
    now(),
    true,
    null,
    null,
    null,
    null,              -- cartao_id NULL: pagamento, não compra no cartão
    v_conta_id,
    categoria_pagamento_id,
    pagador_sistema_id
  );

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  )
  on conflict (id) do nothing;

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


  -- 3) Pagadores
  insert into public.pagadores (nome, email, role, status, foto, anotacao, is_hidden, is_auto_send, auth_id)
  values
    (new.raw_user_meta_data ->> 'first_name', new.email, 'principal', 'ativo', 'undraw_finance-guy-avatar_vhop.svg', null, false, false, new.id),
    ('Sistema', null, 'sistema', 'ativo', 'undraw_finance-guy-avatar_vhop.svg', null, true, false, new.id);

  -- 4) Conta padrão
  INSERT INTO public.contas (descricao, tipo_conta, logo_image, anotacao, status, is_ignored, auth_id)
  SELECT 'Conta padrão', 'corrente', 'padrao_os.png', 'Esta conta foi criada automaticamente', 'ativo', false, new.id
  WHERE NOT EXISTS (
      SELECT 1 FROM public.contas WHERE auth_id = new.id AND descricao = 'Conta padrão'
  );

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.resumo_por_periodo(p_auth_id uuid, p_periodo text, p_role text DEFAULT 'principal')
 RETURNS TABLE(periodo text, receitas numeric, despesas numeric, balanco numeric, saldo_previsto numeric)
 LANGUAGE sql
 STABLE
  SET search_path TO ''
AS $function$with base as (
  select
    l.periodo,
    coalesce(sum(case when l.tipo_transacao = 'receita' then l.valor else 0 end), 0) as receitas,
    coalesce(sum(case when l.tipo_transacao = 'despesa' then l.valor else 0 end), 0) as despesas
  from public.lancamentos l
  where l.auth_id = p_auth_id
    and (
      p_role = 'todos'
      or l.pagador_id = (
        select p.id
        from public.pagadores p
        where p.auth_id = p_auth_id
          and p.role = case when p_role = 'você' then 'principal' else p_role end
        limit 1
      )
    )
  group by l.periodo
),
ordenado as (
  select
    b.periodo,
    round(b.receitas, 2) as receitas,
    round(b.despesas, 2) as despesas,
    round(b.receitas - b.despesas, 2) as balanco,
    to_date(
      case
        when b.periodo like 'janeiro-%'   then '01-' || right(b.periodo, 4)
        when b.periodo like 'fevereiro-%' then '02-' || right(b.periodo, 4)
        when b.periodo like 'março-%'     then '03-' || right(b.periodo, 4)
        when b.periodo like 'abril-%'     then '04-' || right(b.periodo, 4)
        when b.periodo like 'maio-%'      then '05-' || right(b.periodo, 4)
        when b.periodo like 'junho-%'     then '06-' || right(b.periodo, 4)
        when b.periodo like 'julho-%'     then '07-' || right(b.periodo, 4)
        when b.periodo like 'agosto-%'    then '08-' || right(b.periodo, 4)
        when b.periodo like 'setembro-%'  then '09-' || right(b.periodo, 4)
        when b.periodo like 'outubro-%'   then '10-' || right(b.periodo, 4)
        when b.periodo like 'novembro-%'  then '11-' || right(b.periodo, 4)
        when b.periodo like 'dezembro-%'  then '12-' || right(b.periodo, 4)
      end,
      'MM-YYYY'
    ) as periodo_data
  from base b
),
acum as (
  select
    o.periodo,
    o.receitas,
    o.despesas,
    o.balanco,
    round(sum(o.balanco) over (order by o.periodo_data), 2) as saldo_previsto
  from ordenado o
)
select *
from acum
where periodo = p_periodo;$function$
;

CREATE OR REPLACE FUNCTION public.reverter_transacoes_para_nao_realizadas()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$BEGIN
  UPDATE public.lancamentos
  SET realizado = FALSE
  WHERE cartao_id = OLD.cartao_id
    AND periodo = OLD.periodo
    AND auth_id = OLD.auth_id;

  RETURN OLD;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;
