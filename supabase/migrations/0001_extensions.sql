-- Extensões necessárias para o estado atual
-- Ajuste conforme o que deseja habilitar no self-hosted (nem todas abaixo são obrigatórias)
create extension if not exists "pgcrypto" with schema extensions; -- gen_random_uuid
create extension if not exists "uuid-ossp" with schema extensions; -- opcional
create extension if not exists "pgjwt" with schema extensions; -- JWT (se usado)
create extension if not exists "pg_net" with schema extensions; -- http assíncrono (se usado futuramente)
create extension if not exists "pg_graphql"; -- GraphQL
create extension if not exists "pgsodium"; -- criptografia (se precisar)
-- Demais extensões instaladas no projeto original podem ser adicionadas conforme necessidade
