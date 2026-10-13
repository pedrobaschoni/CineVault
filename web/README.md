# CineVault — frontend

Frontend do CineVault, com a identidade "cofre, não streaming".
Substitui o `frontend-2/` (Next antigo), que será removido quando este estiver completo.

## Rodando

Requer Node 20.9 ou mais novo.

```bash
cd web
npm install
cp .env.example .env.local   # e cole seu token do TMDB (veja abaixo)
npm run dev                  # http://localhost:3000
npm run build                # build de produção
npm run typecheck            # checagem de tipos
```

### Token do TMDB

O catálogo vem da API do [TMDB](https://www.themoviedb.org).

1. Crie uma conta gratuita no TMDB.
2. Em **Configurações › API**, peça uma chave (uso pessoal/educacional).
3. Copie o **Token de leitura da API** (o texto longo que começa com `eyJ`) para `TMDB_API_TOKEN` no `.env.local`.
4. Reinicie o `npm run dev`.

O token só é usado no servidor e nunca chega ao navegador. O `.env.local` já está no `.gitignore`.

**Sem token, o site roda em modo demonstração**: uma faixa no topo avisa, e o catálogo usa cerca de 40 títulos de exemplo (`src/services/catalog/demo.ts`) no mesmo formato da API real, sem imagens.

### Login com o Google e dados na nuvem (Supabase, opcional)

Sem isso, o site funciona normalmente sem login, com o diário salvo no navegador. Com isso, aparece o **Continuar com o Google** (e o login por e-mail), e o diário, as opiniões, os episódios e as listas ficam na conta, em qualquer aparelho. Leva uns 15 minutos, tudo no plano gratuito.

**1. Projeto no Supabase**

1. Crie uma conta em [supabase.com](https://supabase.com) e um projeto novo (região **South America (São Paulo)**). Guarde a senha do banco num lugar seguro.
2. Abra **SQL Editor › New query**, cole todo o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**. Isso cria as tabelas e as regras de segurança (cada pessoa só vê os próprios dados).
3. Em **Project Settings › API Keys**, copie a **Publishable key** (`sb_publishable_…`). Em **Project Settings › Data API** (ou no botão **Connect**), copie a **Project URL**. Cole as duas no `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

   Projetos antigos mostram a **anon key** (começa com `eyJ`); ela também funciona, em `NEXT_PUBLIC_SUPABASE_ANON_KEY`. **Nunca** use a chave `secret` / `service_role` no site.

4. Em **Authentication › URL Configuration**, coloque `http://localhost:3000` em **Site URL** e adicione `http://localhost:3000/**` em **Redirect URLs**. Quando publicar o site, adicione também o endereço dele (ex.: `https://cinevault.vercel.app/**`).

**2. Credenciais do Google**

1. No Supabase, abra **Authentication › Sign In / Providers › Google** e copie a **Callback URL** (algo como `https://xxxxxxxx.supabase.co/auth/v1/callback`). Deixe essa aba aberta.
2. No [Google Cloud Console](https://console.cloud.google.com), crie um projeto (ex.: "CineVault").
3. Vá em **Google Auth Platform › Branding** e preencha o nome do app (CineVault) e o seu e-mail de suporte.
4. Em **Audience**, escolha **External**. Enquanto o app estiver "Em teste", só os e-mails que você adicionar em **Test users** conseguem entrar; adicione o seu.
5. Em **Clients › Create client**, escolha **Web application** e preencha:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: a Callback URL copiada do Supabase
6. Copie o **Client ID** e o **Client secret**.

**3. Ligar o Google no Supabase**

1. De volta em **Authentication › Sign In / Providers › Google**, ative, cole o Client ID e o Client secret e salve.
2. Reinicie o `npm run dev` e abra `/entrar`.

O **Client secret fica só no painel do Supabase**: ele nunca vai para o `.env.local` nem para o repositório.

> **Login por e-mail:** por padrão o Supabase pede confirmação por e-mail, e o servidor de e-mail gratuito dele envia poucas mensagens por hora. Para testar sem esperar, desligue **Confirm email** em **Authentication › Sign In / Providers › Email**.

## Rotas

| Rota | O que é | Estado |
| --- | --- | --- |
| `/` | Landing para visitantes, com os pôsteres em alta | Pronta |
| `/inicio` | Destaques da semana (carrossel), continue de onde parou, em alta, seu diário, mais vistos hoje | Pronta |
| `/explorar` | Listas do cofre, cinema, catálogo com filtros e "Carregar mais" | Pronta |
| `/explorar?q=…` | Resultados completos da busca | Pronta |
| `/explorar?lista=…` | Uma lista do cofre (atalho de filtros) | Pronta |
| `/explorar/surpresa` | Sorteia um título bem avaliado e abre a página dele | Pronta |
| `/titulo/[tipo]/[id]-[slug]` | Página do título; séries têm temporadas e episódios | Pronta |
| `/pessoa/[id]-[slug]` | Biografia, "conhecido por" e filmografia | Pronta |
| `/api/busca`, `/api/catalogo` | Sugestões da busca e próximas páginas do Explorar | Pronta |
| `/sobre` | História e propósito do site | Pronta |
| `/entrar`, `/criar-conta` | Login com o Google ou e-mail (Supabase) | Pronta |
| `/auth/callback` | Volta do Google e dos links de e-mail; cria a sessão | Pronta |
| `/diario` | Tudo o que você registrou, por mês, com opiniões | Pronta (dados no navegador) |
| `/listas`, `/perfil`, `/configuracoes`, `/comunidade` | Seções do usuário | Fase 3 em diante |
| `/design` | Vitrine dos componentes (fora do menu) | Referência interna |

Os endereços dos títulos e pessoas se corrigem sozinhos: `/titulo/filme/693134` leva a `/titulo/filme/693134-duna-parte-dois`, e um anime aberto como "série" vai para `/titulo/anime/…`.

## Estrutura

```
src/
  app/
    page.tsx              landing
    (auth)/               entrar, criar-conta
    (site)/               páginas com cabeçalho e rodapé (+ error.tsx e loading.tsx)
    api/                  busca, catalogo
  proxy.ts                renova a sessão do Supabase a cada navegação
  lib/supabase/           config, cliente do navegador e do servidor
  services/user/
    index.ts              dados do usuário: hooks, gravação, conta (local ou nuvem)
    cloud.ts              tabelas do Supabase ↔ tipos do site
  services/catalog/
    index.ts              o que as páginas usam: getTitle, discover, search…
    tmdb.ts               cliente HTTP do TMDB (só servidor)
    mappers.ts            resposta do TMDB → tipos do site; regra de filme/série/anime/dorama
    taxonomy.ts           gêneros, países, streamings, ordenações, listas do cofre
    demo.ts               "TMDB de mentira" do modo demonstração
    raw.ts, errors.ts     formato da API e erros
  components/
    ui/                   Button, Chip, Tag, Rating, ScoreDial, VaultLoader, Toast…
    media/                Poster, PosterCard, VaultHero, Highlights, TrailerButton, WhereToWatch, TitleActions…
    layout/               Header, MainNav, SearchField, UserMenu, Footer, DemoBanner, SyncNotice
    auth/                 AuthPanel, GoogleButton, CloudHint
  lib/                    media (links, imagens, datas), format, navigation, supabase
supabase/schema.sql       tabelas e regras de segurança (rodar no SQL Editor)
  styles/                 tokens.css, globals.css
  types/                  tipos de domínio
```

### Como o site classifica os títulos

O TMDB só conhece "filme" e "programa de TV". O CineVault divide em quatro (`classify` em `mappers.ts`):

- **Filme**: todo filme.
- **Anime**: série animada japonesa.
- **Dorama**: série com atores da Coreia, Japão, China, Taiwan ou Tailândia.
- **Série**: o resto.

## Dados do usuário

Opiniões, diário, episódios vistos e as listas "Quero ver" e "Favoritos" ficam em `src/services/user`. As telas só usam as funções e hooks desse arquivo, que funciona de dois jeitos:

- **Sem login** (ou sem Supabase configurado): tudo no navegador (localStorage).
- **Com login**: tudo nas tabelas do Supabase. A tela muda na hora e a gravação na nuvem vem logo depois; se falhar, os dados são recarregados da conta e um aviso aparece.
- **Ao entrar pela primeira vez**, se já havia algo salvo no navegador, um aviso oferece levar esses registros para a conta.

- **Sua opinião** (página do título): nota de 0,5 a 5, texto, aviso de spoiler, data e "já tinha visto". Cada vez que assiste vira uma sessão no diário; dá para editar e excluir.
- **Episódios**: marcar como visto e dar nota e opinião a cada um. O Início mostra "Continue de onde parou" a partir disso.

## Animações

Uma assinatura, não efeitos espalhados:

- **Abertura do cofre** (`VaultHero`): na página do título, o fundo se abre em íris a partir do pôster, com um aro de latão que se expande e anéis de mostrador gravados. O título sobe de uma "fresta".
- **Destaques da semana** (`Highlights`): os cinco mais vistos giram como as posições de um cofre. O ponteiro do mostrador gira até o destaque atual e o aro se preenche como um relógio; o fundo troca só por opacidade, para ficar leve. Pausa com o mouse em cima, com o foco do teclado, com a aba escondida ou no botão de pausa; com "reduzir movimento", não gira sozinho.
- **Mostrador da nota** (`ScoreDial animated`): gira em cliques até a nota, como a combinação de um cofre.
- **Carregamento** (`VaultLoader`): a roda gira para um lado e para o outro.
- **Respostas a ações**: o trailer abre em íris a partir do botão clicado; a busca abre como gaveta; o leque das listas abre ao passar o mouse.

Tudo é CSS e respeita "reduzir movimento" do sistema (a página aparece pronta).

## Convenções

- **Todo estilo de componente fica num `.module.css` ao lado dele.** O `globals.css` só tem reset, base, a textura de película e os utilitários `.container`, `.visually-hidden` e `.skip-link`.
- **Nenhuma cor, fonte ou espaçamento solto.** Use as variáveis de `tokens.css`.
- **Latão é o único destaque.** Brasa só para "em alta" e avisos.
- **Páginas não chamam o TMDB.** Elas usam `@/services/catalog`; a Fase 3 segue o mesmo padrão para os dados do usuário.
- **Notas:** a do usuário vai de 0,5 a 5; a do público vai de 0 a 10. Sempre com vírgula (`formatRating`).
- **Dependências com versão fixa** no `package.json`.

## Fases

1. **Fundação e identidade** — feita.
2. **Catálogo real** — feita: TMDB, título, pessoa, Explorar, busca.
3. **Dados do usuário** — em andamento: opiniões, diário, episódios e listas, login com o Google e sincronização na nuvem (Supabase) prontos; faltam as páginas de listas e perfil.
4. **Experiência** — progresso de episódios, estatísticas, comunidade.
5. **Diferenciais** — Cofre do ano, compatibilidade com amigos, importação.
