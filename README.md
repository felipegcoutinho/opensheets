# OpenSheets: Seu Gerenciador Financeiro Open Source

O OpenSheets é uma aplicação web moderna e de código aberto, construída para ajudar você a ter um controle claro e objetivo sobre suas finanças pessoais. Com uma interface intuitiva e poderosa, o projeto visa substituir planilhas complexas por uma experiência de usuário fluida e centralizada.

## ✨ Principais Funcionalidades

A estrutura do projeto indica o desenvolvimento das seguintes funcionalidades:

- **Dashboard Intuitivo:** Uma visão geral e consolidada da sua saúde financeira.
- **Gerenciamento de Transações:** Adicione, edite e categorize suas despesas e receitas (`lancamentos`).
- **Controle de Contas e Cartões:** Gerencie múltiplas contas bancárias e cartões de crédito.
- **Orçamentos:** Crie e acompanhe orçamentos mensais para diferentes categorias.
- **Categorização Inteligente:** Organize suas finanças com categorias personalizáveis.
- **Calendário Financeiro:** Visualize seus pagamentos e recebimentos futuros.
- **Insights e Análises:** Obtenha relatórios sobre seus padrões de consumo.
- **Autenticação Segura:** Gerenciamento de usuários com login, cadastro e recuperação de senha.
- **Modo Claro e Escuro:** Interface adaptável à sua preferência visual.

## 🚀 Tecnologias Utilizadas

O OpenSheets é construído com um stack de tecnologias moderno e escalável:

- **Framework:** [Next.js](https://nextjs.org/) (com App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Backend e Banco de Dados:** [Supabase](https://supabase.com/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/)
- **Gerenciador de Pacotes:** [pnpm](https://pnpm.io/)

## 🏁 Como Começar

Para executar o projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/opensheets.git
    cd opensheets
    ```

2.  **Instale as dependências:**

    ```bash
    pnpm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env.local` na raiz do projeto e adicione suas chaves do Supabase:
    `env
NEXT_PUBLIC_SUPABASE_URL=URL_DO_SEU_PROJETO_SUPABASE
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICA
OPENROUTER_API_KEY=SUA_CHAVE_OPENROUTER
OPENROUTER_MODEL=SEU_MODELO_OPENROUTER
RESEND_API_KEY=
` Você pode obter essas informações no painel do Supabase, na seção "Configurações" do seu projeto.

4.  **Execute o servidor de desenvolvimento:**

    ```bash
    pnpm run dev
    ```

    Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## 📂 Estrutura de Pastas

A organização do projeto segue as convenções do Next.js App Router:

- `app/`: Contém todas as rotas, páginas e layouts da aplicação.
- `components/`: Componentes React reutilizáveis (UI, widgets, etc.).
- `hooks/`: Hooks React customizados para lógicas específicas.
- `lib/`: Funções utilitárias e configurações.
- `actions/`: Server Actions do Next.js para interações com o backend.
- `supabase/`: Migrações e configurações do banco de dados Supabase.

## 🤝 Como Contribuir

Este é um projeto de código aberto e contribuições são bem-vindas! Sinta-se à vontade para abrir _issues_ ou enviar _pull requests_.

## 📄 Licença

Este projeto é licenciado sob a licença MIT.

# Configuração do Supabase

Este repositório mantém toda a estrutura do banco (tabelas, funções, policies, views etc.) dentro da pasta `supabase/migrations`. As etapas abaixo explicam como preparar o ambiente, autenticar o CLI, aplicar as migrações existentes e manter o projeto remoto sincronizado.

## 1. Instalação do Supabase CLI

O Supabase CLI é necessário para interagir com o projeto remoto. Instale a versão mais recente usando um dos métodos abaixo: Recomendo o Homebrew no macOS/Linux para facilidade de atualização.

Veja como instalar o homebrew: https://brew.sh/

````bash
# macOS/Linux (Homebrew)
brew install supabase/tap/supabase

Confirme se a instalação funcionou:

```bash
supabase --version
````

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
supabase link
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
