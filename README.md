# Configuração do Supabase

Este repositório mantém toda a estrutura do banco (tabelas, funções, policies, views etc.) dentro da pasta `supabase/migrations`. As etapas abaixo explicam como preparar o ambiente, autenticar o CLI, aplicar as migrações existentes e manter o projeto remoto sincronizado.

## 1. Instalação do Supabase CLI

O Supabase CLI é necessário para interagir com o projeto remoto. Instale a versão mais recente usando um dos métodos abaixo:

```bash
# macOS (Homebrew)
brew install supabase/tap/supabase

# macOS/Linux (npm)
npm install -g supabase

# macOS/Linux (curl) - verifica se há release mais recente na documentação
curl -fsSL https://supabase.io/install | sh
```

Confirme se a instalação funcionou:

```bash
supabase --version
```

## 2. Autenticação

Faça login com o access token gerado no painel (Profile → Access Tokens):

```bash
supabase login
```

O CLI salvará o token localmente e reutilizará em comandos futuros.

## 3. Vincular este repositório ao projeto remoto

Liste os projetos disponíveis para obter o `reference id` do ambiente que deseja utilizar:

```bash
supabase projects list
```

Ainda na raiz do repositório, vincule usando o `reference id` e a senha do banco (disponível em Settings → Database → Connection string no dashboard):

```bash
supabase link --project-ref <reference_id> --password <senha_do_db>
```

Esse comando cria `supabase/config.toml` e garante que todos os comandos abaixo rodem contra o projeto correto.

## 4. Aplicar migrações existentes

Com o projeto linkado, execute um dry run para conferir o que será enviado:

```bash
supabase db push --dry-run
```

Se estiver tudo certo, aplique as migrações no banco remoto:

```bash
supabase db push
```

## 5. Criar novas migrações

Sempre registre mudanças de esquema em um novo arquivo dentro de `supabase/migrations`. Você pode gerar o SQL automaticamente comparando o estado atual do banco com os arquivos versionados:

```bash
supabase db diff -f <nome_descritivo>
```

Edite o arquivo se necessário, versione no Git e repita o processo de `supabase db push`. Evite alterar migrações antigas que já foram aplicadas em produção ou em outros ambientes.

## 6. Resetar o banco remoto

Para zerar o schema público do banco vinculado e reaplicar todas as migrações (atenção: todos os dados serão perdidos):

```bash
supabase db reset --linked --yes
```

Use esse comando apenas em ambientes onde a perda de dados é aceitável (por exemplo staging) e confirme sempre que o projeto linkado está correto.

## 7. Dicas rápidas

- Antes de rodar qualquer comando destrutivo, valide o projeto vinculado com `supabase projects list` (coluna `LINKED`).
- Utilize `supabase db migrate status` para verificar quais migrações já foram aplicadas no ambiente remoto.
- Se precisar apenas revisar o SQL gerado, use `supabase db push --dry-run` ou abra os arquivos da pasta `supabase/migrations` diretamente.
- Como este fluxo não depende de Docker, todas as alterações são feitas via CLI diretamente no projeto remoto.

Seguindo esses passos, qualquer alteração estruturada no diretório `supabase/migrations` será refletida com segurança no Supabase.
