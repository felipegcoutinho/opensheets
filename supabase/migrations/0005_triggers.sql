-- Triggers existentes replicadas
set search_path to public, extensions;

-- auth.users (precisa rodar em search_path apropriado)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- profiles
drop trigger if exists on_profile_deleted on public.profiles;
create trigger on_profile_deleted after delete on public.profiles
for each row execute function public.delete_user_from_auth();

-- faturas: quando criada paga -> marcar transações realizadas e criar lançamento pagamento
drop trigger if exists after_fatura_pago on public.faturas;
create trigger after_fatura_pago after insert on public.faturas
for each row when (new.status_pagamento = 'pago') execute function public.handle_fatura_pago();

drop trigger if exists trigger_atualizar_transacoes on public.faturas;
create trigger trigger_atualizar_transacoes after insert on public.faturas
for each row when (new.status_pagamento = 'pago') execute function public.atualizar_transacoes_como_realizadas();

-- faturas deletada: reverter transações e remover lançamento pagamento
drop trigger if exists after_fatura_delete on public.faturas;
create trigger after_fatura_delete after delete on public.faturas
for each row execute function public.handle_fatura_deletada();

drop trigger if exists trigger_reverter_transacoes on public.faturas;
create trigger trigger_reverter_transacoes after delete on public.faturas
for each row when (old.status_pagamento = 'pago') execute function public.reverter_transacoes_para_nao_realizadas();
