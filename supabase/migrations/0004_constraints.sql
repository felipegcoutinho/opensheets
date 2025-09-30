-- Primary keys
ALTER TABLE public.anotacoes ADD CONSTRAINT anotacoes_pkey PRIMARY KEY (id);
ALTER TABLE public.cartoes ADD CONSTRAINT cartoes_pkey PRIMARY KEY (id);
ALTER TABLE public.categorias ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);
ALTER TABLE public.contas ADD CONSTRAINT contas_pkey PRIMARY KEY (id);
ALTER TABLE public.faturas ADD CONSTRAINT faturas_pkey PRIMARY KEY (id);
ALTER TABLE public.lancamentos ADD CONSTRAINT lancamentos_teste_pkey PRIMARY KEY (id);
ALTER TABLE public.orcamentos ADD CONSTRAINT orcamentos_pkey PRIMARY KEY (id);
ALTER TABLE public.pagadores ADD CONSTRAINT pagadores_pkey PRIMARY KEY (id);
ALTER TABLE public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

-- Foreign keys
ALTER TABLE public.anotacoes ADD CONSTRAINT anotacoes_auth_id_fkey FOREIGN KEY (auth_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.cartoes ADD CONSTRAINT cartoes_auth_id_fkey FOREIGN KEY (auth_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.cartoes ADD CONSTRAINT cartoes_conta_id_fkey FOREIGN KEY (conta_id) REFERENCES contas(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.categorias ADD CONSTRAINT categorias_auth_id_fkey FOREIGN KEY (auth_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.contas ADD CONSTRAINT contas_auth_id_fkey FOREIGN KEY (auth_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.faturas ADD CONSTRAINT faturas_auth_id_fkey FOREIGN KEY (auth_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.faturas ADD CONSTRAINT faturas_cartao_id_fkey FOREIGN KEY (cartao_id) REFERENCES cartoes(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.lancamentos ADD CONSTRAINT lancamentos_teste_auth_id_fkey FOREIGN KEY (auth_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.lancamentos ADD CONSTRAINT lancamentos_teste_cartao_id_fkey FOREIGN KEY (cartao_id) REFERENCES cartoes(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.lancamentos ADD CONSTRAINT lancamentos_teste_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.lancamentos ADD CONSTRAINT lancamentos_teste_conta_id_fkey FOREIGN KEY (conta_id) REFERENCES contas(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.lancamentos ADD CONSTRAINT lancamentos_teste_pagador_id_fkey FOREIGN KEY (pagador_id) REFERENCES pagadores(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.orcamentos ADD CONSTRAINT orcamentos_auth_id_fkey FOREIGN KEY (auth_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.orcamentos ADD CONSTRAINT orcamentos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.pagadores ADD CONSTRAINT pagadores_auth_id_fkey FOREIGN KEY (auth_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
