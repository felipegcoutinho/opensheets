-- RLS Policies
-- anotacoes
CREATE POLICY "Users can delete their own anotacoes" ON public.anotacoes FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can insert their own anotacoes" ON public.anotacoes FOR INSERT TO authenticated WITH CHECK ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can update their own anotacoes" ON public.anotacoes FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can view their own anotacoes" ON public.anotacoes FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));

-- cartoes
CREATE POLICY "Users can delete their own cartoes" ON public.cartoes FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can insert their own cartoes" ON public.cartoes FOR INSERT TO authenticated WITH CHECK ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can update their own cartoes" ON public.cartoes FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can view their own cartoes" ON public.cartoes FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));

-- categorias
CREATE POLICY "Users can delete their own categorias" ON public.categorias FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can insert their own categorias" ON public.categorias FOR INSERT TO authenticated WITH CHECK ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can update their own categorias" ON public.categorias FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can view their own categorias" ON public.categorias FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));

-- contas
CREATE POLICY "Users can delete only their own records" ON public.contas FOR DELETE TO authenticated USING ((auth_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "Users can insert their own records" ON public.contas FOR INSERT TO authenticated WITH CHECK ((auth_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "Users can update only their own records" ON public.contas FOR UPDATE TO authenticated USING ((auth_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((auth_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "Users can view only their own records" ON public.contas FOR SELECT TO authenticated USING ((auth_id = ( SELECT auth.uid() AS uid)));

-- faturas
CREATE POLICY "Users can delete their own faturas" ON public.faturas FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can insert their own faturas" ON public.faturas FOR INSERT TO authenticated WITH CHECK ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can update their own faturas" ON public.faturas FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can view their own faturas" ON public.faturas FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));

-- lancamentos
CREATE POLICY "Users can delete their own pagadores" ON public.lancamentos FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can insert their own pagadores" ON public.lancamentos FOR INSERT TO authenticated WITH CHECK ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can update their own pagadores" ON public.lancamentos FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can view their own pagadores" ON public.lancamentos FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));

-- orcamentos
CREATE POLICY "Users can delete their own orcamentos" ON public.orcamentos FOR DELETE TO authenticated USING ((auth_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "Users can insert their own orcamentos" ON public.orcamentos FOR INSERT TO authenticated WITH CHECK ((auth_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "Users can update their own orcamentos" ON public.orcamentos FOR UPDATE TO authenticated USING ((auth_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((auth_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "Users can view their own orcamentos" ON public.orcamentos FOR SELECT TO authenticated USING ((auth_id = ( SELECT auth.uid() AS uid)));

-- orcamento_regra_502030
CREATE POLICY "Users can delete their own budget rule" ON public.orcamento_regra_502030 FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can insert their own budget rule" ON public.orcamento_regra_502030 FOR INSERT TO authenticated WITH CHECK ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can update their own budget rule" ON public.orcamento_regra_502030 FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id)) WITH CHECK ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can view their own budget rule" ON public.orcamento_regra_502030 FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));

-- pagadores
CREATE POLICY "Users can delete their own pagadores" ON public.pagadores FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can insert their own pagadores" ON public.pagadores FOR INSERT TO authenticated WITH CHECK ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can update their own pagadores" ON public.pagadores FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));
CREATE POLICY "Users can view their own pagadores" ON public.pagadores FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = auth_id));

-- profiles
CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) = id));
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((( SELECT auth.uid() AS uid) = id));
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = id));
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = id));

-- storage
CREATE POLICY "Enable users to view their own data only" ON storage.buckets FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = owner));
CREATE POLICY "Enable delete for users based on user_id" ON storage.objects FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) = owner));
CREATE POLICY "Enable insert for users based on user_id" ON storage.objects FOR INSERT TO public WITH CHECK ((( SELECT auth.uid() AS uid) = owner));
CREATE POLICY "Enable users to view their own data only" ON storage.objects FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = owner));
CREATE POLICY "Give users authenticated access to folder tpicvf_0" ON storage.objects FOR SELECT TO public USING (((bucket_id = 'comprovantes') AND ((storage.foldername(name))[1] = 'private') AND (auth.role() = 'authenticated')));
CREATE POLICY "Give users authenticated access to folder tpicvf_1" ON storage.objects FOR UPDATE TO public USING (((bucket_id = 'comprovantes') AND ((storage.foldername(name))[1] = 'private') AND (auth.role() = 'authenticated')));
CREATE POLICY "Give users authenticated access to folder tpicvf_2" ON storage.objects FOR INSERT TO public WITH CHECK (((bucket_id = 'comprovantes') AND ((storage.foldername(name))[1] = 'private') AND (auth.role() = 'authenticated')));
CREATE POLICY "Give users authenticated access to folder tpicvf_3" ON storage.objects FOR DELETE TO public USING (((bucket_id = 'comprovantes') AND ((storage.foldername(name))[1] = 'private') AND (auth.role() = 'authenticated')));
