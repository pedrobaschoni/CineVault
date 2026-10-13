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

## Rotas

| Rota | O que é | Estado |
| --- | --- | --- |
| `/` | Landing para visitantes, com os pôsteres em alta | Pronta |
| `/inicio` | Destaque da semana, em alta, mais vistos hoje | Pronta (continuar e diário ainda são exemplo, Fase 3) |
| `/explorar` | Listas do cofre, cinema, catálogo com filtros e "Carregar mais" | Pronta |
| `/explorar?q=…` | Resultados completos da busca | Pronta |
| `/explorar?lista=…` | Uma lista do cofre (atalho de filtros) | Pronta |
| `/explorar/surpresa` | Sorteia um título bem avaliado e abre a página dele | Pronta |
| `/titulo/[tipo]/[id]-[slug]` | Página do título; séries têm temporadas e episódios | Pronta |
| `/pessoa/[id]-[slug]` | Biografia, "conhecido por" e filmografia | Pronta |
| `/api/busca`, `/api/catalogo` | Sugestões da busca e próximas páginas do Explorar | Pronta |
| `/sobre` | História e propósito do site | Pronta |
| `/entrar`, `/criar-conta` | Login e cadastro | Visual pronto, sem autenticação (Fase 3) |
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
  services/catalog/
    index.ts              o que as páginas usam: getTitle, discover, search…
    tmdb.ts               cliente HTTP do TMDB (só servidor)
    mappers.ts            resposta do TMDB → tipos do site; regra de filme/série/anime/dorama
    taxonomy.ts           gêneros, países, streamings, ordenações, listas do cofre
    demo.ts               "TMDB de mentira" do modo demonstração
    raw.ts, errors.ts     formato da API e erros
  components/
    ui/                   Button, Chip, Tag, Rating, ScoreDial, VaultLoader, Toast…
    media/                Poster, PosterCard, VaultHero, TrailerButton, WhereToWatch, TitleActions…
    layout/               Header, MainNav, SearchField, UserMenu, Footer, DemoBanner
  lib/                    media (links, imagens, datas), format, navigation, sample
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

Opiniões, diário, episódios vistos e as listas "Quero ver" e "Favoritos" ficam **no navegador** (localStorage) por enquanto, em `src/services/user`. As telas só usam as funções e hooks desse arquivo; quando houver backend e login, só ele muda.

- **Sua opinião** (página do título): nota de 0,5 a 5, texto, aviso de spoiler, data e "já tinha visto". Cada vez que assiste vira uma sessão no diário; dá para editar e excluir.
- **Episódios**: marcar como visto e dar nota e opinião a cada um. O Início mostra "Continue de onde parou" a partir disso.

## Animações

Uma assinatura, não efeitos espalhados:

- **Abertura do cofre** (`VaultHero`): na página do título e no destaque do Início, o fundo se abre em íris a partir do pôster, com um aro de latão que se expande e anéis de mostrador gravados. O título sobe de uma "fresta".
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
3. **Dados do usuário** — em andamento: opiniões, diário, episódios e listas já salvam no navegador; faltam as páginas de listas e perfil, e o login.
4. **Experiência** — progresso de episódios, estatísticas, comunidade.
5. **Diferenciais** — Cofre do ano, compatibilidade com amigos, importação.
