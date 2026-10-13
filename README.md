<p align="center">
  <img src="docs/readme/banner.png" alt="CineVault: seu cofre de tudo que você já assistiu" width="100%">
</p>

<p align="center">
  <b>Um diário pessoal de filmes, séries, animes e doramas.</b><br>
  Registre o que assistiu, dê sua nota, escreva o que achou e descubra o que ver a seguir, sem pular de app em app.
</p>

<p align="center">
  <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-0D0E12?style=for-the-badge&logo=nextdotjs&logoColor=EEE8DC">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-0D0E12?style=for-the-badge&logo=react&logoColor=D9A54A">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-0D0E12?style=for-the-badge&logo=typescript&logoColor=D9A54A">
  <img alt="TMDB API" src="https://img.shields.io/badge/Dados-TMDB-0D0E12?style=for-the-badge&logo=themoviedatabase&logoColor=D9A54A">
  <img alt="Em desenvolvimento" src="https://img.shields.io/badge/status-em%20desenvolvimento-D9A54A?style=for-the-badge">
</p>

<p align="center">
  <a href="#funcionalidades">Funcionalidades</a> ·
  <a href="#telas">Telas</a> ·
  <a href="#identidade">Identidade</a> ·
  <a href="#como-rodar">Como rodar</a> ·
  <a href="#roadmap">Roadmap</a>
</p>

---

## 🔐 A abertura do cofre

<p align="center">
  <img src="docs/readme/abertura-do-cofre.gif" alt="Animação: o fundo da página se abre em íris a partir do pôster, o mostrador gira até a nota e o título sobe" width="880">
</p>

Cada título abre como um cofre: o fundo se revela em íris a partir do pôster, um aro de latão se expande e o mostrador gira em cliques até a nota, como a combinação de um cofre. É a assinatura do CineVault: um único momento marcante, em vez de efeitos espalhados por todo canto.

<a id="funcionalidades"></a>

## ✨ O que dá para fazer

| Recurso | Como funciona |
| --- | --- |
| 📓 **Diário** | Registre cada vez que assistiu, com data, nota de 0,5 a 5 e se foi uma reassistida. Tudo organizado por mês. |
| ✍️ **Opiniões** | Escreva o que achou de um filme, de uma série ou de **cada episódio**. Marque como spoiler e o texto fica borrado até alguém pedir para ver. |
| 📺 **Episódios** | Marque o que já viu, acompanhe o progresso da temporada e volte de onde parou pelo Início. |
| 🧭 **Explorar** | Filtre por tipo, gênero, país, década, streaming e nota mínima. Os filtros ficam na URL, então dá para salvar e compartilhar. |
| 🎲 **Surpreenda-me** | Sorteia um título bem avaliado quando você não sabe o que ver. |
| 🗂️ **Listas do cofre** | Atalhos prontos, como plot twists, terror psicológico, animes para começar e séries para maratonar. |
| 🔎 **Busca** | Sugestões enquanto você digita, com títulos e pessoas, totalmente navegável pelo teclado. |
| 🎭 **Pessoas** | Biografia, "conhecido por" e filmografia de atores e diretores, filtrável por função. |
| 📍 **Onde assistir** | Em quais streamings o título está disponível no Brasil, por assinatura, aluguel ou compra. |
| ⭐ **Quero ver e favoritos** | Guarde o que quer assistir e o que mais marcou você. |

O CineVault separa o catálogo em **filmes**, **séries**, **animes** (séries animadas japonesas) e **doramas** (séries asiáticas com atores), em vez de juntar tudo como "programa de TV".

<a id="telas"></a>

## 🖼️ Telas

<table>
  <tr>
    <td width="50%"><img src="docs/readme/inicio.jpg" alt="Início com o destaque da semana"><br><sub><b>Início</b>: o mais visto da semana, o que está em alta e o seu diário.</sub></td>
    <td width="50%"><img src="docs/readme/titulo.jpg" alt="Página de uma série"><br><sub><b>Título</b>: nota do público, onde assistir, elenco e temporadas.</sub></td>
  </tr>
  <tr>
    <td><img src="docs/readme/opiniao.jpg" alt="Sua opinião e episódios avaliados"><br><sub><b>Sua opinião</b>: a sessão no diário e a nota de cada episódio, com spoiler protegido.</sub></td>
    <td><img src="docs/readme/explorar.jpg" alt="Explorar com listas e filtros"><br><sub><b>Explorar</b>: listas do cofre, estreias e o catálogo com filtros.</sub></td>
  </tr>
</table>

<table>
  <tr>
    <td width="33%"><img src="docs/readme/mobile-titulo.jpg" alt="Página do título no celular"></td>
    <td width="33%"><img src="docs/readme/mobile-diario.jpg" alt="Diário no celular"></td>
    <td width="34%"><img src="docs/readme/busca.jpg" alt="Busca com sugestões"><br><sub><b>Busca</b>: sugestões enquanto digita, com o trecho buscado em destaque.</sub><br><br><sub>Funciona do celular ao desktop, com foco visível no teclado e respeito ao "reduzir movimento" do sistema.</sub></td>
  </tr>
</table>

<sub>Capturas no modo demonstração, que roda sem token e mostra os pôsteres como blocos de cor. Com o token do TMDB, aparecem os pôsteres, fotos e fundos reais.</sub>

<a id="identidade"></a>

## 🎨 Identidade visual

**Cofre, não streaming.** O CineVault não quer parecer mais uma vitrine vermelha de streaming. Ele é um acervo pessoal e catalogado: fundos escuros que deixam os pôsteres brilharem, latão como único destaque e etiquetas de catálogo como as de um arquivo.

<p align="center">
  <img src="docs/readme/identidade.jpg" alt="Painel de identidade: paleta, tipografia e componentes" width="880">
</p>

| Papel | Nome | Hex |
| --- | --- | --- |
| Fundo | Breu | `#0D0E12` |
| Superfícies | Grafite e Chumbo | `#15171D` · `#1D2028` |
| Texto | Papel | `#EEE8DC` |
| Destaque | Latão | `#D9A54A` |
| Em alta e spoilers | Brasa | `#E2674A` |

- **Fraunces** para títulos e números grandes, **Manrope** para a interface e **JetBrains Mono** para as etiquetas de catálogo.
- O diário usa **canhotos de ingresso**, as notas são **selos** e a nota do público aparece num **mostrador de cofre**.
- O carregamento é a roda do cofre girando a combinação, para um lado e para o outro.

## 🧱 Tecnologias

- **[Next.js 16](https://nextjs.org)** com App Router, **React 19** e **TypeScript**
- **CSS Modules** e design tokens próprios, sem framework de CSS. Cada componente tem seu estilo isolado.
- **[API do TMDB](https://developer.themoviedb.org)** para o catálogo, chamada só no servidor e com cache
- **Fontsource** para servir as fontes pelo próprio site
- Toda a lógica do catálogo fica em `web/src/services/catalog` e a dos dados do usuário em `web/src/services/user`. As páginas nunca chamam a API diretamente.

<a id="como-rodar"></a>

## 🚀 Como rodar

Você precisa do **Node.js 20.9** ou mais novo.

```bash
git clone https://github.com/pedrobaschoni/CineVault.git
cd CineVault/web
npm install
cp .env.example .env.local
npm run dev
```

Abra **http://localhost:3000**.

**Token do TMDB.** Crie uma conta gratuita no [TMDB](https://www.themoviedb.org), vá em **Configurações › API** e copie o **token de leitura da API** para o `.env.local`:

```env
TMDB_API_TOKEN=eyJ...
```

> Sem token, o site roda em **modo demonstração**, com cerca de 40 títulos de exemplo. Dá para testar tudo antes mesmo de criar a conta.

Os detalhes técnicos (rotas, estrutura de pastas e convenções) estão no [README do frontend](web/README.md).

## 📁 Estrutura do repositório

```
CineVault/
├── web/          frontend atual (Next.js): é aqui que o projeto vive
├── backend/      espaço reservado para a API, nas próximas fases
├── frontend-2/   versão antiga, mantida só como referência
└── docs/         imagens deste README
```

<a id="roadmap"></a>

## 🛣️ Roadmap

- [x] **Fase 1: fundação e identidade.** Design tokens, componentes, navegação, landing e "Sobre".
- [x] **Fase 2: catálogo real.** TMDB, páginas de título e de pessoa, Explorar, busca e a abertura do cofre.
- [ ] **Fase 3: dados do usuário.** Diário, opiniões, episódios e listas já funcionam, salvos no navegador. Faltam o login e as páginas de listas e perfil.
- [ ] **Fase 4: experiência.** Estatísticas pessoais e a comunidade, com reviews públicas e ranking de usuários.
- [ ] **Fase 5: diferenciais.**
  - Cofre do ano, uma retrospectiva anual.
  - Compatibilidade de gosto entre amigos.
  - Importação do Letterboxd e do MyAnimeList.
- [ ] **Backend** para salvar tudo na nuvem e sincronizar entre aparelhos.

## 🙏 Créditos

<a href="https://www.themoviedb.org"><img src="https://img.shields.io/badge/The%20Movie%20Database-0D0E12?style=flat-square&logo=themoviedatabase&logoColor=01B4E4" alt="TMDB"></a>

Os dados de filmes, séries e pessoas vêm do [TMDB](https://www.themoviedb.org). **Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB.** Os dados de onde assistir vêm do [JustWatch](https://www.justwatch.com), por meio do TMDB.

---

<p align="center">
  Feito por <a href="https://github.com/pedrobaschoni">Pedro Baschoni</a>.<br>
  <sub>Se o CineVault te deu uma ideia, deixe uma ⭐ no repositório.</sub>
</p>
