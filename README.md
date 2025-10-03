# OpenSheets: Gerenciador Financeiro Pessoal Open Source

O OpenSheets é uma aplicação web moderna e open source criada para oferecer um controle claro das finanças pessoais. A proposta é substituir planilhas complexas por uma experiência centralizada, com visual limpo e navegação simples.

## 🧭 Visão Geral

- **Dashboard intuitivo:** panorama consolidado da saúde financeira.
- **Lançamentos completos:** cadastro, edição e categorização de receitas e despesas.
- **Contas e cartões:** acompanhamento de múltiplas carteiras financeiras.
- **Orçamentos mensais:** metas por categoria para manter os gastos sob controle.
- **Categorização inteligente:** categorias personalizáveis para organizar informações.
- **Calendário financeiro:** previsão de pagamentos e recebimentos futuros.
- **Insights e análises:** relatórios para entender padrões de consumo.
- **Autenticação segura:** fluxo de login, cadastro e recuperação de senha.
- **Tema claro/escuro:** escolha a interface que melhor se adapta ao seu uso.

## 🛠️ Tecnologias Principais

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Banco de dados e backend:** [Supabase](https://supabase.com/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Biblioteca de componentes:** [shadcn/ui](https://ui.shadcn.com/)
- **Gerenciador de pacotes:** [pnpm](https://pnpm.io/)

## ✅ Pré-requisitos

- Node.js 18.17 ou superior
- pnpm 8+ configurado globalmente (`corepack enable` facilita a gestão)
- Conta no Supabase para provisionar banco de dados e APIs

## 🚀 Como Rodar Localmente

1. **Clone o repositório**

   ```bash
   git clone https://github.com/felipegcoutinho/opensheets.git
   cd opensheets
   ```

2. **Instale as dependências**

   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente**

   Crie um arquivo `.env.local` na raiz com as credenciais necessárias:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=URL_DO_SEU_PROJETO_SUPABASE
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICA
   OPENROUTER_API_KEY=SUA_CHAVE_OPENROUTER
   OPENROUTER_MODEL=SEU_MODELO_OPENROUTER
   RESEND_API_KEY=SUA_CHAVE_RESEND
   ```

   Consulte o painel do Supabase em **Settings → Project Settings → API** para obter URL e chave pública.

4. **Inicie o servidor de desenvolvimento**

   ```bash
   pnpm dev
   ```

   A aplicação fica disponível em [http://localhost:3000](http://localhost:3000).

## 📂 Estrutura de Pastas

- `app/` – rotas, layouts e páginas do App Router.
- `components/` – componentes React reutilizáveis.
- `hooks/` – hooks customizados.
- `lib/` – utilitários e integrações compartilhadas.
- `middleware.ts` – middleware Next.js para regras globais.
- `public/` – ativos estáticos.
- `supabase/` – migrações SQL e configurações da plataforma.
- `utils/` – funções auxiliares específicas do domínio.

## 🗃️ Fluxo de Trabalho com Supabase

Toda a definição de schema vive em `supabase/migrations`. Os passos abaixo ajudam a manter o ambiente consistente entre local e remoto.

### 1. Instale o Supabase CLI

Use o método recomendado para o seu sistema (Homebrew é sugerido em macOS/Linux):

```bash
brew install supabase/tap/supabase
supabase --version
```

### 2. Autentique-se

Gere um Access Token no painel do Supabase (Profile → Access Tokens) e faça login:

```bash
supabase login
```

### 3. Vincule o projeto local ao ambiente remoto

Liste os projetos para copiar o `reference id` e, na raiz do repositório, vincule:

```bash
supabase projects list
supabase link
```

### 4. Aplique migrações existentes

Faça um _dry run_ antes de executar alterações reais:

```bash
supabase db push --dry-run
supabase db push
```

### 5. Gere novas migrações

Registre mudanças de schema com descrições claras:

```bash
supabase db diff -f nome-da-migracao
```

Revise o SQL gerado, versione o arquivo e execute `supabase db push` quando estiver pronto.

### 6. Resetar o banco remoto (opcional)

Apaga dados e reaplica todas as migrações. Use com cautela:

```bash
supabase db reset --linked --yes
```

## 🤝 Como Contribuir

Contribuições são bem-vindas! Abra uma _issue_ para discutir novas ideias ou envie um _pull request_ com melhorias já discutidas.

## 📄 Licença

Este projeto é distribuído sob a licença MIT.
