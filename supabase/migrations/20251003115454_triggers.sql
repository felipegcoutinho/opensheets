-- Triggers (public)
CREATE TRIGGER after_fatura_delete AFTER DELETE ON faturas FOR EACH ROW EXECUTE FUNCTION handle_fatura_deletada();
CREATE TRIGGER after_fatura_pago AFTER INSERT ON faturas FOR EACH ROW WHEN (new.status_pagamento = 'pago'::text) EXECUTE FUNCTION handle_fatura_pago();
CREATE TRIGGER trigger_atualizar_transacoes AFTER INSERT ON faturas FOR EACH ROW WHEN (new.status_pagamento = 'pago'::text) EXECUTE FUNCTION atualizar_transacoes_como_realizadas();
CREATE TRIGGER trigger_reverter_transacoes AFTER DELETE ON faturas FOR EACH ROW WHEN (old.status_pagamento = 'pago'::text) EXECUTE FUNCTION reverter_transacoes_para_nao_realizadas();
CREATE TRIGGER on_profile_deleted AFTER DELETE ON profiles FOR EACH ROW EXECUTE FUNCTION delete_user_from_auth();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
CREATE TRIGGER trg_orcamento_regra_502030_updated_at BEFORE UPDATE ON public.orcamento_regra_502030 FOR EACH ROW EXECUTE FUNCTION public.trg_orcamento_regra_502030_updated_at();
