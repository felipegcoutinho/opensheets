set search_path to public, extensions;

-- RLS Policies (estado atual)
-- profiles
create policy if not exists "Users can delete their own profile" on public.profiles for delete using (auth.uid() = id);
create policy if not exists "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy if not exists "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
create policy if not exists "Users can view their own profile" on public.profiles for select using (auth.uid() = id);

-- contas
create policy if not exists "Users can delete only their own records" on public.contas for delete using (auth_id = auth.uid());
create policy if not exists "Users can insert their own records" on public.contas for insert with check (auth_id = auth.uid());
create policy if not exists "Users can update only their own records" on public.contas for update using (auth_id = auth.uid()) with check (auth_id = auth.uid());
create policy if not exists "Users can view only their own records" on public.contas for select using (auth_id = auth.uid());

-- cartoes (ação completa)
create policy if not exists "Enable all action based on user_id" on public.cartoes using ((auth.uid() = auth_id)) with check ((auth.uid() = auth_id));

-- anotacoes
create policy if not exists "Enable all action based on user_id" on public.anotacoes using ((auth.uid() = auth_id)) with check ((auth.uid() = auth_id));

-- categorias
create policy if not exists "Users can delete their own categorias" on public.categorias for delete using (auth.uid() = auth_id);
create policy if not exists "Users can insert their own categorias" on public.categorias for insert with check (auth.uid() = auth_id);
create policy if not exists "Users can update their own categorias" on public.categorias for update using (auth.uid() = auth_id);
create policy if not exists "Users can view their own categorias" on public.categorias for select using (auth.uid() = auth_id);

-- pagadores
create policy if not exists "Users can delete their own pagadores" on public.pagadores for delete using (auth.uid() = auth_id);
create policy if not exists "Users can insert their own pagadores" on public.pagadores for insert with check (auth.uid() = auth_id);
create policy if not exists "Users can update their own pagadores" on public.pagadores for update using (auth.uid() = auth_id);
create policy if not exists "Users can view their own pagadores" on public.pagadores for select using (auth.uid() = auth_id);

-- orcamentos
create policy if not exists "Users can delete their own orcamentos" on public.orcamentos for delete using (auth_id = auth.uid());
create policy if not exists "Users can insert their own orcamentos" on public.orcamentos for insert with check (auth_id = auth.uid());
create policy if not exists "Users can update their own orcamentos" on public.orcamentos for update using (auth_id = auth.uid()) with check (auth_id = auth.uid());
create policy if not exists "Users can view their own orcamentos" on public.orcamentos for select using (auth_id = auth.uid());

-- faturas
create policy if not exists "Users can delete their own faturas" on public.faturas for delete using (auth.uid() = auth_id);
create policy if not exists "Users can insert their own faturas" on public.faturas for insert with check (auth.uid() = auth_id);
create policy if not exists "Users can update their own faturas" on public.faturas for update using (auth.uid() = auth_id);
create policy if not exists "Users can view their own faturas" on public.faturas for select using (auth.uid() = auth_id);

-- lancamentos
create policy if not exists "Users can delete their own pagadores" on public.lancamentos for delete using (auth.uid() = auth_id);
create policy if not exists "Users can insert their own pagadores" on public.lancamentos for insert with check (auth.uid() = auth_id);
create policy if not exists "Users can update their own pagadores" on public.lancamentos for update using (auth.uid() = auth_id);
create policy if not exists "Users can view their own pagadores" on public.lancamentos for select using (auth.uid() = auth_id);
