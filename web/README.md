# CineVault — frontend

Frontend novo do CineVault, refeito do zero com a identidade "cofre, não streaming".
Substitui `frontend/` (Ionic) e `frontend-2/` (Next antigo), que serão removidos quando este estiver completo.

## Rodando

Requer Node 20.9 ou mais novo.

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm run typecheck  # checagem de tipos
```

## Rotas

| Rota | O que é | Estado |
| --- | --- | --- |
| `/` | Landing page para visitantes | Pronta |
| `/entrar`, `/criar-conta` | Login e cadastro | Visual pronto, sem autenticação (Fase 3) |
| `/inicio` | Início do usuário logado | Pronta com dados de exemplo (Fase 2 troca pelo TMDB) |
| `/sobre` | História e propósito do site | Pronta |
| `/titulo/[tipo]/[id]` | Página de um título (`tipo` = filme, serie, anime, dorama) | Fase 2 |
| `/explorar`, `/listas`, `/diario`, `/perfil`, `/configuracoes`, `/comunidade` | Seções do menu | Em construção |
| `/design` | Vitrine dos componentes (fora do menu) | Referência interna |

## Estrutura

```
src/
  app/
    page.tsx            landing
    (auth)/             entrar, criar-conta (layout com cartão central)
    (site)/             páginas com cabeçalho e rodapé
  components/
    ui/                 Button, Chip, Badge, Tag, Rating, RatingInput, ScoreDial,
                        ProgressBar, SectionHeader, ComingSoon, Logo, Icon
    media/              Poster, PosterCard, TicketStub
    layout/             Header, MainNav, SearchField, UserMenu, Footer
    auth/               DemoForm (provisório até a Fase 3)
  lib/                  navigation, format, cx, sample (dados de exemplo)
  styles/
    tokens.css          cores, fontes, espaçamentos, raios
    globals.css         reset e base
  types/                tipos de domínio
```

## Convenções

- **Todo estilo de componente fica num `.module.css` ao lado dele.** O `globals.css` só tem reset, base e os utilitários `.container`, `.visually-hidden` e `.skip-link`. Isso evita o vazamento de classes entre páginas que causava o bug do pôster no site antigo.
- **Nenhuma cor, fonte ou espaçamento solto.** Use as variáveis de `tokens.css` (`var(--color-accent)`, `var(--space-4)`...).
- **Latão é o único destaque.** Brasa só para "em alta" e avisos de spoiler.
- **Etiquetas de catálogo** (tipo, ano, temporada) usam o componente `Tag`, em fonte mono e caixa alta.
- **Notas:** a do usuário vai de 0,5 a 5 (`Rating`, `RatingInput`); a da comunidade vai de 0 a 10 (`ScoreDial`). Números sempre com vírgula (`formatRating`).
- **Fontes** vêm dos pacotes `@fontsource`, servidas pelo próprio site.
- **Dependências com versão fixa** no `package.json`.

## Próximas fases

1. **Fundação e identidade** — este commit.
2. **Catálogo real** — serviço do TMDB, página do título, busca e Explorar. Precisa de `TMDB_API_TOKEN` no `.env.local` (veja `.env.example`).
3. **Dados do usuário** — notas, listas, diário e perfil salvos via camada de serviços.
4. **Experiência** — progresso de episódios, estatísticas, estados de carregamento e erro.
5. **Diferenciais** — Cofre do ano, compatibilidade com amigos, importação.
